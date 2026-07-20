import React from 'react'

interface LandingPageBox {
    number : string
    heading : string
    information :string
}

export const LandingPageAnotherBox = ({
    number,
    heading,
    information
}: LandingPageBox) => {
  return <div className='border border-border p-6 w-full max-w-xs text-center'>
    <div className='font-sans uppercase text-gray-4 text-[30px] traking-wider text-center italic'>
        {number}
    </div>
    <div className='text-foreground font-ibm italic text-base mt-1 uppercase text-[11px]'>
        {heading}
    </div>
    <div className='font-ibm uppercase text-gray-4 text-[12px] mt-2 tracking-wider'>
       {information}
    </div>
  </div>
}
