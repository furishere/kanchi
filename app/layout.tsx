import type { Metadata } from "next";
import { IBM_Plex_Mono, Inter, Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import { NavBar } from "@/components/navBar";

const manrope = Manrope({
  variable: "--font-manrope",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${ibmplexmono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      <div className="flex justify-center">
      <div className="w-full max-w-xl">
      <NavBar />
      {children}
      </div>
      </div>
      </body>
    </html>
  );
}
