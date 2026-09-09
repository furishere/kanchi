Given where Kanchi is (auth + Google OAuth + JWT, email verification, Socket.IO/Redis/Postgres, and a cleaned-up API layer), here's what would actually push it from "working project" to "shippable product":

**Backend — things that add real depth**

- **Content moderation pipeline** — since it's anonymous confessions, you need automated toxicity/spam/CSAM-pattern filtering before content goes live. A queue (BullMQ on your existing Redis) that runs each post through a moderation check, with a manual review dashboard for flagged content, is a legitimately hard systems problem and a must-have for anything anonymous and public-facing.
- **Rate limiting & abuse prevention** — per-IP and per-account rate limits on posting/reacting (Redis sorted sets or token bucket), device fingerprinting to catch ban-evasion via new accounts, shadowbanning for repeat offenders instead of hard bans.
- **Real-time fan-out architecture** — if reactions/comments are live via Socket.IO, think about how you scale that beyond one server: Redis pub/sub adapter for Socket.IO so multiple instances stay in sync, and room-based broadcasting instead of blasting every event to every client.
- **Feed ranking** — instead of pure reverse-chronological, a simple ranking score (recency decay + engagement) computed in a background job and cached in Redis. This is where you can flex actual algorithm design.
- **Data lifecycle** — soft-delete + scheduled hard-delete jobs for old confessions, GDPR-style "delete my data" endpoint that cascades properly (you already fixed cascade-delete bugs, so extend that into a real data-retention policy).
- **Notification system** — email digests (Resend, which you already have) or in-app notifications for replies/reactions, decoupled via a job queue rather than sent inline in the request.
- **Audit logging** — since identity-leak bugs were a past issue, a structured audit log of who accessed/modified what (even for anonymous data) protects you if you ever need to debug a leak again.

**Frontend — things that make it feel like a product, not a demo**

- **Optimistic UI** for posting/reacting, with rollback on failure — makes the real-time feel instant instead of request-driven.
- **Infinite scroll with cursor-based pagination** (not offset) tied to your feed ranking.
- **Onboarding/empty states** — first-time user flow, empty feed states, loading skeletons — these are usually skipped and are what make something look unfinished.
- **PWA basics** — installable, offline fallback page, push notifications for replies (ties into the notification system above).
- **Accessibility pass** — keyboard nav, ARIA labels, focus management on your modals — often ignored but is a real differentiator.

**If you want one focus area to go deep on**, I'd pick the **moderation pipeline** — it's the single feature that's both technically substantial (queues, async processing, ML/API integration, review UI) and existentially necessary for an anonymous platform. Want me to sketch out the architecture for that specifically?

# Kanchi — Product Architecture Plan

**Goal:** move Kanchi from "working anonymous confession app" to a platform that can survive real traffic, real abuse, and real scale — without you having to re-architect it later.

Current stack (unchanged, everything below builds on top of it):
- **Frontend:** Next.js
- **Auth:** Custom JWT + hand-rolled Google OAuth (no NextAuth)
- **Email:** Resend (verification tokens already in place)
- **Realtime:** Socket.IO
- **Cache/queue substrate:** Redis
- **DB/ORM:** PostgreSQL + Prisma

---

## 0. Why this order matters

Anonymous, public, emotion-heavy content is the single riskiest combination for a small platform — it invites abuse, and abuse (if unmoderated) is what kills a community-driven app faster than any bug. So the build order below is **not** feature-priority, it's **risk-priority**: moderation and abuse prevention come before feed ranking or PWA polish, because those two are the difference between a usable product and a liability.

Suggested phase order:
1. Moderation pipeline
2. Rate limiting & abuse prevention
3. Audit logging (cheap to add now, painful to retrofit later)
4. Real-time fan-out scaling
5. Data lifecycle / retention
6. Feed ranking
7. Notifications
8. Frontend polish (optimistic UI, infinite scroll, onboarding, PWA, accessibility)

---

## 1. Moderation Pipeline

### Why you need it
Anonymous + public + emotional content = the highest-risk content category there is (harassment, self-harm content, CSAM-adjacent risk, targeted abuse, spam). If you don't moderate before content is visible, you're one viral bad post away from a platform-ending PR or legal problem. This is not optional for a product you intend to actually launch.

### Architecture
```
User submits confession
        │
        ▼
POST /api/confessions  ──▶  Insert row (status: PENDING)
        │
        ▼
Enqueue job → BullMQ (Redis-backed queue)
        │
        ▼
Moderation Worker (separate process/thread)
   ├─ Text classifier (see below)
   ├─ Rule-based filters (regex/keyword lists, banned patterns)
   └─ Score aggregation
        │
        ├─ Score < threshold_low   → status: APPROVED  → visible instantly
        ├─ threshold_low–high      → status: FLAGGED    → held for human review
        └─ Score > threshold_high  → status: REJECTED   → never shown, author notified
```

### Data model additions (Prisma)
```prisma
model Confession {
  // ...existing fields
  status         ModerationStatus @default(PENDING)
  moderationScore Float?
  moderatedAt    DateTime?
  flaggedReason  String?
}

enum ModerationStatus {
  PENDING
  APPROVED
  FLAGGED
  REJECTED
}

model ModerationLog {
  id           String   @id @default(cuid())
  confessionId String
  score        Float
  reason       String?
  action       ModerationStatus
  reviewedBy   String?   // null = automated, else admin user id
  createdAt    DateTime @default(now())
}
```

### Implementation choices
- **Queue:** BullMQ on your existing Redis instance — no new infra.
- **Classifier options (pick one to start):**
  - Cheapest/fastest to ship: call a moderation API (OpenAI Moderation endpoint or Perspective API) from the worker — free/cheap tier is enough at your current scale.
  - More "systems complexity" if that's a goal for your portfolio: run a small local classifier (e.g. a distilled toxicity model via `@xenova/transformers` in Node) so you own the whole pipeline without external API dependency.
- **Human review dashboard:** an internal `/admin/moderation` route (protect with a role check on your existing JWT) listing FLAGGED items with approve/reject buttons — writes to `ModerationLog`.
- **Author feedback:** when REJECTED, don't just silently drop it — return a soft message so users understand (without revealing exact detection rules, or people will learn to route around them).

### Build steps
1. Add `ModerationStatus` enum + fields to `Confession`, migrate.
2. Stand up BullMQ worker as a separate Node process (`worker.ts`), connected to same Redis.
3. Wire `POST /api/confessions` to insert as PENDING and enqueue instead of returning it live.
4. Implement classifier call in worker, write score + status back.
5. Filter all public feed queries to `status: APPROVED` only.
6. Build minimal admin review UI for FLAGGED queue.

---

## 2. Rate Limiting & Abuse Prevention

### Why you need it
Without this, one script can spam thousands of confessions per minute, one bad actor can flood a target with reactions/comments, and banned users can just make a new account in 10 seconds. This is what actually protects the moderation pipeline you just built from being overwhelmed.

### Architecture
- **Per-IP + per-account sliding-window rate limiter** using Redis (sorted sets, `ZADD`/`ZREMRANGEBYSCORE` pattern, or a library like `rate-limiter-flexible` backed by your existing Redis).
- Limits to define:
  - Posting: e.g. 5 confessions / 10 min per account, 20 / hour per IP.
  - Reactions/comments: higher limits but still capped, since these are cheaper to spam.
  - Login/OAuth attempts: strict limit to prevent credential stuffing.
- **Device fingerprinting** (lightweight — `FingerprintJS` on the client, hashed and stored) to catch the "new account, same device" ban-evasion pattern. Not foolproof, but raises the cost of evasion.
- **Shadowbanning:** instead of hard-banning obvious abusers (which teaches them they've been caught and to make a new account), mark them `shadowbanned: true` — their posts still "succeed" from their point of view but never pass moderation/never appear publicly. This is a real technique worth implementing for the portfolio value alone.

### Data model additions
```prisma
model User {
  // ...existing fields
  shadowbanned   Boolean  @default(false)
  deviceFingerprints String[] // hashed fingerprint ids seen for this user
}
```

### Build steps
1. Add `rate-limiter-flexible` with Redis backend.
2. Middleware layer on posting/reaction/auth routes checking both IP and account keys.
3. Add fingerprint capture on client, send with signup/post requests, store hashed.
4. Add `shadowbanned` flag + check in moderation worker (auto-flag/reject everything from shadowbanned users without telling them).

---

## 3. Audit Logging

### Why you need it
You already hit identity-leak bugs once. The fix for "we don't know how/when that happened" is a structured, append-only log of who (or what system) touched sensitive data and when — so if it happens again, you can actually answer the question instead of guessing.

### Architecture
- A single `AuditLog` table, written to on every sensitive action: content deletion, moderation decisions, admin actions, data export/delete requests, auth events (login, password/OAuth changes).
- Write via a thin `logAudit(actorId, action, targetId, metadata)` helper called from route handlers — not automatic, so you stay deliberate about what's logged (and don't log confession *content* itself, just actions on it).

### Data model
```prisma
model AuditLog {
  id        String   @id @default(cuid())
  actorId   String?  // null = system/anonymous
  action    String   // e.g. "confession.delete", "moderation.reject", "user.ban"
  targetId  String?
  metadata  Json?
  createdAt DateTime @default(now())
}
```

### Build steps
1. Add table + helper function.
2. Call it from: confession delete, moderation approve/reject, admin ban/shadowban actions, data-deletion requests, auth events.
3. Build a simple `/admin/audit` searchable view (filter by action/actor/date).

---

## 4. Real-Time Fan-Out Scaling

### Why you need it
Right now, if Socket.IO is running on a single server instance, it works — but it can't scale horizontally, and every event broadcasts to more clients than necessary. This matters the moment you deploy more than one instance (which you'll need to under real load) — without this, users on different server instances simply won't see each other's events.

### Architecture
```
Client A ──ws──▶ Server Instance 1 ─┐
                                     ├─▶ Redis Pub/Sub (Socket.IO adapter)
Client B ──ws──▶ Server Instance 2 ─┘
```
- Use `@socket.io/redis-adapter` (built for exactly this, uses your existing Redis).
- Switch from broadcasting to *all* clients to **room-based** broadcasting — e.g. a room per confession thread, so a reaction on post X only fans out to clients currently viewing post X, not every connected client.

### Build steps
1. Install `@socket.io/redis-adapter`, wire it to existing Redis connection.
2. Refactor event emission to use `io.to(roomId).emit(...)` instead of global `io.emit(...)`.
3. Join clients to rooms based on which confession/thread they're viewing; leave on unmount.

---

## 5. Data Lifecycle & Retention

### Why you need it
Anonymous doesn't mean permanent. Indefinite storage of emotionally sensitive content is a liability (and if you ever want EU users, a legal requirement under GDPR's "right to erasure"). You already fixed cascade-delete bugs — this extends that fix into an actual policy instead of a one-off patch.

### Architecture
- **Soft delete first:** `deletedAt` timestamp field, filtered out of all queries via a Prisma middleware (so you don't have to remember to add `deletedAt: null` everywhere).
- **Scheduled hard-delete job:** a cron (BullMQ repeatable job) that permanently purges soft-deleted rows older than N days (e.g. 30) — cascades through comments/reactions properly, reusing your existing cascade-delete fix.
- **User-triggered "delete my data" endpoint:** marks all of a user's content + account soft-deleted immediately, queues immediate hard-delete rather than waiting for the cron.

### Build steps
1. Add `deletedAt` to relevant models, add Prisma middleware to auto-filter.
2. Add BullMQ repeatable job (daily) for hard-delete sweep.
3. Add `DELETE /api/account` endpoint that triggers full cascade soft-delete + immediate purge job.

---

## 6. Feed Ranking

### Why you need it
Pure reverse-chronological feeds bury good content fast and reward spam-posting frequency over quality. A ranking layer is also the single most portfolio-impressive backend feature here — it's real algorithm design, not CRUD.

### Architecture
- Compute a **score** per confession: `score = engagement_weight * log(1 + reactions + comments) - time_decay(age)`.
- Recompute scores in a background job (BullMQ, every few minutes) rather than on every read — write the score back to the row, index it, and serve feed queries pre-sorted.
- Cache the top-N feed page in Redis (short TTL, e.g. 60s) since it's read far more than it's written.

### Data model
```prisma
model Confession {
  // ...existing fields
  rankScore Float @default(0)
  @@index([rankScore])
}
```

### Build steps
1. Add `rankScore` field + index.
2. Background job recalculating scores for recently-active confessions.
3. Feed query: `ORDER BY rankScore DESC`, paginated (see frontend section for cursor pagination).
4. Redis cache layer in front of the feed endpoint.

---

## 7. Notifications

### Why you need it
Retention on an anonymous platform depends entirely on "did something happen to my post" — without notifications, users have no reason to come back. Decoupling this from the request/response cycle (rather than sending inline) keeps your API fast and makes it easy to add channels later (push, in-app) without touching core logic.

### Architecture
```
Reaction/Comment created
        │
        ▼
Enqueue notification job (BullMQ)
        │
        ▼
Notification Worker
   ├─ In-app: insert into Notification table (read by client via polling or socket push)
   └─ Email digest: batch unread notifications, send via Resend on a schedule (not per-event)
```

### Data model
```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  type      String   // "reaction", "comment", "reply"
  targetId  String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

### Build steps
1. Add `Notification` table.
2. Enqueue job on reaction/comment creation events.
3. Worker inserts `Notification` row + emits socket event to that user's room if online.
4. Separate daily BullMQ job: batch unread notifications per user, send one digest email via Resend (not one email per event — avoids spamming inboxes).

---

## 8. Frontend Polish

### Why this matters
This is what separates "I built the backend for a class project" from "I shipped a product." Reviewers and users notice these details even when they can't name them.

| Feature | Why | Notes |
|---|---|---|
| **Optimistic UI** | Real-time feels instant instead of round-trip-dependent | Update local state immediately on post/react, roll back on server error |
| **Cursor-based infinite scroll** | Offset pagination breaks under a ranked, constantly-reordering feed | Use `rankScore` + `id` as a compound cursor |
| **Onboarding/empty states** | Unfinished-looking apps lose first-time users in seconds | Empty feed state, first-post prompt, loading skeletons everywhere data loads |
| **PWA basics** | Installable + offline fallback signals a "real app" | Web manifest, service worker with offline fallback page, push notifications (ties into §7) |
| **Accessibility pass** | Real differentiator, often skipped entirely | Keyboard nav through feed/modals, ARIA labels on interactive elements, visible focus states |

---

## Suggested Build Order (condensed)

1. **Week 1–2:** Moderation pipeline (§1) + rate limiting (§2) — nothing should ship publicly without these.
2. **Week 2:** Audit logging (§3) — cheap, do it while the moderation/rate-limit code is fresh.
3. **Week 3:** Real-time fan-out scaling (§4) + data lifecycle (§5).
4. **Week 4:** Feed ranking (§6).
5. **Week 5:** Notifications (§7).
6. **Ongoing:** Frontend polish (§8) — layer in throughout, not as a final pass.

## New infra summary
- No new services required — everything above reuses **Redis** (queues via BullMQ, pub/sub for Socket.IO, rate limiting, caching) and **PostgreSQL/Prisma** (new tables/fields only).
- One new process: a **worker** process running BullMQ consumers (moderation, notifications, ranking, cleanup jobs) — separate from your Next.js API process.