import Link from 'next/link'
import React from 'react'


const sidebar = [{
    id : 1,
    title : "Feed",
    href : "/feed"
},{
    id : 2,
    title : "Compose",
    href : "/compose"
},{
    id : 3,
    title : "Profile",
    href : "/profile"
}]

function SideBar() {
  return <div>
    <div className='text-[13.5px] uppercase text-gray-4 font-ibm text-center'>
        {sidebar.map(sidebar => (
            <div>
            <Link key={sidebar.id} href={sidebar.href}
            className='hover:text-white'>
            {sidebar.title}
            </Link>
            </div>
        ))}
    </div>
  </div>
}

export default SideBar