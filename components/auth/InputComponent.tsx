import React from 'react'

interface InputProps {
    type?:React.HTMLInputTypeAttribute
    placeholder? : string
    value : string
    onChage : (e:React.ChangeEvent<HTMLInputElement>) => void

    size? : "sm" | "md" | "lg"

    disabled? : boolean
}

const sizes = {
    sm : "h-10 px-3 text-sm",
    md : "h-12 px-4 text-base",
    lg : "h-14 px-5 text-lg"
}

export const InputComponent = ({
    type = "text",
    placeholder,
    value,
    onChage,
    size = "md",
    disabled = false
}: InputProps) => {
  
    return <input 
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChage}
    disabled = {disabled}
    className={`w-full max-w-md rounded-md border border-border outline-none focus:border-border font-ibm ${sizes[size]}`} />
}
