import { HrLine } from '@/components/HrLine'
import { Paragraphsomany } from '@/components/paragraphsomany'
import { Tags } from '@/components/Tags'
import React from 'react'

export default function Compose(){

    return <div>
        <div>
            <Paragraphsomany text="WHAT'S ON YOUR MIND"/>
            <label>
            <textarea rows={11} cols={71}  placeholder="write it exacty as it feels. No one will know it's you"
            class="mt-2"
            className='border m-2 font-sans text-center border-[#262626] placeholder:m-2'>
                
            </textarea>
            </label>
        </div>
        <div>
            <Paragraphsomany text='EMOTION — PICK EXACTLY ONE'/>
            <div className='mt-2 gap-2'>
                <Tags text='LONELY'/>
                <Tags text='HEARTBROKEN'/>
                <Tags text='HOPEFUL'/>
                <Tags text='GRATEFUL'/>
                <Tags text='ANXIOUS'/>
                <Tags text='CONFUSED'/>
                <Tags text='REGRETFUL'/>
                <Tags text='ANGRY'/>
                <Tags text='BURNED OUT'/>
                <Tags text='LOVED'/>
                <Tags text='GUILTY'/>
            </div>
            <HrLine />
            <button className='text-center bg-white  w-full max-w-xl text-black py-1 px-3 cursor-pointer'> FILE CONFESSION </button>
        </div>
    </div>
}
