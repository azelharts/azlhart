"use client";

import "./globals.css";

import { usePathname } from "next/navigation";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollSmoother from "gsap/dist/ScrollSmoother";

import Navbar from "@/components/Navbar";

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
        smoothTouch: 0.25,
        effects: true,
        normalizeScroll: true,
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <html lang="en">
      <head>
        <title>Azlhart® - Independent Creative Studio</title>
      </head>
      <body className="font-[BricolageGrotesque] antialiased relative">
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
