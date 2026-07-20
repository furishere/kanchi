"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";

interface POST {
  moodName: string;
  hasTriggerWarning: boolean;
  anonymousOrId: string;
  time: string;
  content: string;
  commentNumber: number;
  likeNumber: number;
}

export const Post = ({
  hasTriggerWarning,
  anonymousOrId,
  time,
  content,
  commentNumber,
  likeNumber,
  moodName,
}: POST) => {
  const [revealed, setRevealed] = useState(!hasTriggerWarning);

  return (
    <div className="flex justify-center mt-4">
      <div className="p-4 w-full max-w-xs md:max-w-xl border border-border">
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
            onClick={() => setRevealed(true)}
            className="w-full max-w-xl border border-dashed border-foreground text-center py-2 text-[11.5px] font-ibm bg-[#141414] cursor-pointer hover:bg-[#1b1b1b] transition-colors"
          >
            Trigger warning • Tap to reveal
          </button>
        )}

        <div className="bg-gray-4 mt-4 mb-2 h-px w-full" />

        <div className="flex mt-4 gap-5">
          <button className="flex items-center gap-1 text-gray-4 hover:text-white transition-colors">
            <Heart size={14} />

            <span className="font-ibm text-[10.5px]">
              {likeNumber}
            </span>

            <span className="font-ibm text-[10.5px] uppercase">
              Relate
            </span>
          </button>

          <button className="flex items-center gap-1 text-gray-4 hover:text-white transition-colors">
            <MessageCircle size={14} />

            <span className="font-ibm text-[10.5px]">
              {commentNumber}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};