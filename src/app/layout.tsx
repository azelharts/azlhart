import type { Metadata, Viewport } from "next";

import "./globals.css";

import { Inter } from "next/font/google";

import ConsoleEgg from "@/components/ConsoleEgg";
import ContactPanel from "@/components/ContactPanel";
import Navbar from "@/components/Navbar";
import PageTransition from "@/components/PageTransition";
import SmoothScroll from "@/components/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  // Render immediately in the fallback face rather than blocking text paint on
  // the webfont. This is the difference between a fast and a blocked FCP.
  display: "swap",
  variable: "--font-inter",
});

const TITLE = "Mario Daruranto | Frontend Engineer";
const DESCRIPTION =
  "Frontend engineer and designer in Kupang, East Nusa Tenggara. Selected works: write-ups of features I've built for production products.";

export const metadata: Metadata = {
  metadataBase: new URL("https://azlhart.com"),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "frontend engineer",
    "react",
    "next.js",
    "typescript",
    "web development",
    "UI/UX",
  ],
  authors: [{ name: "Mario Daruranto" }],
  openGraph: {
    type: "website",
    siteName: "Azlhart®",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero-thumbnail.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/images/hero-thumbnail.webp"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${inter.className}`}>
      <body className="relative antialiased">
        <PageTransition>
          <ContactPanel>
            <Navbar />
            <SmoothScroll>{children}</SmoothScroll>
            <ConsoleEgg />
          </ContactPanel>
        </PageTransition>
      </body>
    </html>
  );
}
