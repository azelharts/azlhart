import type { Metadata, Viewport } from "next";
import { siteUrl } from "@/lib/site";

import "./globals.css";

import { Inter } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  // Render immediately in the fallback face rather than blocking text paint on
  // the webfont — this is the difference between a fast and a blocked FCP.
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Azlhart® — Independent Creative Studio",
    template: "%s — Azlhart®",
  },
  description:
    "Independent creative studio shaping digital worlds with motion, precision, and bold expression. Branding, UI/UX design, and web development by Mario Daruranto.",
  keywords: [
    "creative studio",
    "web design",
    "framer",
    "next.js",
    "branding",
    "UI/UX",
  ],
  authors: [{ name: "Mario Daruranto" }],
  openGraph: {
    type: "website",
    siteName: "Azlhart®",
    title: "Azlhart® — Independent Creative Studio",
    description:
      "Independent creative studio shaping digital worlds with motion, precision, and bold expression.",
    images: ["/images/hero-thumbnail.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Azlhart® — Independent Creative Studio",
    description:
      "Independent creative studio shaping digital worlds with motion, precision, and bold expression.",
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
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
