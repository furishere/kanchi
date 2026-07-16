import React from 'react'
import { HrLine } from './HrLine'
import { Heart, MessageCircle } from 'lucide-react'

interface POST {
  moodName : string
  hasTriggerWarning : boolean
  anonymousOrId : string
  time : string
  content : string
  commentNumber : number
  likeNumber : number
}

export const Post = ({
  hasTriggerWarning,
  anonymousOrId,
  time,
  content,
  commentNumber,
  likeNumber,
  moodName
}: POST) => {
  return <div className='flex justify-center mt-4'>
     <div className='p-4 w-full max-w-xs md:max-w-xl border border-border'>
      <span className='border px-2 py-1 fonst-ibm text-[9.5px] text-foreground bg-background uppercase'>
        {moodName}
      </span>
      <div className= 'font-ibm text-gray-4 text-[9.5px] flex gap-4 mt-3 mb-4 uppercase'>
        <span>{anonymousOrId} </span>
        <span> {time}</span>
      </div>
      {hasTriggerWarning && (
        <div className='font-ibm text-[13.5px]'>
        {content}
      </div>
      )}
      {!hasTriggerWarning && (
        <div className=' border border-dashed border-foreground text-center py-2 text-[11.5px] font-public bg-[#141414]'>
          Trigger warning: self harm - tap to reveal
        </div>
      )}
      <div className='bg-gray-4 mt-4 mb-2 h-px w-full max-w-xl' />
      <div className='flex mt-4 gap-3 align-center'>
        <div className='flex justify-center items-center'>
        <Heart className='h-[10.5px] text-gray-4'/>
        <div className='font-ibm text-gray-4 text-[10.5px] mr-2'>
          {likeNumber}
        </div>
        <span className='font-ibm text-gray-4 text-[10.5px] '>
          relate
        </span>
        </div>

        <div className='flex items-center'>
        <MessageCircle className='h-[10.5px] text-gray-4'/>
        <div className='font-ibm text-gray-4 text-[10.5px] '>
          {commentNumber}
        </div>
        </div>
      </div>
     </div>
  </div>
}
