import React from 'react'
import { HrLine } from './HrLine'

export const Post = () => {
  return <div className='border border-[#232323]'>
     <div className='p-4'>
      <span className='border px-2 py-1 fonst-sans text-xs'>
        LONELY
      </span>
      <div className= 'font-sans text-[#B8B8B8] text-xs flex gap-4 mt-3 mb-4 '>
        <span>ANONYMOUS </span>
        <span> 2H AGO</span>
      </div>
      <div>
        Everyone at the reunion had someone to sit next to. I stood by the drinks table and pretended my phone was interesting for forty minutes.
      </div>
      <HrLine />
      <div>
        <span className='font-sans text-xl '>
          relate
        </span>
      </div>
     </div>
  </div>
}
