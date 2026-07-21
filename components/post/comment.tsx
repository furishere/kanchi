import React from 'react'

interface CommentProps {
    content : string
    createdAt : string
}

export const Comment = ({
    content,
    createdAt
}: CommentProps) => {
  return <div className='flex justify-center flex-col w-full max-w-xl mx-auto font-ibm  text-gray-4 mt-4 mb-4'>
    <div className='text-gray-4 uppercase font-ibm flex gap-4 text-[10px] m-2'>
        <span>
        anonymous
        </span>
        <span>
            {createdAt}
        </span>
    </div>

    <div className='text-[14px] text-gray-5 mb-2'>
        {content}
    </div>
    <hr className='border-border'/>
  </div>
}
