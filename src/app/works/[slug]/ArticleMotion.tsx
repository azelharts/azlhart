"use client";

import { useEffect } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { revealLines } from "@/lib/animations";

const CHARS = "azlhart0123456789#/[]";

/**
 * Motion for the server-rendered article body, applied to the DOM after it
 * mounts (the MDX itself stays static HTML):
 *
 * - section headings rise in, line by line, as they scroll into view;
 * - every code block gets a copy button whose label decodes to "copied".
 */
const ArticleMotion = ({ targetId }: { targetId: string }) => {
  useGSAP(
    () => {
      const body = document.getElementById(targetId);
      if (!body) return;

      // Section headings rise in line by line from behind a mask as they
      // scroll into view. (Scrambling them reflowed wrapped headings.)
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        body
          .querySelectorAll<HTMLElement>(":scope > h2, :scope > h3")
          .forEach((h) => revealLines(h));
      });
    },
    { dependencies: [targetId] },
  );

  useEffect(() => {
    const body = document.getElementById(targetId);
    if (!body) return;

    const buttons: HTMLButtonElement[] = [];
    body
      .querySelectorAll<HTMLElement>("figure[data-rehype-pretty-code-figure]")
      .forEach((fig) => {
        const pre = fig.querySelector("pre");
        if (!pre || fig.querySelector(".code-copy")) return;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "code-copy";
        button.textContent = "copy";
        button.setAttribute("aria-label", "Copy code");
        button.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(pre.innerText);
          } catch {
            return;
          }
          gsap.to(button, {
            duration: 0.4,
            ease: "none",
            scrambleText: { text: "copied", chars: CHARS, speed: 0.6 },
          });
          gsap.to(button, {
            delay: 1.6,
            duration: 0.4,
            ease: "none",
            scrambleText: { text: "copy", chars: CHARS, speed: 0.6 },
          });
        });
        fig.appendChild(button);
        buttons.push(button);
      });

    return () => buttons.forEach((b) => b.remove());
  }, [targetId]);

  return null;
};

export default ArticleMotion;
