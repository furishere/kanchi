import { LandingPageNavbar } from "@/components/landing/LandingPageNavbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div>
        <LandingPageNavbar />
        {children}
      </div>
  );
}