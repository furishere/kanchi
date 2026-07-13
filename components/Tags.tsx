import React from 'react'

interface Text {
    text : string
}

export const Tags = ({text} : Text) => {
  return <button className='border border-[#262626] text-[#B8B8B8] hover:border-white hover:text-white px-3 py-1 fonst-sans text-xs cursor-pointer tracking-wider m-1'>
    {text}
    </button>
}
