"use client";

import { useGSAP, ScrollSmoother, ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Owns the ScrollSmoother instance.
 *
 * This lives in its own client component so the root layout can stay a server
 * component — otherwise `"use client"` at the layout level marks the entire
 * tree as client and forfeits the `metadata` export.
 */
const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useGSAP(() => {
    // Smooth scrolling hijacks the scrollbar, which is exactly what someone
    // asking for reduced motion wants to avoid. It also breaks browser
    // find-in-page and can trigger motion sickness.
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      ScrollSmoother.create({
        smooth: 1.5,
        smoothTouch: 0.25,
        effects: true,
        // Skip the transform on elements that scroll past — ScrollSmoother
        // otherwise keeps every data-speed target mounted in a layer.
        normalizeScroll: true,
      });
    });

    // Images and fonts settling after hydration shift every trigger position.
    // One refresh once the page is fully loaded, rather than per-image.
    const refresh = () => ScrollTrigger.refresh();

    if (document.readyState === "complete") {
      refresh();
    } else {
      window.addEventListener("load", refresh, { once: true });
    }

    return () => window.removeEventListener("load", refresh);
  });

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{children}</div>
    </div>
  );
};

export default SmoothScroll;
