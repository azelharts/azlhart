"use client";

import "./globals.css";

import { usePathname } from "next/navigation";
import { Inter } from "next/font/google";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollSmoother from "gsap/dist/ScrollSmoother";

import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useGSAP(
    () => {
      ScrollSmoother.create({
        smooth: 1.5,
        effects: true,
      });
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <html lang="en" className={`${inter.className} antialiased`}>
      <head>
        <title>Azlhart® - Independent Creative Studio</title>
      </head>
      <body className="relative">
        <Navbar />
        <div id="smooth-wrapper">
          <div id="smooth-content" className="will-change-transform">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
