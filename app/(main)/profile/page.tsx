"use client";

import { useEffect, useState } from "react";
import { Post } from "@/components/Post";

interface ProfilePost {
  id: string;
  content: string;
  emotion: string;
  hasTriggerWarning: boolean;
  createdAt: string;
  likeCount: number;
  commentCount: number;
}

interface ProfileData {
  id: string;
  username: string;
  bio: string | null;
  createdAt: string;

  _count: {
    posts: number;
    comments: number;
    likes: number;
  };

  posts: ProfilePost[];
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProfile() {
      const res = await fetch("/api/profile");

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const data = await res.json();

      setProfile(data.profile);
      setLoading(false);
    }

    getProfile();
  }, []);

  if (loading) {
    return <div className="mt-10 text-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="mt-10 text-center">Profile not found.</div>;
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col mt-8">
      <div>
        <div className="text-[11px] text-gray-400 font-ibm">
          @{profile.username}
        </div>

        <div className="text-[28px] font-sans font-bold italic">
          {profile.bio || "No bio yet"}
        </div>

        <div className="flex gap-4">
          <div>
            <div className="text-[16px] mt-2">
              {profile._count.posts}
            </div>

            <div className="font-ibm text-gray-400 text-[9.5px] uppercase">
              Posts
            </div>
          </div>

          <div>
            <div className="text-[16px] mt-2">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>

            <div className="font-ibm text-gray-400 text-[9.5px] uppercase">
              Date Joined
            </div>
          </div>
        </div>

        <div className="flex gap-2 tracking-widest text-[10.5px] mt-4 mb-4">
          <button className="font-ibm border border-border py-2 px-3 uppercase">
            Edit Account
          </button>

          <button className="font-ibm border border-border py-2 px-3 uppercase">
            Delete Account
          </button>
        </div>
      </div>

      <hr className="border-border" />

      <div className="text-gray-400 uppercase text-[10.5px] mt-4">
        Your Confessions
      </div>

      {profile.posts.map((post) => (
        <Post
          key={post.id}
          anonymousOrId="anonymous"
          commentNumber={post.commentCount}
          content={post.content}
          time={new Date(post.createdAt).toLocaleDateString()}
          hasTriggerWarning={post.hasTriggerWarning}
          moodName={post.emotion}
          likeNumber={post.likeCount}
        />
      ))}
    </div>
  );
}