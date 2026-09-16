"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";
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
      className="mt-4 w-full cursor-pointer border-b border-border"
    >
      <div className="w-full p-4">
        <span className="border px-2 py-1 font-ibm text-[9.5px] uppercase">
          {moodName}
        </span>

        <div className="mt-3 mb-4 flex gap-4 font-ibm text-[9.5px] uppercase text-gray-4">
          <span>{anonymousOrId}</span>
          <span>{time}</span>
        </div>

        {revealed ? (
          <div className="whitespace-pre-wrap font-ibm text-[13.5px]">
            {content}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setRevealed(true);
            }}
            className="w-full border border-dashed py-2 font-ibm text-gray-4"
          >
            Trigger warning • Tap to reveal
          </button>
        )}

        <div className="mt-5">
          <div className="flex items-center gap-3 ">
            <MessageCircle size={14} />
            {commentNumber}
          </div>
        </div>
      </div>
    </div>
  );
};