"use client";

import { ReactNode, useRef } from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/dist/CustomEase";

interface BaseProps {
  className?: string;
  children: ReactNode;
}

interface LinkProps extends BaseProps {
  as?: "link";
  href: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  onClick?: never;
}

interface ButtonProps extends BaseProps {
  as: "button";
  href?: never;
  target?: never;
  onClick?: () => void;
}

type RollingTextProps = LinkProps | ButtonProps;

const RollingText = (props: RollingTextProps) => {
  const { className, children } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      if (!elementRef.current || !containerRef.current) return;

      // Create two identical text elements - one for original, one for hover state
      const originalText = elementRef.current.textContent || "";

      // Clear the element and create structure
      elementRef.current.innerHTML = `
        <span class="original-text">${originalText}</span>
        <span class="hover-text" aria-hidden="true">${originalText}</span>
      `;

      const originalSpan = elementRef.current.querySelector(
        ".original-text"
      ) as HTMLElement;
      const hoverSpan = elementRef.current.querySelector(
        ".hover-text"
      ) as HTMLElement;

      if (!originalSpan || !hoverSpan) return;

      // Split text into characters
      const originalSplit = new SplitText(originalSpan, { type: "chars" });
      const hoverSplit = new SplitText(hoverSpan, { type: "chars" });

      // Set initial positions
      gsap.set(originalSplit.chars, { y: 0 });
      gsap.set(hoverSplit.chars, { y: "100%" });

      // Position hover text absolutely
      gsap.set(hoverSpan, {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
      });

      // Create hover animations
      const hoverIn = () => {
        const tl = gsap.timeline();

        tl.to(originalSplit.chars, {
          y: "-100%",
          stagger: { amount: 0.2 },
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        }).to(
          hoverSplit.chars,
          {
            y: "0%",
            stagger: { amount: 0.2 },
            ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
          },
          0
        );

        return tl;
      };

      const hoverOut = () => {
        const tl = gsap.timeline();

        tl.to(hoverSplit.chars, {
          y: "100%",
          stagger: { amount: 0.2 },
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        }).to(
          originalSplit.chars,
          {
            y: "0%",
            duration: 0.4,
            stagger: { amount: 0.2 },
            ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
          },
          0
        );

        return tl;
      };

      // Add event listeners
      elementRef.current.addEventListener("mouseenter", hoverIn);
      elementRef.current.addEventListener("mouseleave", hoverOut);

      // Cleanup function
      return () => {
        if (elementRef.current) {
          elementRef.current.removeEventListener("mouseenter", hoverIn);
          elementRef.current.removeEventListener("mouseleave", hoverOut);
        }
      };
    },
    { scope: containerRef }
  );

  const baseClassName = cn(
    "font-bold overflow-hidden relative h-fit w-fit flex items-center cursor-pointer",
    className
  );

  return (
    <div ref={containerRef} className="relative inline-block">
      {props.as === "button" ? (
        <button
          ref={elementRef as React.RefObject<HTMLButtonElement>}
          onClick={props.onClick}
          className={baseClassName}
        >
          {children}
        </button>
      ) : (
        <Link
          ref={elementRef as React.RefObject<HTMLAnchorElement>}
          href={props.href || ""}
          target={props.target}
          className={baseClassName}
        >
          {children}
        </Link>
      )}
    </div>
  );
};

export default RollingText;
