"use client";

import { useEffect, useState } from "react";

/**
 * Resolves once webfonts have loaded.
 *
 * SplitText has to measure real glyph metrics, so line splitting must wait for
 * the fonts. Awaiting `document.fonts.ready` *inside* a useGSAP callback is a
 * leak: the callback returns before the promise settles, gsap.context() has
 * already closed, and every animation created in the `.then()` escapes cleanup.
 *
 * Returning a flag instead lets callers pass it as a useGSAP dependency, so all
 * GSAP objects are created synchronously inside the context and get reverted
 * properly on unmount.
 */
export const useFontsReady = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
};
