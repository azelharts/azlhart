"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

import { usePathname, useRouter } from "next/navigation";

import { gsap, useGSAP, EASE } from "@/lib/gsap";
import { drukWide } from "@/lib/utils";

import DotSurface, { type DotSurfaceHandle } from "./DotSurface";

type Navigate = (href: string) => void;

const TransitionContext = createContext<Navigate | null>(null);

/** Starts a page change through the transition. */
export const usePageTransition = () => {
  const navigate = useContext(TransitionContext);
  if (!navigate) throw new Error("usePageTransition outside <PageTransition>");
  return navigate;
};

const LABELS: Record<string, string> = {
  "/": "Index",
  "/works": "Works",
  "/about": "About",
};

const labelFor = (href: string) =>
  LABELS[href] ?? (href.startsWith("/works/") ? "Reading" : "Azlhart");

/** The page content under the smooth scroller (not the scroller itself,
 *  whose transform belongs to ScrollSmoother). */
const PAGE = "#smooth-content main";

/**
 * The page element itself, not the selector: this component's GSAP context
 * is scoped to the overlay, so a selector string would only be looked up
 * inside the overlay and never match.
 */
const page = () => document.querySelector<HTMLElement>(PAGE);

const CHARS = "azlhart0123456789#/[]";

/**
 * The page change, built from the site's two materials (ART_DIRECTION.md).
 *
 * Cover: dots grow out from where you clicked until they close into a solid
 * black surface, while the current page sinks a little. The destination's
 * name decodes in, large, in the corner.
 *
 * Reveal: the name decodes back out into blanks, the dots shrink away from
 * that same point, and the new page rises into place underneath.
 *
 * It sits outside #smooth-wrapper, because ScrollSmoother transforms that
 * element and a fixed overlay inside it would scroll away.
 */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<DotSurfaceHandle>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const busy = useRef(false);
  const pending = useRef<{
    from: string;
    origin: { x: number; y: number };
  } | null>(null);
  const lastPointer = useRef({ x: 0, y: 0 });

  const { contextSafe } = useGSAP({ scope: rootRef });

  // Where the gesture happened: the dots grow from the click.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  const navigate = useCallback<Navigate>(
    (href) => {
      const target = href.split("#")[0] || "/";
      if (busy.current || target === pathname) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      busy.current = true;
      const origin = { ...lastPointer.current };
      pending.current = { from: pathname, origin };
      const name = labelFor(target);

      contextSafe(() => {
        gsap.set(rootRef.current, { autoAlpha: 1 });
        gsap.fromTo(
          ".pt-mark",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, delay: 0.4 },
        );
        if (labelRef.current) labelRef.current.textContent = "";

        gsap.to(page(), {
          y: "-4vh",
          autoAlpha: 0.4,
          duration: 0.8,
          ease: EASE,
        });
        gsap.to(labelRef.current, {
          delay: 0.4,
          duration: 0.6,
          ease: "none",
          scrambleText: { text: name, chars: CHARS, speed: 0.6 },
        });

        dotsRef.current
          ?.play(1, { origin, spread: 0.55, cellDuration: 0.3 })
          // Push only once the page is fully covered, so the swap is never
          // seen. The short hold lets the name finish decoding.
          .then(() => gsap.delayedCall(0.2, () => router.push(href)));
      })();
    },
    [contextSafe, pathname, router],
  );

  // The new route has committed: reveal it.
  useEffect(() => {
    const move = pending.current;
    if (!move || move.from === pathname) return;
    pending.current = null;

    // The URL can commit before the new page's content has mounted (a
    // streamed or still-compiling route). Wait for it, so the reveal always
    // has a page to rise and the dots never lift off an empty screen.
    let waited = 0;
    let poll = 0;
    const whenReady = (run: () => void) => {
      if (document.querySelector(PAGE) || waited > 120) run();
      else {
        waited++;
        poll = requestAnimationFrame(() => whenReady(run));
      }
    };

    whenReady(
      contextSafe(() => {
        const label = labelRef.current;
        gsap.to(".pt-mark", { autoAlpha: 0, duration: 0.3 });
        // Decode out into blanks of the same length: the word dissolves in
        // place instead of collapsing, which read as being cut short.
        const blanks = (label?.textContent ?? "").replace(/./g, " ");

        gsap.to(label, {
          duration: 0.7,
          ease: "none",
          scrambleText: { text: blanks, chars: CHARS, speed: 0.5 },
        });
        gsap.fromTo(
          page(),
          { y: "6vh", autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 1, ease: EASE, delay: 0.35 },
        );

        gsap.delayedCall(0.25, () => {
          dotsRef.current
            ?.play(0, { origin: move.origin, spread: 0.6, cellDuration: 0.35 })
            .then(() => {
              gsap.set(rootRef.current, { autoAlpha: 0 });
              gsap.set(page(), { clearProps: "transform,opacity,visibility" });
              busy.current = false;
            });
        });
      }),
    );

    return () => cancelAnimationFrame(poll);
  }, [pathname, contextSafe]);

  return (
    <TransitionContext.Provider value={navigate}>
      {children}

      <div
        ref={rootRef}
        aria-hidden="true"
        className="invisible fixed inset-0 z-[80]"
      >
        <DotSurface ref={dotsRef} color="#0a0a0a" cell={22} />

        <div className="px-container absolute inset-x-0 bottom-0 flex items-end justify-between">
          {/* Owned by GSAP, not React: scrambleText rewrites its contents. */}
          <span
            ref={labelRef}
            className={`tablet:text-7xl desktop:text-9xl text-5xl leading-[85%] whitespace-pre uppercase ${drukWide.className}`}
          />
          <span className="pt-mark p-responsive text-white/50">
            &#91;AZL®&#93;
          </span>
        </div>
      </div>
    </TransitionContext.Provider>
  );
};

export default PageTransition;
