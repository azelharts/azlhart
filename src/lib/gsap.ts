"use client";

/**
 * Single place where GSAP is configured.
 *
 * Plugins are registered once at module scope instead of inside each component's
 * useGSAP callback — registering on every mount is wasted work, and importing
 * from `gsap/dist/*` (the UMD builds) pulls in bundles that can't be tree-shaken.
 * Every component imports the ESM subpath through this module instead.
 */

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  CustomEase,
);

/** The site's signature ease. Created once; referenced everywhere by name. */
export const EASE = "azl";
CustomEase.create(EASE, "M0,0 C0.82,0.08 0.29,1 1,1");

// Ease only. Setting a default `duration` here would silently retime every
// tween that relies on GSAP's native 0.5 — including the hero intro, where the
// unspecified steps are choreographed against "-=1" / "-=0.75" offsets.
gsap.defaults({ ease: EASE });

// A ScrollTrigger.refresh() per resize event is enough; the default 200ms
// debounce still fires a full recalc mid-drag on desktop window resizes.
ScrollTrigger.config({ ignoreMobileResize: true });

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  ScrambleTextPlugin,
  CustomEase,
};
