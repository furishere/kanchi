import React from 'react'
import { Themetoggle } from '../dark_mode/theme-toggle'

export const AuthPageNavBar = () => {
  return <div className="sticky top-0 bg-background w-full">
      <div className="w-full max-w-xl mx-auto flex justify-between ml-3 mr-2 mt-1">
        <div className='font-sans italic text-[24px]'>
            kanchi .
        </div>
        <div className='mr-6'>
        <Themetoggle/>
        </div>
        </div>
        <hr className="border-border" />
      </div>
}
