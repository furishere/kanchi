import Link from "next/link";

interface NavBarProps {
    id : number
    title : string
    href : string
}

export const Footer = () => {
  const navbar : NavBarProps[] = [
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
    <div className="fixed bottom-0 left-0 z-50 w-full bg-background block md:hidden">
      <div >
        <div className="p-3">
          <div className="w-full">
            <div className="flex justify-around">
            {navbar.map(nav => (
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