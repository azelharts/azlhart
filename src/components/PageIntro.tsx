"use client";
import { useRef } from "react";
import { drukWide } from "@/lib/utils";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
export default function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const ready = useFontsReady();
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create("h1", {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 105,
              duration: 0.95,
              stagger: 0.12,
              ease: "power4.out",
            }),
        });
        gsap.from(".eyebrow, .intro-copy", {
          y: 18,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready, title], revertOnUpdate: true },
  );
  return (
    <header className="page-intro" ref={root}>
      <p className="eyebrow">{label}</p>
      <h1 className={drukWide.className}>{title}</h1>
      <div className="intro-copy">{children}</div>
    </header>
  );
}
