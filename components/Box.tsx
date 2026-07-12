import React from 'react'

interface Text  {
    text : string
}

export const Box = ({text} : Text) => {
  return <button className='text-xs font-sans border border-[#232323] text-[#B8B8B8] px-3 tracking-widest py-2 items-center cursor-pointer hover:border-[#ffffff]'>
    {text}
  </button>
}
