import React from 'react'

interface Text {
    text : string
}

export const Tags = ({text} : Text) => {
  return <button className='border border-border px-3 py-1 cursor-pointer tracking-widest m-1 font-ibm uppercase text-gray-4 text-[10.5px] hover:border-foreground hover:text-foreground'>
    {text}
    </button>
}
