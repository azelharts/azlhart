"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, useGSAP, ScrollTrigger, ScrollSmoother } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Heading = { id: string; text: string };

// Clears the navbar wordmark (up to 64px tall, 32px from the top) with room
// to spare, so the pinned list never slides under it.
const OFFSET = 180;

/**
 * "In this article": the h2s of the body, pinned in the left gutter on
 * desktop, with the section being read highlighted.
 *
 * `position: sticky` can't do this here: ScrollSmoother moves the page with a
 * transform, so the aside is pinned by ScrollTrigger instead.
 */
const ArticleToc = ({ targetId }: { targetId: string }) => {
  const asideRef = useRef<HTMLElement>(null);
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState<string | null>(null);

  // The headings are server-rendered MDX; read them once they're in the DOM.
  useEffect(() => {
    const found = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(`#${targetId} > h2[id]`),
    ).map((h) => ({ id: h.id, text: h.textContent ?? "" }));
    setHeadings(found);
  }, [targetId]);

  useGSAP(
    () => {
      if (!headings.length) return;

      const mm = gsap.matchMedia();
      mm.add("(min-width: 1256px)", () => {
        const aside = asideRef.current;
        const body = document.getElementById(targetId);
        if (!aside || !body) return;

        ScrollTrigger.create({
          trigger: body,
          start: `top ${OFFSET}px`,
          end: () => `bottom ${OFFSET + aside.offsetHeight}px`,
          pin: aside,
          pinSpacing: false,
        });

        headings.forEach((h, i) => {
          ScrollTrigger.create({
            trigger: `#${CSS.escape(h.id)}`,
            start: "top 40%",
            onEnter: () => setActive(h.id),
            onLeaveBack: () => setActive(headings[i - 1]?.id ?? null),
          });
        });
      });
    },
    { dependencies: [headings, targetId], revertOnUpdate: true },
  );

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(el, true, `top ${OFFSET}px`);
    else el.scrollIntoView({ behavior: "smooth" });
  };

  if (!headings.length) return null;

  return (
    <nav
      ref={asideRef}
      aria-label="In this article"
      className="desktop:flex absolute top-0 left-0 hidden w-[calc((100%-396px)/12*2+36px)] flex-col gap-y-4"
    >
      <span className="article-label">IN THIS ARTICLE</span>
      <ol className="flex flex-col gap-y-3 border-l border-white/15">
        {headings.map((h, i) => (
          <li key={h.id}>
            <button
              type="button"
              onClick={() => jump(h.id)}
              className={cn(
                "-ml-px border-l py-0.5 pl-4 text-left text-xs !leading-[140%] font-normal transition-colors duration-300",
                active === h.id
                  ? "border-white text-white"
                  : "border-transparent text-white/45 hover:text-white",
              )}
            >
              <span className="mr-2 opacity-50">
                {String(i + 1).padStart(2, "0")}
              </span>
              {h.text}
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default ArticleToc;
