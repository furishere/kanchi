import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Public_Sans } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";


const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: 'swap',
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  style : ['normal','italic'],
  subsets: ["latin"],
  display: 'swap',
});

const ibmplexmono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
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
      suppressHydrationWarning
      className={`${publicSans.variable} ${ibmplexmono.variable} ${newsreader.variable} antialiased`}
    >
      <body className="bg-background text-foreground">
      <main>
      {children}  
      </main>
      </body>
    </html>
  );
}
