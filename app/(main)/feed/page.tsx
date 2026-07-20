"use client";

import { useEffect, useState } from "react";
import { Post } from "@/components/post/Post";
import { Tags } from "@/components/post/Tags";

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
  "Hopeful",
  "Grateful",
  "Anxious",
  "Regretful",
  "Angry",
  "Loved",
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

  return (
    <div className="flex flex-col justify-center">
      <div className="mt-4 mb-3 flex flex-wrap">
        {emotions.map((emotion) => (
          <Tags
            key={emotion}
            text={emotion}
            active={selectedEmotion === emotion}
            onClick={() => setSelectedEmotion(emotion)}
          />
        ))}
      </div>

      <hr className="border-border" />

      {loading ? (
        <div className="mt-8 text-center text-gray-4 font-ibm uppercase text-sm">
          Loading...
        </div>
      ) : posts.length === 0 ? (
        <div className="mt-8 text-center text-gray-4 font-ibm uppercase text-sm">
          No posts found.
        </div>
      ) : (
        posts.map((post) => (
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
        ))
      )}
    </div>
  );
}