"use client"

import { Heading } from "@/components/heading"
import { InputAuth } from "@/components/InputAuth"
import { useState } from "react"


export default function Register(){
    const[username, setusername] = useState("")
    const[email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return <div className="flex justify-center bg-black">
        <div className="w-full max-w-xl h-screen">
            <div className="flex justify-center mt-24 flex-col">
                <Heading text="register"/>
                <div className="font-sans text-center tracking-wider text-[#B8B8B8] text-sm">your name stays with you. nothing else dose.</div>
                <div className='mt-6 flex justify-center flex-col items-center'>
                <InputAuth 
                type="text" 
                placeholder="username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                />
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
                <button className="cursor-pointer bg-[#ffffff] mt-8 text-black font-sans w-full max-w-3xs py-1 rounded-xs "> create account</button>
                <div className="font-sans mt-7 w-full max-w-xs text-center tracking-wider text-[#B8B8B8] text-xs">Your handle is just for login recovery and your own profile, posts stay anonymous either way.</div>
                </div>
            </div>
        </div>
    </div>
}