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