"use client";
import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import ScrambleTextPlugin from "gsap/dist/ScrambleTextPlugin";

const ScrambleText = ({ text }: { text: string }) => {
  const textRef = useRef<HTMLElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.registerPlugin(ScrambleTextPlugin);
    },
    { scope: textRef },
  );

  const hoverIn = contextSafe(() => {
    gsap.to(textRef.current, {
      duration: 0.45,
      scrambleText: {
        text: text,
        chars: text,
        speed: 0.125,
        tweenLength: false,
      },
    });
  });

  const hoverOut = contextSafe(() => {
    gsap.to(textRef.current, {
      duration: 0.45,
      scrambleText: {
        text: text,
        chars: text,
        speed: 1,
        tweenLength: false,
      },
    });
  });

  return (
    <span
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      ref={textRef}
      className="font-bold text-nowrap"
    >
      {text}
    </span>
  );
};

export default ScrambleText;
