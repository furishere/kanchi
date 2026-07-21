"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Post } from "@/components/post/Post";
import { Comment } from "@/components/post/comment";

export default function PostPage() {
  const { postId } = useParams();
  console.log(postId)

  const [post, setPost] = useState<any>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    async function loadPost() {
      const res = await fetch(`/api/posts/${postId}`);

      const data = await res.json();

      setPost(data.post);
    }

    loadPost();
  }, [postId]);

  async function createComment() {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: comment,
      }),
    });

    if (!res.ok) return;

    const newComment = await res.json();

    setPost({
      ...post,
      comments: [...post.comments, newComment.comment],
    });

    setComment("");
  }

  if (!post) return <div>Loading...</div>;

  return (
  <div className="mx-auto w-full max-w-xl px-4 sm:px-0">
    <Post
      postId={post.id}
      anonymousOrId="anonymous"
      content={post.content}
      moodName={post.emotion}
      hasTriggerWarning={post.hasTriggerWarning}
      time={new Date(post.createdAt).toLocaleDateString()}
      likeNumber={post._count.likes}
      commentNumber={post._count.comments}
    />

    <div className="mt-8 mb-3 font-ibm text-[10px] text-gray-4">
      {post.comments.length} Comments
    </div>

    {post.comments.map((comment: any) => (
      <Comment
        key={comment.id}
        content={comment.content}
        createdAt={new Date(comment.createdAt).toLocaleDateString()}
      />
    ))}

    <textarea
      rows={4}
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      placeholder="Add a comment..."
      className="
        mt-6
        w-full
        resize-none
        border
        border-border
        bg-transparent
        p-2
        text-sm
      "
    />

    <button
      onClick={createComment}
      className="
        mt-4
        w-full
        bg-button
        py-2
        font-ibm
        text-[11px]
        uppercase
        text-button-text
      "
    >
      Post Comment
    </button>
  </div>
);
}