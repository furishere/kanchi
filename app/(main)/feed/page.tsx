"use client";

import { useEffect, useState } from "react";
import { Post } from "@/components/post/Post";
import { Tags } from "@/components/post/Tags";
import type { Metadata } from "next";

interface FeedPost {
  id: string;
  content: string;
  emotion: string;
  hasTriggerWarning: boolean;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

const emotions = [
  "All",
  "Lonely",
  "Heartbroken",
  "Hopeful",
  "Grateful",
  "Anxious",
  "Confused",
  "Regretful",
  "Angry",
  "BurnedOut",
  "Loved",
  "Guilty",
];


export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmotion, setSelectedEmotion] = useState("All");

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);

        const url =
          selectedEmotion === "All"
            ? "/api/feed"
            : `/api/feed?emotion=${selectedEmotion}`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();

        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, [selectedEmotion]);

  if (loading) {
    return (
      <div className="mt-8 text-center font-ibm uppercase">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-4 ml-2 mr-2 mb-3 flex flex-wrap gap-2">
        <div className="flex overflow-x-auto  scrollbar-none">
        {emotions.map((emotion) => (
          <Tags
            key={emotion}
            text={emotion}
            active={selectedEmotion === emotion}
            onClick={() => setSelectedEmotion(emotion)}
          />
        ))}
        </div>
      </div>

      <hr className="border-border" />

      {posts.length === 0 ? (
        <div className="mt-8 text-center font-ibm uppercase">
          No posts found.
        </div>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            postId={post.id}
            anonymousOrId="anonymous"
            content={post.content}
            moodName={post.emotion}
            hasTriggerWarning={post.hasTriggerWarning}
            time={new Date(post.createdAt).toLocaleDateString()}
            likeNumber={post.likeCount}
            commentNumber={post.commentCount}
          />
        ))
      )}
    </div>
  );
}