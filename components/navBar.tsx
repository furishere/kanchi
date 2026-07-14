"use client"
import React from 'react'
import { HrLine } from './HrLine'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Themetoggle } from './theme-toggle'

export const NavBar = () => {
    const pathname = usePathname()

    const navbar = [
        {
            id : 1,
            title: "FEED",
            href : "/feed"
        },{
            id : 2,
            title : "COMPOSE",
            href : "/post",
        },{
            id : 3,
            title : "PROFILE",
            href : "/profile"
        }
    ]
  return  <div> 
  <div className='flex justify-between'>
  <div> 
  <div className="text-2xl font-sans text-left mt-7 italic">
    kanchi .
  </div>
  <div className='font-sans w-full max-w-xs tracking-widest text-[#B8B8B8] text-xs'>
    say it. stay unnamed.
  </div>
  </div>
  <Themetoggle />
  </div>

  <HrLine />
  <div className='font-sans text-[#B8B8B8] tracking-wider flex gap-4 text-sm'>
    {navbar.map(nav => (
        <Link
        className={`${pathname === nav.href ? "underline text-white" : "hover:text-white" }`}
        key={nav.id}
        href={nav.href}>
            {nav.title}
        </Link>
    ))}
  </div>
  <HrLine />
  </div>
}
