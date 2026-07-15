"use client"

import { InputAuth } from "@/components/InputAuth"
import { useState } from "react"


export default function Register(){
    const[email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return <div className="flex justify-center bg-black">
        <div className="w-full max-w-xl h-screen">
            <div className="flex justify-center mt-24 flex-col">
                <div className="font-sans text-center tracking-wider text-[#B8B8B8] text-sm">your name stays with you. nothing else dose.</div>
                <div className='mt-6 flex justify-center flex-col items-center'>
                <InputAuth 
                type="email"
                placeholder="enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <InputAuth 
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}/>
                <button className="cursor-pointer bg-[#ffffff] mt-8 text-black font-sans w-full max-w-3xs py-1 rounded-xs ">Log In</button>
                <div className="font-sans mt-7 w-full max-w-xs text-center tracking-wider text-[#B8B8B8] text-xs">No email is ever shown on your posts or profile. It's used only to recover your account.</div>
                </div>
            </div>
        </div>
    </div>
}