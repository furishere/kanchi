# REMEBER PAGINATION

# 1. Real-Time Anonymous Emotion Platform

A serious production-level social platform where users can anonymously share emotions, confessions, thoughts, and experiences in real time.

## Features

### Will add friend feature later
``` bash
✅ Auth
✅ Profile
✅ Posts
✅ Comments
✅ Likes

⬜ Public Profiles
⬜ User Search
⬜ Avatar Upload
⬜ Banner Upload
⬜ Feed
⬜ Pagination
⬜ Notifications
⬜ Saved Posts
⬜ Trending Tags
⬜ Image Posts
⬜ Deployment
```

### Core Features
- User Authentication (JWT/OAuth)
- User Profiles
- Post Confessions and Emotions
- Real-Time Comments
- Reactions (Like, Support, Empathy, etc.)
- AI Toxicity Filtering
- Content Moderation Dashboard
- Infinite Scrolling Feed
- Notifications
- Image Uploads
- Post Recommendation Algorithm
- Search Functionality
- Dark Mode
- Mobile Responsive Design
- Analytics Dashboard

### Advanced Features
- WebSockets with Socket.IO
- Redis Caching
- API Rate Limiting
- Background Jobs & Queues
- AI Sentiment Analysis
- Real-Time Online Users
- Email Verification
- CDN Optimization

---

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS

### Backend
- Next.js API Routes **or** Separate Node.js Backend
- Express.js (Optional)

### Database
- PostgreSQL

### ORM
- Prisma

### Cache
- Redis

### File Storage
- Cloudinary or AWS S3

### Authentication
- Better Auth or NextAuth

### Deployment
- Docker
- VPS / AWS

---

## System Design Components

- Authentication Service
- User Service
- Post Service
- Comment Service
- Notification Service
- Moderation Service
- Recommendation Engine
- Sentiment Analysis Service
- Realtime Gateway (Socket.IO)
- Redis Cache Layer
- PostgreSQL Database
- Cloud Storage Layer

---

## What You Learn

### Backend Engineering
- Building scalable REST APIs
- Authentication & Authorization
- Database Design
- Database Optimization
- Caching Strategies
- Background Job Processing

### Frontend Engineering
- Advanced Next.js
- TypeScript at Scale
- State Management
- Responsive UI Design
- Infinite Scroll Implementation

### Realtime Systems
- WebSockets
- Live Notifications
- Presence Detection
- Realtime Commenting

### DevOps
- Docker
- CI/CD Basics
- Cloud Deployment
- CDN Optimization

### AI Integration
- Sentiment Analysis
- Toxicity Detection
- Content Moderation

### Software Architecture
- Production-Grade Project Structure
- Scalable System Design
- Service Separation
- Performance Optimization

---
```bash
src/
├── app/
│   └── api/
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   └── mail.ts
│
├── validations/
│   ├── auth.ts
│   ├── post.ts
│   └── comment.ts
│
├── services/
│   ├── auth.service.ts
│   ├── post.service.ts
│   └── friend.service.ts
│
└── generated/
```
---

```bash
app/
├── api/
│   ├── auth/
│   │   ├── register/
│   │   │   └── route.ts
│   │   ├── login/
│   │   │   └── route.ts
│   │   ├── forgot-password/
│   │   │   └── route.ts
│   │   └── verify-email/
│   │       └── route.ts
│   │
│   ├── posts/
│   │   ├── route.ts
│   │   └── [postId]/
│   │       └── route.ts
│   │
│   ├── comments/
│   │   └── route.ts
│   │
│   └── friends/
│       ├── request/
│       │   └── route.ts
│       └── accept/
│           └── route.ts
│
└── ...
```

``` bash
✅ Completed
Authentication
✅ Register
✅ Login
✅ JWT Authentication
✅ Protected Routes
✅ Logout
Profile
✅ Get Current Profile
✅ Update Profile
✅ Username validation
✅ Display Name
✅ Bio
✅ Birth Date
Posts
✅ Create Post
✅ Get My Posts
✅ Get Single Post
✅ Edit Post
✅ Delete Post
Comments
✅ Create Comment
✅ Edit Comment
✅ Delete Comment
Likes
✅ Like Post
✅ Unlike Post
✅ Like Count
✅ Check if current user liked
🚧 MVP TODO
✅Public User Profile
✅ GET /api/users/[username]
⬜ Show avatar
⬜ Show banner
⬜ Show username
⬜ Show display name
⬜ Show bio
⬜ Joined date
⬜ Total posts
⬜ User posts
✅ Search
✅ Search users by username
✅ Search users by display name
⬜ Debounced search (frontend)
😊 Emotion Tags

Every post must have exactly one emotion.

Suggested enum:

Lonely
Heartbroken
Hopeful
Grateful
Anxious
Confused
Regretful
Angry
BurnedOut
Loved
Guilty

Backend

⬜ Update Prisma
⬜ Update Validation
⬜ Update Create Post
⬜ Update Edit Post
⬜ Filter by emotion
⚠ Trigger Warnings

Optional field

None
Self Harm
Abuse
Violence
Addiction
Suicide
Eating Disorder

Backend

⬜ Prisma
⬜ Validation
⬜ Create Post
⬜ Edit Post

Frontend

⬜ Blur post
⬜ Click to reveal
👻 Anonymous Posting

Users stay authenticated.

Each post has

anonymous: Boolean

If true

Anonymous

instead of username.

Backend

⬜ Prisma
⬜ Validation
⬜ Create
⬜ Edit
⬜ GET routes
👁 Views
Post
Views

Backend

⬜ View model OR viewCount field
⬜ Increment once
⬜ Return total views
❤️ Support Instead of Likes

Rename in UI

❤️ I relate

🤝 Stay Strong

🙏 Sending Support

Backend can still use Like model.

🚨 Report Post

Reasons

Spam
Harassment
Self Harm
Hate
Violence
Other

Backend

⬜ Prisma
⬜ Create Report API
⬜ Prevent duplicate reports
📤 Share
⬜ Share link
⬜ Copy link API
📌 Save Posts

Backend

⬜ Save model
⬜ Save API
⬜ Remove Save
⬜ Saved posts page
📄 Drafts

Users can save unfinished confessions.

Backend

⬜ Draft model
⬜ Create draft
⬜ Update draft
⬜ Delete draft
⬜ Publish draft
♾ Pagination

Cursor pagination

Endpoints

GET /feed

GET /posts

GET /posts/:id/comments
🌙 Theme
⬜ Dark Mode
⬜ Light Mode
📱 Responsive Design
⬜ Mobile
⬜ Tablet
⬜ Desktop


🚀 Version 2
Friends
⬜ Send request
⬜ Accept
⬜ Reject
⬜ Cancel
⬜ Remove friend
⬜ Mutual friends
Feed Algorithm
Friends only
Emotion filters
Trending
Notifications
Likes
Comments
Friend Requests
Mentions
Image Upload
Avatar
Banner
Post Images
Email Verification
Send email
Verify token
Password Reset

Forgot Password

Reset Password

Realtime
Live comments
Live notifications
Analytics
Views
Supports
Comments
Profile visits
AI
Toxicity Detection
Sentiment Analysis
Mood Insights
Admin
Dashboard
Reports
Ban User
Delete Post
Moderation Queue

🌟 Version 3 (Nice-to-have)
⬜ Communities
⬜ Hashtags
⬜ Mentions
⬜ Pinned Posts
⬜ Scheduled Posts
⬜ Polls
⬜ Voice Posts
⬜ Journaling Mode
⬜ Daily Mood Tracker
⬜ AI Writing Companion

```

``` bash
Edit/Delete comments (if not already complete)
Trending tags
Mention support (@username)
Hashtag search (#lonely, #college)
Report post
Admin moderation
Rate limiting (prevent spam)
Pagination
Deployment
```

```bash
Logout
Verify Email
Forgot Password
Reset Password
Change Password

app/
│
├── (auth)/
│   ├── login/
│   └── register/
│
├── (main)/
│   ├── feed/
│   ├── profile/
│   ├── profile/edit/
│   ├── post/[postId]/
│   └── user/[username]/
│
├── components/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── PostCard.tsx
│   ├── CommentCard.tsx
│   ├── PostForm.tsx
│   ├── UserCard.tsx
│   └── SearchBar.tsx
│
├── hooks/
├── lib/
├── services/
└── types/


/* ─────────────────────────────────────────────────────────
   Kanchi — Design Tokens
   Monochrome "redacted document" system
   ───────────────────────────────────────────────────────── */
 
/* Fonts — import in <head>:
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
*/
 
:root{
  /* ---- color: dark mode (default) ---- */
  --black:#000000;      /* page bg, card bg */
  --white:#FFFFFF;       /* text, primary accent */
  --gray-1:#141414;      /* subtle surface (e.g. redacted bg) */
  --gray-2:#232323;      /* borders, dividers */
  --gray-3:#4A4A4A;      /* stronger borders, input borders */
  --gray-4:#7A7A7A;      /* muted / meta text */
  --gray-5:#B8B8B8;      /* body text */
  --accent:#FFFFFF;       /* stamps, active states, focus rings */
  --accent-dim:#5A5A5A;
 
  /* ---- fonts ---- */
  --font-display:'Newsreader', serif;      /* headlines, wordmark — italic */
  --font-mono:'IBM Plex Mono', monospace;   /* body, labels, meta, buttons */
  --font-sans:'Public Sans', sans-serif;    /* general UI chrome */
 
  /* ---- structure ---- */
  --radius:0px;                 /* square corners everywhere, no exceptions */
  --max-width-app:640px;
  --max-width-site:1080px;
  --transition-fast:.15s ease;
}
 
/* ---- light mode: same variable names, values swap ---- */
body.light{
  --black:#FFFFFF;
  --white:#000000;
  --gray-1:#F1F1F1;
  --gray-2:#E2E2E2;
  --gray-3:#C4C4C4;
  --gray-4:#7A7A7A;      /* unchanged — mid gray reads fine on both */
  --gray-5:#2E2E2E;
  --accent:#000000;
  --accent-dim:#B0B0B0;
}
 
/* ---- global transition for the theme flip ---- */
*{
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}
 
/* ─────────────────────────────────────────────────────────
   Reference component patterns (copy into your stylesheet)
   ───────────────────────────────────────────────────────── */
 
/* Card — outlined, transparent, sits on --black */
.card{
  background:var(--black);
  border:1px solid var(--gray-2);
  border-left:3px solid var(--accent);
  border-radius:var(--radius);
  padding:20px 20px 16px;
}
 
/* Stamp / emotion tag */
.stamp{
  font-family:var(--font-mono);
  font-size:10px;
  letter-spacing:1.4px;
  text-transform:uppercase;
  font-weight:600;
  color:var(--accent);
  border:1px solid var(--accent);
  padding:4px 10px;
}
.stamp.filled{ background:var(--accent); color:var(--black); }
 
/* Redacted / sensitive-content block */
.redacted{
  background:var(--gray-1);
  border:1px dashed var(--accent);
  padding:14px 16px;
}
 
/* Buttons */
.btn{
  font-family:var(--font-mono);
  font-size:11px;
  letter-spacing:1.2px;
  text-transform:uppercase;
  font-weight:600;
  padding:14px;
  border:1px solid var(--white);
  border-radius:var(--radius);
  cursor:pointer;
}
.btn-fill{ background:var(--white); color:var(--black); }
.btn-fill:hover{ background:transparent; color:var(--white); }
.btn-ghost{ background:none; border-color:var(--gray-3); color:var(--gray-4); }
.btn-ghost:hover{ border-color:var(--white); color:var(--white); }
 
/* Theme toggle switch */
.theme-toggle .track{
  width:32px; height:17px;
  border:1px solid var(--gray-4);
  position:relative;
}
.theme-toggle .knob{
  position:absolute; top:1px; left:1px;
  width:13px; height:13px;
  background:var(--white);
  transition:left var(--transition-fast), background var(--transition-fast);
}
body.light .theme-toggle .knob{ left:16px; background:var(--black); }
 
/* Headline / wordmark text */
.headline, .wordmark{
  font-family:var(--font-display);
  font-style:italic;
  font-weight:400;
}
 
/* Meta / label text */
.meta, .label{
  font-family:var(--font-mono);
  font-size:10.5px;
  letter-spacing:0.8px;
  text-transform:uppercase;
  color:var(--gray-4);
}
 
/* Body copy */
.body-text{
  font-family:var(--font-mono);
  font-size:14.5px;
  line-height:1.65;
  color:var(--gray-5);
}
# Kanchi — Design System
 
Monochrome "redacted document" aesthetic. No unique hue anywhere — `--accent`
is always whichever of black/white contrasts with the current theme.
 
## Fonts
 
| Role | Font | Weights | Usage |
|---|---|---|---|
| Headlines / wordmark | **Newsreader** (italic) | 400, 500 | `<h1>`, logo, section titles |
| Body, labels, meta, buttons | **IBM Plex Mono** | 400, 500, 600 | post text, tags, timestamps, buttons |
| UI chrome | **Public Sans** | 400, 500, 600, 700 | nav, general layout text |
 
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Public+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```
 
## Color tokens
 
### Dark (default)
```
--black       #000000   page bg, card bg
--white       #FFFFFF   text, primary accent
--gray-1      #141414   subtle surface (redacted bg)
--gray-2      #232323   borders, dividers
--gray-3      #4A4A4A   stronger borders, inputs
--gray-4      #7A7A7A   muted / meta text
--gray-5      #B8B8B8   body text
--accent      #FFFFFF   stamps, active states, focus
--accent-dim  #5A5A5A
```
 
### Light (`body.light`)
```
--black       #FFFFFF
--white       #000000
--gray-1      #F1F1F1
--gray-2      #E2E2E2
--gray-3      #C4C4C4
--gray-4      #7A7A7A   (unchanged — mid gray works both ways)
--gray-5      #2E2E2E
--accent      #000000
--accent-dim  #B0B0B0
```
 
Toggle theme by adding/removing the `light` class on `<body>`. Everything
downstream references the same variable names, so no component-level changes
are needed.
 
## Structure
 
- **Corner radius:** `0px` everywhere — square corners, no exceptions
- **Max width:** `640px` for app screens, `1080px` for the landing page
- **Transitions:** `background-color`, `border-color`, `color` at `.15s ease`
  on `*` — this is what makes the theme toggle feel like a flip, not a flash
## Core components
 
| Component | Pattern |
|---|---|
| **Card** | `1px solid --gray-2` border, `3px solid --accent` left edge, bg `--black` |
| **Stamp** (emotion tag) | `1px solid --accent` outline, mono uppercase, letter-spacing 1.4px. `.filled` variant inverts to solid `--accent` bg |
| **Redacted block** | `1px dashed --accent` border, `--gray-1` bg — used for trigger-warned posts |
| **Button (filled)** | `--white` bg / `--black` text (dark mode) → inverts to transparent + `--white` border/text on hover |
| **Button (ghost)** | transparent, `--gray-3` border → `--white` border/text on hover |
| **Theme toggle** | 32×17px track, `1px --gray-4` border, 13px knob sliding 1px → 16px |
 
## Typography scale
 
| Use | Font | Size | Notes |
|---|---|---|---|
| Hero headline | Newsreader italic | 52px | letter-spacing -0.5px |
| Section heading | Newsreader italic | 32px | |
| Card headline / feature title | Newsreader italic | 18–21px | |
| Body / confession text | IBM Plex Mono | 14.5px | line-height 1.65 |
| Labels / meta / buttons | IBM Plex Mono | 10–11px | uppercase, letter-spacing 0.8–1.5px |
 
## Files in this system
 
- `design-tokens.css` — drop-in variables + reference component CSS
- `kanchi-preview-bw.html` — full app preview (Feed, Compose, Post, Profile, Auth)

```