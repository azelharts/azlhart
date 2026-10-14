"use client";

import { useEffect, useRef } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * There are a dozen of these on the page. The previous version ran a
 * `useGSAP` per instance purely to call `gsap.registerPlugin`, which is
 * global, idempotent, and now happens once in `@/lib/gsap`. `contextSafe` is
 * still needed so the hover tweens are captured for cleanup.
 */
const ScrambleText = ({
  text,
  disabled = false,
  active,
  className,
}: {
  text: string;
  /** Renders the text still. */
  disabled?: boolean;
  /**
   * Drives the scramble from outside, e.g. from hovering a whole row. When
   * set, the text's own hover is ignored and each flip to `true` scrambles.
   */
  active?: boolean;
  className?: string;
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const controlled = active !== undefined;

  const { contextSafe } = useGSAP({ scope: textRef });

  const scramble = (speed: number) =>
    contextSafe(() => {
      if (disabled) return;
      gsap.to(textRef.current, {
        duration: 0.45,
        ease: "none",
        // overwrite so a fast in-out-in doesn't leave two scrambles racing
        // over the same text node.
        overwrite: true,
        scrambleText: { text, chars: text, speed, tweenLength: false },
      });
    })();

  const wasActive = useRef(active);
  useEffect(() => {
    if (!controlled || wasActive.current === active) return;
    wasActive.current = active;
    scramble(active ? 0.125 : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Scrambled glyphs are wider or narrower than the real ones. An invisible
  // copy of the text holds the box at its resting width, so neighbours in a
  // row (the navbar links) don't shuffle sideways on every hover.
  return (
    <span
      onMouseEnter={controlled ? undefined : () => scramble(0.125)}
      onMouseLeave={controlled ? undefined : () => scramble(1)}
      className={cn("inline-grid font-bold text-nowrap", className)}
    >
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span ref={textRef} className="col-start-1 row-start-1">
        {text}
      </span>
    </span>
  );
};

export default ScrambleText;
