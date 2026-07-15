"use client"
import React, { useState } from 'react'
import { HrLine } from './HrLine'
import {Themetoggle} from "@/components/theme-toggle"
import { Menu } from 'lucide-react'

export const LandingPageNavabar = () => {
    const[isOpen, setIsOpen] = useState(false)

  return <div className='flex flex-col sticky top-0 bg-background'>
    <div className='flex items-center justify-around mt-4 mb-4'>
    <div className='text-[24px] font-sans italic'>Kanchi .</div>
    <div className='text-[11px] text-gray-4 font-ibm hidden md:flex gap-4'>
        <span>FEATURES</span>
        <span>HOW IT WORKS</span>
        <span>COMMUNITY</span>
    </div>
    <div className='text-[10.5px] font-ibm hidden md:flex gap-4'>
        <button className="bg-button
      text-button-text
      border
      border-border
      py-2 px-3 
      hover:bg-button-text
      hover:text-button
      cursor-pointer">LOG IN</button>
        <button className="bg-button-text
      text-button
      border
      border-border
      py-2 px-3 
      hover:bg-button
      hover:text-button-text
      cursor-pointer">GET STARTED</button>
    </div>
    <div className=' flex items-center gap-2'>
    <Themetoggle />
    <button
    onClick={() => setIsOpen(!isOpen)}
    className='md:hidden'>
        <Menu />
    </button>
    </div>
    </div>
    {isOpen && (
        <div className='text-[11px] text-gray-4 font-ibm flex flex-col md:hidden gap-6 items-center mb-4'>
        <span>FEATURES</span>
        <span>HOW IT WORKS</span>
        <span>COMMUNITY</span>
    </div>
    )}
    <HrLine/>
  </div>
}
