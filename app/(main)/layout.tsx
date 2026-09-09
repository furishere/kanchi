import { NavBar } from "@/components/Home/navBar";
import { Themeprovider } from "@/components/dark_mode/theme-provider";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Themeprovider>
      <div>
        <NavBar />
        {children}
      </div>
    </Themeprovider>
  );
}