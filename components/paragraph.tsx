import React from 'react'

interface Text {
    text : string
    info : string
}

export const Paragraph = ({text, info} : Text) => {
  return<div> 
    <div className='text-xl font-sans'>
        {info}
    </div>
    <div className="font-sans w-full max-w-xs tracking-widest text-[#B8B8B8] text-xs">{text}</div>
  </div>
}
