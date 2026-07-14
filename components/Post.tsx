import React from 'react'
import { HrLine } from './HrLine'
import { Heart, MessageCircle } from 'lucide-react'

interface POST {
  hasTriggerWarning : string
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
  likeNumber
}: POST) => {
  return <div className='flex justify-center'>
     <div className='p-4 w-full max-w-md border border-border'>
      <span className='border px-2 py-1 fonst-ibm text-[9.5px] text-foreground bg-background uppercase'>
        {hasTriggerWarning}
      </span>
      <div className= 'font-ibm text-gray-4 text-[9.5px] flex gap-4 mt-3 mb-4 uppercase'>
        <span>{anonymousOrId} </span>
        <span> {time}</span>
      </div>
      <div className='font-ibm text-[13.5px]'>
        {content}
      </div>
      <HrLine />
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
