"use client";

import { useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

/**
 * There are a dozen of these on the page. The previous version ran a
 * `useGSAP` per instance purely to call `gsap.registerPlugin` — which is
 * global, idempotent, and now happens once in `@/lib/gsap`. `contextSafe` is
 * still needed so the hover tweens are captured for cleanup.
 */
const ScrambleText = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLSpanElement>(null);

  const { contextSafe } = useGSAP({ scope: textRef });

  const scramble = (speed: number) =>
    contextSafe(() => {
      gsap.to(textRef.current, {
        duration: 0.45,
        ease: "none",
        // overwrite so a fast in-out-in doesn't leave two scrambles racing
        // over the same text node.
        overwrite: true,
        scrambleText: { text, chars: text, speed, tweenLength: false },
      });
    })();

  return (
    <span
      onMouseEnter={() => scramble(0.125)}
      onMouseLeave={() => scramble(1)}
      ref={textRef}
      className="font-bold text-nowrap"
    >
      {text}
    </span>
  );
};

export default ScrambleText;
