# REMEBER PAGINATION

# 1. Real-Time Anonymous Emotion Platform

A serious production-level social platform where users can anonymously share emotions, confessions, thoughts, and experiences in real time.

## Features

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

app/api/
├── auth/
│   ├── register/route.ts       POST
│   ├── login/route.ts          POST
│   └── logout/route.ts         POST   [new]
├── feed/
│   └── route.ts                GET  (?emotion=Lonely)
├── posts/
│   ├── route.ts                POST  (create)
│   └── [postId]/
│       ├── route.ts            GET, DELETE
│       ├── comments/route.ts   POST
│       └── likes/route.ts      POST  (toggle relate)
├── comments/
│   └── [commentId]/route.ts    DELETE   (drop PATCH — no edit UI exists)
└── profile/
    ├── route.ts                GET (own profile + own posts), PATCH, DELETE  (real delete)
    └── password/route.ts       PATCH   [new]

 ```