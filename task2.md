 **Next.js + TypeScript, PostgreSQL + Prisma, Redis, Socket.IO, Resend, and your own JWT/Google OAuth**. It fits Kanchi well, and switching would cost you more than it gains. The part to get right is how you structure it.

## 1. Design anonymity first

Everything else hangs off this.

- Keep identity and content in separate tables. `User` holds the email, password hash and Google ID. `Post` never exposes a user ID to the client.
- For ownership and abuse bans, store `authorRef = HMAC(SECRET, userId)` on posts, or keep the real `authorId` in a column that only an admin-only code path can read.
- Make the pseudonym deterministic per post: `HMAC(SECRET, userId + postId)` mapped to a word list ("Quiet Fox"). The same person then has a different name on every confession.
- Return data only through explicit DTOs (Prisma `select`), never raw models. Use random IDs (cuid or ulid), never sequential ones.
- Reactions are counts only, with no "who reacted" lists. Never log a user ID next to a post ID in your app logs.
- Socket.IO rooms and event payloads follow the same rule. This is where leaks usually creep in.

## 2. Architecture

Build a modular monolith with three layers: route handler, service, repository.

```
src/
  app/api/...            # thin route handlers: parse, auth, call service
  server/
    auth/                # jwt, oauth, sessions, password hashing
    posts/ comments/ reactions/ notifications/
    moderation/          # rules, classifier, queue, actions
    ratelimit/           # redis sliding window
    realtime/            # event publishers
    jobs/                # BullMQ workers
  lib/                   # db, redis, env (zod), logger
realtime/                # separate Socket.IO service
prisma/
```

- Validate every request body with **Zod**.
- Run the **Socket.IO server as its own Node process**. Serverless platforms like Vercel can't hold WebSockets open. Use the Redis adapter so you can run more than one instance, and authenticate the handshake with the JWT.
- API routes publish events to Redis pub/sub, and the socket service fans them out. Rooms: `feed:all`, `feed:mood:lonely`, `post:{id}`, `user:{id}` for notifications.
- Use **BullMQ** (on Redis) for background jobs: moderation scans, emails, notification fan-out, and retention cleanup.

## 3. Auth hardening

- Use a short-lived access JWT (about 15 minutes) in an httpOnly, SameSite cookie. Pair it with a rotating refresh token that is stored hashed in the database, so you can revoke it.
- Hash passwords with argon2id.
- Google OAuth needs `state` and PKCE.
- Email codes should be stored hashed, expire in 10 minutes, and allow only 5 attempts.
- Add an origin check for CSRF.

## 4. Moderation pipeline

This is a core feature for a confession platform.

1. **Synchronous checks** when a post is submitted: length, blocklist, and regexes for phones, emails and links (this protects anonymity).
2. **Asynchronous classifier** for toxicity and self-harm, run through a queue.
3. **States:** `pending → published | held | removed`.
4. **Crisis content** should trigger support resources for the author, not silent removal.
5. Reports go to a review queue. Every moderator action goes into an append-only `AuditLog`.

## 5. Redis uses

- Rate limiting: sliding window per user and per IP, with stricter limits on posting, login and code verification.
- Caching of the hot feed.
- Pub/sub for realtime.
- Job queues.
- A token denylist.

## 6. Data model

- `User`, `RefreshToken`, `VerificationToken`
- `Post` (`body`, `mood`, `hasCW`, `status`, `authorRef`, `createdAt`)
- `Comment` (same author-reference approach, with `parentId`)
- `Reaction`, with a unique constraint on `(userId, postId, type)`
- `Notification`, `Report`, `ModerationAction`, `AuditLog`

Index `Post` on `(status, createdAt desc, id)` and `(mood, status, createdAt desc, id)`. Use **keyset (cursor) pagination**, not offset.

## 7. Feed ranking

Start with chronological order plus mood filters. Later, add a time-decayed score such as `felt / (ageHours + 2)^1.5`. Avoid anything that rewards engagement-baiting.

## 8. Operations

- Logging with **pino**, redacting sensitive fields, plus Sentry for errors.
- Tests with Vitest for unit tests and Playwright for end-to-end, using Testcontainers for a real Postgres.
- Docker Compose for local Postgres and Redis.
- Run a GitHub Actions pipeline that does lint, type-check, test and migrate.
- Check your legal obligations around takedowns and grievance handling under Indian rules.

## Build order

1. Schema and hardened auth.
2. Posts, feed and reactions, using DTOs.
3. Rate limiting and the moderation pipeline.
4. Realtime service.
5. Notifications and retention jobs.
6. Ranking.

If you want, I can start with the Prisma schema and the identity-separation layer, since everything else builds on them.