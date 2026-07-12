import React from 'react'

interface InputData {
    type : string,
    placeholder : string,
    onChange : (e: React.ChangeEvent<HTMLInputElement>) => void
    value : string
}

export const InputAuth = ({
    type = "text",
    placeholder,
    onChange,
    value
}:InputData ) => {
  return <div className='mt-2'>
    <label>
        <input 
        className='border border-[#232323] rounded-md text-left px-10 py-1 font-sans tracking-wider placeholder:text-sm'
        type={type}
        value={value}
        onChange={onChange} 
        placeholder={placeholder} />
    </label>
  </div>
}
