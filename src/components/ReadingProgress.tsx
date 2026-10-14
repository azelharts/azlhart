"use client";

import { useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { gsap, useGSAP } from "@/lib/gsap";

const subscribe = () => () => {};

/**
 * A hairline across the top of the viewport that fills as the article is read.
 *
 * Portalled to <body>: ScrollSmoother transforms #smooth-content, and a
 * `position: fixed` element inside a transformed ancestor scrolls away with it.
 */
const ReadingProgress = ({ targetId }: { targetId: string }) => {
  const barRef = useRef<HTMLDivElement>(null);
  // The portal target only exists on the client.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useGSAP(
    () => {
      if (!mounted) return;

      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: `#${targetId}`,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        },
      );
    },
    { dependencies: [mounted, targetId] },
  );

  if (!mounted) return null;

  return createPortal(
    <div
      ref={barRef}
      aria-hidden="true"
      className="bg-accent fixed top-0 left-0 z-[60] h-[2px] w-full origin-left scale-x-0"
    />,
    document.body,
  );
};

export default ReadingProgress;
