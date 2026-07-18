import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import "./globals.css";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Alex Morask",
  description: "Staff Software Engineer — Billing & Payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark font-sans", ibmPlexSans.variable, ibmPlexMono.variable)}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
