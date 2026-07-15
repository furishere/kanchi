import { HrLine } from "@/components/HrLine";
import { Post } from "@/components/Post";
import { Tags } from "@/components/Tags";

export default function Feed(){
    return <div className="flex flex-col justify-center">
        <div className="mt-4 mb-3">
                <Tags text="all"/>
                <Tags text="lonely"/>
                <Tags text="hopeful"/>
                <Tags text="grateful"/>
                <Tags text="anxious"/>
                <Tags text="Regretful"/>
                <Tags text="Angry"/>
                <Tags text="Loved"/>
        </div>
        <HrLine />
        <div>
            <Post 
            anonymousOrId="anonymous"
            commentNumber={6}
            content="Everyone at the reunion had someone to sit next to. I stood by the drinks table and pretended my phone was interesting for forty minutes."
            time="2h ago"
            hasTriggerWarning={true}
            moodName="Lonely"
            likeNumber={34}
            />
            <Post 
            anonymousOrId="anonymous"
            commentNumber={6}
            content="Everyone at the reunion had someone to sit next to. I stood by the drinks table and pretended my phone was interesting for forty minutes."
            time="2h ago"
            hasTriggerWarning={false}
            moodName="Lonely"
            likeNumber={34}
            />
            <Post 
            anonymousOrId="anonymous"
            commentNumber={22}
            content="Handed in my resignation today after three years of hating Mondays. Terrified. But for the first time in a while I feel like I'm choosing something instead of just enduring it."
            time="1d ago"
            hasTriggerWarning={true}
            moodName="hopeful"
            likeNumber={128}
            />
        </div>
    </div>
}