import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope, Newsreader, Public_Sans } from "next/font/google";
import { Themeprovider } from "@/components/theme-provider";
import { Navabar } from "@/components/navBar";


const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  style : ['normal','italic'],
  subsets: ["latin"],
});

const ibmplexmono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "kanchi",
  description: "A serious social platform where users can anonymously share emotions, confessions, thoughts, and experiences in real time.",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${publicSans.variable} ${ibmplexmono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <Themeprovider>
      <div className="flex justify-center bg-background text-foreground">
      <div>
      <Navabar />
      {children}  
      </div>
      </div>
      </Themeprovider>
      </body>
    </html>
  );
}
