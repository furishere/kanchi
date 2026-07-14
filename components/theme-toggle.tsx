"use client"
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import {Moon, Sun} from "lucide-react"

export const Themetoggle = () => {
    const {theme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    },[])

    if(!mounted) return null
  return <button
  onClick={() => 
    setTheme(theme === "dark" ? "light" : "dark")
  }
  className='rounded-full p-2 cursor-pointer '
  >
    {theme === "dark" ? (
        <Sun className='h-5 w-5'/>
    ):(
        <Moon className='h-5 w-5'/>
    )}
  </button>
}
