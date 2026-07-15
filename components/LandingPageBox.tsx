import React from 'react'

interface LandingPageBox {
    number : string
    heading : string
    information :string
}

export const LandingPageBox = ({
    number,
    heading,
    information
}: LandingPageBox) => {
  return <div className='border border-border p-6 w-full max-w-xs'>
    <div className='font-ibm uppercase text-gray-4 text-[10.5px] traking-wider'>
        {number}
    </div>
    <div className='text-foreground font-sans italic text-base mt-1 font-bold'>
        {heading}
    </div>
    <div className='font-ibm uppercase text-gray-4 text-[12px] mt-2 tracking-wider'>
       {information}
    </div>
  </div>
}
