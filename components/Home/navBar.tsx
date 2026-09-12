import Link from "next/link";
import { Themetoggle } from "@/components/dark_mode/theme-toggle";

export const NavBar = () => {
  const navbar = [
    {
      id: 1,
      href: "/feed",
      title: "feed",
    },
    {
      id: 2,
      href: "/compose",
      title: "compose",
    },
    {
      id: 3,
      href: "/profile",
      title: "profile",
    },
  ];

  return (
    <div className="sticky top-0 bg-background w-full">
      <div >
        <div className="flex items-center justify-between p-3">
          <div className="flex justify-center text-center  w-full">
            <div>
            {navbar
              .filter(nav => nav.title == "feed")
              .map(nav => (
                <Link key={nav.id} href={nav.href}
                className="text-[13.5px] uppercase text-gray-4 font-ibm text-center">
                  {nav.title}
                </Link>
              ))
            }
            </div>
          </div>
        </div>
        <hr className="border-border" />
      </div>
    </div>
  );
};