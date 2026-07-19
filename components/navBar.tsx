import Link from "next/link";
import { Themetoggle } from "@/components/theme-toggle";

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
    },{
      id: 3,
      href: "/post",
      title: "post",
    },
    {
      id: 4,
      href: "/profile",
      title: "profile",
    },
  ];

  return (
    <div className="sticky top-0 bg-background w-full">
      <div className="w-full max-w-xl mx-auto">

        <div className="flex items-center justify-between mt-4 mb-1">

          <div className="flex gap-8">
            {navbar.map((nav) => (
              <Link
                className="text-[13.5px] uppercase text-gray-400 font-ibm"
                href={nav.href}
                key={nav.id}
              >
                {nav.title}
              </Link>
            ))}
          </div>

          <Themetoggle />

        </div>

        <hr className="border-border" />

      </div>
    </div>
  );
};