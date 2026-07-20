import React from "react";

interface TagsProps {
  text: string;
  active?: boolean;
  onClick?: () => void;
}

export const Tags = ({
  text,
  active = false,
  onClick,
}: TagsProps) => {
  return (
    <button
      onClick={onClick}
      className={`border px-3 py-1 cursor-pointer tracking-widest m-1 font-ibm uppercase text-[10.5px] transition-colors ${
        active
          ? "border-foreground text-foreground"
          : "border-border text-gray-4 hover:border-foreground hover:text-foreground"
      }`}
    >
      {text}
    </button>
  );
};