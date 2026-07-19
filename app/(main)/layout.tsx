import { NavBar } from "@/components/navBar";
import { Themeprovider } from "@/components/theme-provider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Themeprovider>
      <div className="w-full min-h-screen flex flex-col items-center">
        <NavBar />
        {children}
      </div>
    </Themeprovider>
  );
}