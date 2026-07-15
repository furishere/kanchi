import { HrLine } from "@/components/HrLine";
import { Tags } from "@/components/Tags";
import { Square } from "lucide-react";

export default function Profile(){
    return <div className="w-full flex flex-col justify-center max-w-xl">
        <div className="mt-12">
            <div className="uppercase text-gray-4 font-ibm text-[10.5px] tracking-widest">
               What's on your mind 
            </div>
            <div className="m-2">
            <textarea 
            className="border border-border font-ibm tracking-wider placeholder:text-gray-4
            placeholer:traking-wider  p-3 text-sm" 
            rows={7} 
            cols={60}
            placeholder="Write it exactly as it feels. No one will know it's you."></textarea>
            </div>
            <div className="uppercase text-gray-4 font-ibm text-[10.5px] tracking-widest mt-4">
               Emotion — pick exactly one
            </div>
            <div className="mt-3 mb-4">
                <Tags text="lonely"/>
                <Tags text="heartbroken"/>
                <Tags text="hopeful"/>
                <Tags text="grateful"/>
                <Tags text="anxious"/>
                <Tags text="confused"/>
                <Tags text="Regretful"/>
                <Tags text="Angry"/>
                <Tags text="Burned Out"/>
                <Tags text="Loved"/>
                <Tags text="Guilty"/>
            </div>
            <HrLine />

            <div className="mt-2 flex justify-between">
            <div className="flex flex-col">
            <span className="text-[13px] font-public ">Trigger warning</span>
            <span className="text-[10.5px] font-ibm text-gray-4"> post is redacted until a reader chooses to reveal it</span>
            </div>
            <div>
            <Square />
            </div>
            </div>
        </div>
        <div className="text-center mt-8">
            <button className="bg-button text-button-text text-[11px] font-ibm uppercase w-full py-2">post confession</button>
        </div>
    </div>
}