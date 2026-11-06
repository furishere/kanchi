import Link from "next/link"
import Home from "../svg/Home"
import Notification from "../svg/Notification"
import Plus from "../svg/Plus"
import Profile from "../svg/Profile"
import Search from "../svg/Search"
import Setting from "../svg/Setting"

export interface NavItem {
    id :number,
    name : string,
    href : string,
    svg : React.ReactNode
}

export const sideBar : NavItem[] = [
    {
        id : 1,
        name : "Home",
        href : "/home",
        svg : <Home />
    },{
        id : 2,
        name : "Explore",
        href : "/explore",
        svg : <Search />
    },{
        id : 3,
        name : "Post",
        href : "/post",
        svg : <Plus />
    }, {
        id : 4, 
        name : "Notifications",
        href : "/notifications",
        svg : <Notification />
    },{
        id : 5,
        name : "Profile",
        href : "/profile",
        svg : <Profile />
    },{
        id : 6,
        name : "Settings",
        href : "/settings",
        svg : <Setting />
    }

]

export default function LeftSideBar(){
    return <div className="flex items-end justify-end">
    <div className="flex flex-col gap-6">
        <div className= "font-serif italic text-3xl mt-6">
            kanchi.
        </div>
        <div className="flex flex-col">
            {sideBar
            .filter(nav => nav.id !== 3)
            .map(nav => (
                <Link href={nav.href} key={nav.id}>
                <div className="flex box-border gap-[14px] h-[44px] px-[14px] w-[220px] font-sans text-gray-4 text-[.95rem] text-foreground rounded-md items-center hover:bg-surface hover:text-foreground">
                {nav.svg}
                {nav.name}
                </div>
                </Link>
            ))}
        </div>
        <div >
            <button className="bg-foreground text-background rounded-[999px] text-[.92rem] gap-[8px] h-[42px] px-[20px] font-[500] items-center cursor-pointer w-[220px]  transition-all duration-150 ease-out
            hover:opacity-90 active:scale-[0.96]
            active:opacity-80">
            <Link href={"/post"}>
               Write a Confession 
            </Link>
            </button>
        </div>
    </div>
    </div>

}