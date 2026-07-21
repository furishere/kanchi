"use client";

import { useState } from "react";
import { Tags } from "@/components/post/Tags";
import { Square } from "lucide-react";
import { useRouter } from "next/navigation";

const emotions = [
  "Lonely",
  "Heartbroken",
  "Hopeful",
  "Grateful",
  "Anxious",
  "Confused",
  "Regretful",
  "Angry",
  "Burned Out",
  "Loved",
  "Guilty",
];

export default function Compose() {
  const router = useRouter();

  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState("");
  const [hasTriggerWarning, setHasTriggerWarning] = useState(false);
  const [loading, setLoading] = useState(false);


  async function createPost() {
    if (!content.trim()) {
      alert("Write something first");
      return;
    }

    if (!emotion) {
      alert("Choose an emotion");
      return;
    }


    try {
      setLoading(true);

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          emotion,
          hasTriggerWarning,
        }),
      });


      const data = await res.json();


      if (!res.ok) {
        alert(data.message);
        return;
      }


      router.push("/feed");

    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="w-full flex flex-col justify-center max-w-xs md:max-w-xl">

      <div className="mt-12">

        <div className="uppercase text-gray-4 font-ibm text-[10.5px] tracking-widest">
          What's on your mind
        </div>


        <div className="m-2">
          <textarea
            value={content}
            onChange={(e)=>setContent(e.target.value)}
            className="
            border border-border 
            font-ibm tracking-wider 
            placeholder:text-gray-4
            w-full max-w-xs md:max-w-xl
            p-3 text-sm
            "
            rows={7}
            placeholder="Write it exactly as it feels. No one will know it's you."
          />
        </div>



        <div className="uppercase text-gray-4 font-ibm text-[10.5px] tracking-widest mt-4">
          Emotion — pick exactly one
        </div>


        <div className="mt-3 mb-4 w-full max-w-xs md:max-w-xl">

          {emotions.map((item)=>(
            <Tags
              key={item}
              text={item}
              active={emotion === item}
              onClick={()=>setEmotion(item)}
            />
          ))}

        </div>



        <hr className="border-border"/>


        <div className="mt-2 flex justify-between">

          <div className="flex flex-col">
            <span className="text-[13px] font-public">
              Trigger warning
            </span>

            <span className="text-[10.5px] font-ibm text-gray-4">
              post is redacted until a reader chooses to reveal it
            </span>
          </div>


          <button
            onClick={()=>setHasTriggerWarning(!hasTriggerWarning)}
          >
            <Square
              className={
                hasTriggerWarning
                ? "fill-foreground"
                : ""
              }
            />
          </button>


        </div>


      </div>



      <div className="text-center mt-8">

        <button
          disabled={loading}
          onClick={createPost}
          className="
          bg-button 
          text-button-text 
          text-[11px] 
          font-ibm 
          uppercase 
          w-full 
          py-2
          disabled:opacity-50
          cursor-pointer
          "
        >
          {loading ? "posting..." : "post confession"}
        </button>

      </div>


    </div>
  );
}