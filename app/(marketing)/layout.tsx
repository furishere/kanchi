import { LandingPageNavabar } from "@/components/LandingPageNavabar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center bg-background text-foreground">
      <div>
        <LandingPageNavabar />
        {children}
      </div>
    </div>
  );
}