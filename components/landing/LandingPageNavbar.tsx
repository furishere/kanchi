"use client"
import React, { useState } from 'react'
import {Themetoggle} from "@/components/dark_mode/theme-toggle"
import { Menu } from 'lucide-react'
import Link from 'next/link'
import { Buttons } from '../pagesComponent/button'

export const LandingPageNavbar = () => {
    

    const navbar = [
        {
            id :1,
            href : "#features",
            title : "features"
        },{
            id : 2,
            href : "#howitworks",
            title : "how it works"
        },{
            id : 3,
            href : "#community",
            title : "community"
        }
    ]

    function signUpPage(){

    }

    const[isOpen, setIsOpen] = useState(false)

  return <div className='flex flex-col sticky top-0 bg-background'>
    <div className='flex items-center justify-around mt-4 mb-1'>
    <div className='text-[24px] font-sans italic'>kanchi .</div>
    <div className='text-[11px] text-gray-4 font-ibm hidden md:flex gap-4'>
        {navbar.map(nav => (
            <Link href={nav.href} key={nav.id}>
            {nav.title}
            </Link>
        ))}
    </div>
    <div className='text-[10.5px] hidden md:flex gap-4'>
    <Link href={"/login"}>
    <button className='bg-button text-button-text border border-border hover:bg-button-text hover:text-button cursor-pointer py-2 px-3 uppercase w-full max-w-md lg:max-w-xl'>
          Log In
    </button>
    </Link>

    <Link href={"/register"}>
    <Buttons 
    children="GET STARTED"
    variant='secondry'/>
    </Link>
    </div>
    <div className=' flex items-center gap-2'>
    <Themetoggle />
    <button
    onClick={() => setIsOpen(!isOpen)}
    className='md:hidden cursor-pointer'>
    <Menu />
    </button>
    </div>
    </div>
    {isOpen && (
        <div className='text-[11px] text-gray-4 font-ibm flex flex-col md:hidden gap-6 items-center mb-4'>
        {navbar.map(nav => (
            <Link href={nav.href} key={nav.id}>
            {nav.title}
            </Link>
        ))}
    </div>
    )}
    <hr className='border-border'/>
  </div>
}
