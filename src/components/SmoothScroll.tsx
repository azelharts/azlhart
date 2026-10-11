"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef } from "react";
import { useGSAP, ScrollTrigger, gsap } from "@/lib/gsap";

const ScrollContext = createContext({
  scrollTo: (top: number) => window.scrollTo({ top, behavior: "instant" }),
  lock: (locked: boolean) => {
    void locked;
  },
});
export const useStudioScroll = () => useContext(ScrollContext);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const content = useRef<HTMLDivElement>(null);
  const instance = useRef<Lenis | null>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(
        "(pointer: fine) and (prefers-reduced-motion: no-preference)",
        () => {
          const lenis = new Lenis({
            lerp: 0.1,
            smoothWheel: true,
            syncTouch: false,
            anchors: { offset: -84 },
            prevent: (node) =>
              Boolean(node.closest("dialog, textarea, [data-native-scroll]")),
          });
          instance.current = lenis;
          const tick = (time: number) => lenis.raf(time * 1000);
          lenis.on("scroll", ScrollTrigger.update);
          gsap.ticker.add(tick);
          return () => {
            gsap.ticker.remove(tick);
            lenis.off("scroll", ScrollTrigger.update);
            lenis.destroy();
            instance.current = null;
          };
        },
      );
      let frame = 0;
      let disposed = false;
      const refresh = () => {
        if (disposed) return;
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          instance.current?.resize();
          ScrollTrigger.refresh();
        });
      };
      const observer = new ResizeObserver(refresh);
      if (content.current) observer.observe(content.current);
      document.fonts.ready.then(refresh);
      return () => {
        disposed = true;
        cancelAnimationFrame(frame);
        observer.disconnect();
        mm.revert();
      };
    },
    { scope: content },
  );
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      instance.current?.resize();
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname]);
  return (
    <ScrollContext.Provider
      value={{
        scrollTo: (top) => {
          if (instance.current)
            instance.current.scrollTo(top, { immediate: true });
          else window.scrollTo({ top, behavior: "instant" });
        },
        lock: (locked) => {
          if (locked) instance.current?.stop();
          else instance.current?.start();
        },
      }}
    >
      <div ref={content} id="smooth-content">
        {children}
      </div>
    </ScrollContext.Provider>
  );
}
