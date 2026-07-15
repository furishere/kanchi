import Link from "next/link"
import { HrLine } from './HrLine'
import {Themetoggle} from "@/components/theme-toggle"


export const Navabar = () => {
    const navbar = [
        {
            id : 1,
            href : "/feed",
            title : "feed"
        },
        {
            id : 2,
            href : "/compose",
            title : "compose"
        },{
            id: 3,
            href: "/profile",
            title : "profile"
        }
    ]

  return <div className='flex flex-col sticky top-0 bg-background'>
    <div className='flex items-center justify-between mt-4 mb-1'>
    <div className="flex justify-around w-full">
     {navbar.map(nav => (
        <Link
        className="text-[13.5px] uppercase text-gray-4 font-ibm"
         href={nav.href} key={nav.id}>
            {nav.title}
        </Link>
     ))}
    </div>
    <div className=' flex items-center gap-2'>
    <Themetoggle />
    </div>
    </div>
    <HrLine/>

  </div>
}
