"use client";

import { gsap, SplitText, ScrollTrigger } from "./gsap";

/**
 * The scroll reveals repeated across every section. Each one was duplicated
 * inline in five components; sharing them keeps the trigger config, easing and
 * will-change handling identical everywhere.
 *
 * All of these must be called synchronously inside a useGSAP callback so the
 * surrounding gsap.context() captures them for cleanup.
 */

/** Fires once, when the element's top first reaches the bottom of the viewport. */
const ONCE = { start: "top bottom", once: true } as const;

/**
 * `will-change` is a promise to the browser, not a free win — a layer kept alive
 * for the whole page costs memory. Promote right before the tween runs and drop
 * the hint the moment it finishes.
 */
const promote = (hint: string) => ({
  onStart(this: gsap.core.Tween) {
    gsap.set(this.targets(), { willChange: hint });
  },
  onComplete(this: gsap.core.Tween) {
    gsap.set(this.targets(), { willChange: "auto" });
  },
});

type Target = gsap.DOMTarget | null;

/** Masked line-by-line reveal. Re-splits automatically on resize. */
export const revealLines = (target: Target, stagger = 0.075) => {
  if (!target) return;

  return SplitText.create(target, {
    type: "lines",
    mask: "lines",
    autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        scrollTrigger: { trigger: target as gsap.DOMTarget, ...ONCE },
        yPercent: 100,
        stagger,
        ...promote("transform"),
      }),
  });
};

/** Simple opacity reveal. `autoAlpha` also flips visibility, so hidden elements stay out of the a11y tree. */
export const revealFade = (targets: Target, stagger = 0) => {
  if (!targets) return;

  return gsap.from(targets, {
    scrollTrigger: { trigger: targets as gsap.DOMTarget, ...ONCE },
    autoAlpha: 0,
    duration: 0.75,
    stagger,
    ...promote("opacity"),
  });
};

/** Bottom-to-top wipe used on every image. */
export const revealWipe = (targets: Target, stagger = 0) => {
  if (!targets) return;

  return gsap.from(targets, {
    scrollTrigger: { trigger: targets as gsap.DOMTarget, ...ONCE },
    clipPath: "inset(0% 0% 100% 0%)",
    duration: 0.75,
    stagger,
    ...promote("clip-path"),
  });
};

/**
 * One reveal per element, but callbacks are coalesced into a single batched
 * tween — far cheaper than N independent ScrollTriggers each running their own
 * tween when a row of cards enters together.
 */
export const revealBatch = (selector: string, stagger = 0.1) => {
  gsap.set(selector, { autoAlpha: 0 });

  return ScrollTrigger.batch(selector, {
    start: "top 95%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        autoAlpha: 1,
        duration: 0.75,
        stagger,
        overwrite: true,
      }),
  });
};

/**
 * Reveals everything instantly, no motion. Used as the `prefers-reduced-motion`
 * branch so the page still renders correctly for users who opt out — GSAP's
 * `.from()` tweens would otherwise leave elements stuck at their start values.
 */
export const revealInstantly = (selectors: string[]) => {
  gsap.set(selectors, { autoAlpha: 1, clearProps: "clipPath,transform" });
};
