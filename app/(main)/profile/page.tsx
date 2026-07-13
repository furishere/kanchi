import { Box } from "@/components/Box";
import { HrLine } from "@/components/HrLine";
import { NavBar } from "@/components/navBar";
import { Paragraph } from "@/components/paragraph";
import { Post } from "@/components/Post";

export default function Profile(){
    return  <div>
                <div className="mt-4 tracking-widest text-[#B8B8B8] font-sans">
                    @furishere
                </div>
                <div className="font-sans italic text-lg tracking-wide">
                    Anonymous mostly, but u can read me 
                </div>
                <div className="mt-4 flex gap-4">
                    <Paragraph 
                    info="12"
                    text="POST"/>
                    <Paragraph 
                    info= "Mar 2026"
                    text="DATE JOINED"/>
                </div>
                <div className="mt-4 flex gap-4">
                    <Box text="EDIT PROFILE"/>
                    <Box text="DELETE PROFILE"/>
                </div>
                <HrLine />
                <div>
                    <Post />
                </div>
            </div>
}