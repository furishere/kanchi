import { Post } from "@/components/Post";


export default function Home() {
  return <div className="flex justify-center  flex-col">
    <div className="flex justify-center">
    <div className="font-ibm text-[10.5px] border border-dashed text-center text-gray-4 py-1 px-3 tracking-widest">
      NO ACCOUNT REQUIRED TO READ
    </div>
    </div>
    <div className="text-center font-sans itlaic text-[52px] italic mt-4">
      Say it. Stay unamed.
    </div>
    <div className="ibm tracking-wider text-gray-4 mt-4 text-center flex justify-center align-center">
    <div className="w-full max-w-sm ">
    Kanchi is a place to put down what you can't say out loud, no name attached, no judgment, just people who get it
    </div>
    </div>
    <div className="flex justify-center mt-4">
      <button className="
      bg-button
      text-button-text
      border
      border-border
      text-[12px]
      py-3 mt-4 px-5 font-ibm
      hover:bg-button-text
      hover:text-button
      cursor-pointer">
      START WRITING, IT'S FREE
      </button>

    </div>
    <div className="mt-22 mb-22">
    <Post hasTriggerWarning="Hopeful"
    anonymousOrId="Anonymous"
    time="2h ago"
    content="Handed in my resignation today after three years of hating Mondays. Terrified — but for once I'm choosing something instead of just enduring it."
    commentNumber= {22}
    likeNumber={222}/>
      </div>
  </div>
}
