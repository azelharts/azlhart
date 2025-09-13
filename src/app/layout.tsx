"use client";

import "./globals.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import ScrollSmoother from "gsap/dist/ScrollSmoother";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
}

// export const metadata: Metadata = {
//   title: "Azlhart® - Independent Creative Studio",
//   description: "",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  useGSAP(
    () => {
      ScrollSmoother.create({
        smooth: 1,
        smoothTouch: 0.25,
        effects: true,
      });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return (
    <html lang="en">
      <head />
      <body className={`font-[BricolageGrotesque] antialiased`}>
        <Navbar />
        <div id="smooth-wrapper">
          <div id="smooth-content">{children}</div>
        </div>
      </body>
    </html>
  );
}
