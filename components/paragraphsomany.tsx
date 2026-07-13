import React from 'react'

interface Text {
    text : string
}

export const Paragraphsomany = ({text} : Text) => {
  return <div className= 'font-sans text-[#B8B8B8] text-sm tracking-wider'>
    {text}
  </div>
}
