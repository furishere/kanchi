"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface POST {
  postId: string;
  moodName: string;
  hasTriggerWarning: boolean;
  anonymousOrId: string;
  time: string;
  content: string;
  commentNumber: number;
  likeNumber: number;
}

export const Post = ({
  postId,
  hasTriggerWarning,
  anonymousOrId,
  time,
  content,
  commentNumber,
  likeNumber,
  moodName,
}: POST) => {
  const [revealed, setRevealed] = useState(!hasTriggerWarning);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/post/${postId}`)}
      className="flex justify-center mt-4 cursor-pointer"
    >
      <div className="p-4 w-full max-w-xs lg:max-w-xl border border-border">
        <span className="border px-2 py-1 font-ibm text-[9.5px] uppercase">
          {moodName}
        </span>

        <div className="font-ibm text-gray-400 text-[9.5px] flex gap-4 mt-3 mb-4 uppercase">
          <span>{anonymousOrId}</span>
          <span>{time}</span>
        </div>

        {revealed ? (
          <div className="font-ibm text-[13.5px] whitespace-pre-wrap">
            {content}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRevealed(true);
            }}
            className="w-full border border-dashed py-2"
          >
            Trigger warning • Tap to reveal
          </button>
        )}

        <div className="mt-4 border-t border-border pt-4 flex gap-5">
          <div className="flex gap-1 items-center">
            <Heart size={14} />
            {likeNumber}
          </div>

          <div className="flex gap-1 items-center">
            <MessageCircle size={14} />
            {commentNumber}
          </div>
        </div>
      </div>
    </div>
  );
};