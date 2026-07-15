import { HrLine } from "@/components/HrLine";
import { Post } from "@/components/Post";

export default function Profile(){
    return <div className="flex justify-center w-full flex-col mt-8">
        <div>
            <div className="text-[11px] text-gray-4 font-ibm">
                @furishere
            </div>
            <div className="text-[28px] font-sans font-bold italic">
                Anonymous, mostly
            </div>
            <div className="text-[16px] mt-2">
                34
            </div>
            <div className="font-ibm text-gray-4 text-[9.5px]">
                post
            </div>
            <div className="flex gap-2 tracking-widest text-[10.5px] mt-4 mb-4">
                <button className="font-ibm border border-border py-2 px-3 uppercase">DELETE ACCOUNT</button>
                <button className="font-ibm border border-border py-2 px-3 uppercase">DELETE ACCOUNT</button>
            </div>
        </div>
        <HrLine />
        <div className="text-gray-4 uppercase text-[10.5px] mt-4">
            Your confessions
        </div>
        <Post 
        anonymousOrId="anonymous"
        commentNumber={6}
        content="Everyone at the reuni   had someone to sit next to. I sto   by the drinks table and pretend   my phone was interesting for for   minutes."
        time="2h ago"
        hasTriggerWarning={true}
        moodName="Lonely"
        likeNumber={34}
        />
    </div>
}