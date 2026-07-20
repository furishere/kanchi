"use client"

import { InputComponent } from "@/components/auth/InputComponent";
import { useState } from "react";

export default function Register() {
  const [username, setUsername] = useState("")

  return <div>
    <InputComponent 
    type="text"
    placeholder="username"
    value={username}
    onChage={(e) => setUsername(e.target.value)}
    size="sm"
    />
  </div>  
}