"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Post } from "@/components/post/Post";
import { Buttons } from "@/components/pagesComponent/button";

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
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  function editProfile() {
    router.push("/profile/edit");
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account?"
    );

    if (!confirmed) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/profile", {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);

      router.push("/register");
      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    async function getProfile() {
      try {
        const res = await fetch("/api/profile", {
          cache: "no-store",
        });

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        setProfile(data.profile);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
  }, []);

  if (loading) {
    return (
      <div className="mt-10 text-center font-ibm uppercase">
        Loading...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mt-10 text-center font-ibm uppercase">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 flex w-full max-w-xl flex-col">
      <div className="flex justify-center flex-col items-center xl:items-start">
        <div className="font-ibm text-[11px] text-gray-4">
          @{profile.username}
        </div>

        <div className="font-sans text-[28px] italic font-bold">
          {profile.bio || "No bio yet"}
        </div>

        <div className="mt-2 flex gap-6">
          <div>
            <div className="text-[16px] font-ibm">
              {profile._count.posts}
            </div>

            <div className="font-ibm text-[9.5px] uppercase text-gray-4">
              Posts
            </div>
          </div>

          <div>
            <div className="text-[16px] font-ibm">
              {new Date(profile.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </div>

            <div className="font-ibm text-[9.5px] uppercase text-gray-4">
              Joined
            </div>
          </div>
        </div>

        <div className="mb-4 mt-5 flex gap-2">
          <Buttons
            children="Edit Profile"
            variant="tertiary"
            onClick={editProfile}
          />

          <Buttons
            children={deleting ? "Deleting..." : "Delete Account"}
            variant="tertiary"
            onClick={deleteAccount}
          />
        </div>
      </div>

      <hr className="border-border" />

      <div className="mt-4 text-[10.5px] uppercase text-gray-4 font-ibm text-center xl:text-left">
        Your Confessions
      </div>

      {profile.posts.length === 0 ? (
        <div className="mt-6 text-center font-ibm text-[12px] text-gray-400">
          You haven't posted anything yet.
        </div>
      ) : (
        profile.posts.map((post) => (
          <Post
          postId={post.id}
            key={post.id}
            anonymousOrId="anonymous"
            moodName={post.emotion}
            hasTriggerWarning={post.hasTriggerWarning}
            time={new Date(post.createdAt).toLocaleDateString()}
            content={post.content}
            commentNumber={post.commentCount}
            likeNumber={post.likeCount}
          />
        ))
      )}
    </div>
  );
}