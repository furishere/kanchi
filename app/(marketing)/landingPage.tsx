
import { LandingPageBox } from "@/components/landing/LandingPageBox";
import { LandingPageAnotherBox } from "@/components/landing/LandingPageAnotherBox";
import { Post } from "@/components/post/Post";
import Link from "next/link"
import { Buttons } from "@/components/pagesComponent/button";



export default function Home() {

  const navbar = [
        {
            id :1,
            href : "#features",
            title : "features"
        },{
            id : 2,
            href : "#howitworks",
            title : "how it works"
        },{
            id : 3,
            href : "#community",
            title : "community"
        }
    ]


  return <div id="community" className="flex justify-center items-center flex-col mt-12">
    <div className="flex justify-center">
    <div className="font-ibm text-[9px] md:text-[10.5px] border border-dashed text-center text-gray-4 py-1 px-3 tracking-widest">
      NO ACCOUNT REQUIRED TO READ
    </div>
    </div>
    <div className="text-center text-[32px] font-sans itlaic md:text-[52px] italic mt-4">
      Say it. Stay unamed.
    </div>
    <div className="tracking-wider text-gray-4 mt-4 text-center flex justify-center align-center">
    <div className="w-full max-w-xs md:max-w-sm text-sm md:text-[13.5px">
    Kanchi is a place to put down what you can't say out loud, no name attached, no judgment, just people who get it
    </div>
    </div>
    <div className="flex flex-col gap-2 justify-center text-[12px] mt-10">
      <Link href={"/register"}>
         <Buttons children={"START WRITING, IT'S FREE"}/>
      </Link>
      <Link href={"/login"}>
       <button className="bg-button-text text-button mt-1 items-center text-center align-middle border border-border hover:bg-button-text hover:text-button cursor-pointer py-2 px-3 uppercase w-full max-w-md lg:max-w-xl">
        LOG IN
       </button>
      </Link>

    </div>
    <div className="mt-19 mb-22">
    <Post 
    postId="post"
    hasTriggerWarning={false}
    moodName="hopeful"
    anonymousOrId="Anonymous"
    time="2h ago"
    content="Handed in my resignation today after three years of hating Mondays. Terrified — but for once I'm choosing something instead of just enduring it."
    commentNumber= {22}
    likeNumber={222}/>
    </div>

    <div id="features" className="flex justify-center items-center flex-col">
      <div className="font-ibm text-[10.5px] uppercase text-gray-4">
        WHY KANCHI
      </div >
      <div className="text-foreground text-[24px] md:text-[32px] font-sans font-bold italic">
        Built for saying the quiet part
      </div>
      <div className="font-ibm text-[12px] uppercase text-gray-4 w-full max-w-xs text-center ml-2 mr-2">
        Every part of it is designed around one idea, you shouldn't need your name to be heard.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-10">
        <LandingPageBox 
        number="10"
        heading="Truly anonymous"
        information="No usernames on posts, no profile links, nothing traceable back to you. Just the words."/>
        <LandingPageBox 
        number="02"
        heading="Tagged by feeling"
        information="Filter the feed by emotion — Lonely, Hopeful, Regretful — and find people feeling exactly what you are."/>
        <LandingPageBox
        number="03"
        heading="Handled gently"
        information="Posts about harder topics are redacted by default. Nobody sees anything they didn't choose to view." />
        <LandingPageBox 
        number="04"
        heading="Real replies"
        information='Comment anonymously too. Most posts get a few people saying "same" — which helps more than advice.'/>
        <LandingPageBox 
        number="05"
        heading="You control your data"
        information="Edit your bio and handle anytime. Delete your account whenever — your posts stay, unlinked, like everyone else's."/>
        <LandingPageBox 
         number="06"
         heading="No algorithm games"
         information="The feed is chronological and filterable. No engagement bait, no ranking your feelings by virality."/>
      </div>
      
      <div id="howitworks" className="font-ibm text-[10.5px] uppercase text-gray-4 mt-22">
        HOW IT WORKS
      </div >
      <div className="text-foreground md:text-[32px] font-sans italic font-bold text-[24px]">
        Three steps. No forms to fill.
      </div>

      <div className="grid lg:grid-cols-3 mt-8">
      <LandingPageAnotherBox 
      number="01"
      heading="Write it down"
      information="Type what you're feeling. No name shows up next to it, ever."/>
      <LandingPageAnotherBox 
      number="02"
      heading="Tag the emotion"
      information="Pick the closest match from 11 feelings, so others can find and relate to it."/>
      <LandingPageAnotherBox 
      number="03"
      heading="Let it go"
      information="Post it. Read the replies if you want, or just close the tab — either way, it's out."/>
      </div>
    </div>
    <div className="w-full max-w-xs  md:max-w-xl border text-center mt-22 py-4 mb-12">
      <div className="mt-4 font-sans italic font-bold md:text-[32px] text-[24px] ">
      You don't have to carry it alone
      </div>
      <div className="mt-1 uppercase font-ibm text-gray-4 text-[12.5px]">
        FREE TO JOIN · FREE TO READ · ALWAYS ANONYMOUS
      </div>
      <div className="mb-8  text-[12px] mt-9 mx-4 ">
        <Link href={"/register"}>
        <Buttons children="Create your accound"
      />
        </Link>
      </div>
    </div>
    <div className="border border-border"/>
    <div className="flex justify-between mt-4 w-full mb-4 items-center">
    <div className="text-left m-2">
    <div className="font-sans font-bold italic  text-[20px]">kanchi .</div>
    <div className="text-gray-4 font-ibm text-[11px] w-full max-w-3xs md:max-w-xs">
      Say it. Stay unnamed. A place to put down what you can't say out loud.
    </div>
    </div>
    <div className="flex flex-col text-[10px] font-ibm mr-2">
    <span className="uppercase text-gray-4 font-ibm">Product</span>
    {navbar.map(nav => (
      <Link href={nav.href} key={nav.id}>
      {nav.title}
      </Link>
    ))}
    </div>
    </div>  
    <hr className="border-border"/>
    <div className="flex justify-between font-ibm text-gray-4 mt-4 w-full text-[10.5px] uppercase mb-12 ">
      <div className="mx-6">
        © 2026 KANCHI .
      </div>
      <div className="mx-6">
        BUILT BY <Link href={"https://github.com/furishere"}> Hariom Mandal </Link>
      </div>
    </div>
  </div>
}
