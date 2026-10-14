"use client";

import { useEffect, useRef } from "react";

import { ScrollTrigger } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { drukWide } from "@/lib/utils";

/** Stable per-cell noise in 0..1. */
const noise = (i: number, j: number) => {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

/**
 * The footer wordmark, printed as halftone dots, edge to edge.
 *
 * The word is drawn once into an offscreen canvas at the size that fits the
 * container; each grid cell then becomes a dot sized by how much of the
 * letterform covers it.
 *
 * In: the same dot wipe as the page transition. Each dot grows after a delay
 * set by its distance from the bottom edge plus a little per-cell noise, so
 * the word prints itself up from below as the footer scrolls into view.
 * Out: scrolling back up shrinks them away in reverse (it's scrubbed).
 * At rest: a slow wave rolls along the word, so the dots keep breathing.
 */
const DotWordmark = ({
  text = "azlhart",
  scrub = true,
}: {
  text?: string;
  /** Tie the dot wipe to scroll (footer); otherwise play it once on mount. */
  scrub?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fontsReady = useFontsReady();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !fontsReady) return;

    const family = drukWide.style.fontFamily;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cell = 8;
    let cols = 0;
    let rows = 0;
    let coverage = new Float32Array(0);
    let width = 0;
    let height = 0;
    let progress = reduced ? 1 : 0;
    let frame = 0;
    let visible = false;
    const start = performance.now();

    const layout = () => {
      width = canvas.parentElement!.clientWidth;
      // Not laid out yet (mid-transition, or a hidden parent): skip, and let
      // the ResizeObserver call back once there's a real width.
      if (width < 1) {
        cols = rows = 0;
        return;
      }
      cell = width < 834 ? 5 : 8;

      // Measure at 100px, then scale the font so the word spans the width.
      const probe = document.createElement("canvas").getContext("2d")!;
      probe.font = `100px ${family}`;
      const m = probe.measureText(text);
      const fontSize =
        (100 * width) / (m.actualBoundingBoxLeft + m.actualBoundingBoxRight);
      probe.font = `${fontSize}px ${family}`;
      const metrics = probe.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;
      height = Math.ceil(ascent + descent);
      if (!Number.isFinite(height) || height < 1) {
        cols = rows = 0;
        return;
      }

      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rasterise the word once, then read coverage per cell.
      const off = document.createElement("canvas");
      off.width = Math.ceil(width);
      off.height = height;
      const octx = off.getContext("2d", { willReadFrequently: true })!;
      octx.font = `${fontSize}px ${family}`;
      octx.fillStyle = "#fff";
      octx.textBaseline = "alphabetic";
      octx.fillText(text, metrics.actualBoundingBoxLeft, ascent);
      const data = octx.getImageData(0, 0, off.width, off.height).data;

      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      coverage = new Float32Array(cols * rows);
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          // Average a 3x3 sample inside the cell for a smooth edge.
          let sum = 0;
          for (let sy = 0; sy < 3; sy++)
            for (let sx = 0; sx < 3; sx++) {
              const x = Math.min(
                off.width - 1,
                Math.floor(i * cell + ((sx + 0.5) * cell) / 3),
              );
              const y = Math.min(
                off.height - 1,
                Math.floor(j * cell + ((sy + 0.5) * cell) / 3),
              );
              sum += data[(y * off.width + x) * 4 + 3] / 255;
            }
          coverage[j * cols + i] = sum / 9;
        }
    };

    const draw = (now = start) => {
      const t = reduced ? 0 : (now - start) / 1000;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
          const c = coverage[j * cols + i];
          if (c < 0.02) continue;
          // Dot wipe from the bottom edge, with per-cell noise.
          const delay = (1 - j / rows) * 0.55 + noise(i, j) * 0.25;
          const local = Math.min(
            1,
            Math.max(0, (progress * 1.2 - delay) / 0.4),
          );
          if (local <= 0) continue;
          // The idle wave: a diagonal swell travelling slowly to the right.
          const wave = reduced
            ? 1
            : 0.72 +
              0.28 * (0.5 + 0.5 * Math.sin(t * 1.3 - i * 0.16 + j * 0.1));
          const r = Math.sqrt(c) * cell * 0.46 * local * wave;
          if (r < 0.3) continue;
          const x = (i + 0.5) * cell;
          const y = (j + 0.5) * cell;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
      ctx.fill();
    };

    const loop = (now: number) => {
      draw(now);
      frame = requestAnimationFrame(loop);
    };

    layout();
    draw();

    // Without scroll: print in over ~1.2 s, then just breathe.
    let intro = 0;
    if (!reduced && !scrub) {
      const t0 = performance.now();
      const grow = (now: number) => {
        progress = Math.min(1, (now - t0) / 1200);
        if (progress < 1) intro = requestAnimationFrame(grow);
      };
      intro = requestAnimationFrame(grow);
    }

    const trigger =
      reduced || !scrub
        ? null
        : ScrollTrigger.create({
            trigger: canvas,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 0.6,
            onUpdate: (self) => {
              progress = self.progress;
            },
          });

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) frame = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(canvas.parentElement!);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(intro);
      trigger?.kill();
      io.disconnect();
      ro.disconnect();
    };
  }, [fontsReady, text, scrub]);

  return (
    <div className="w-full">
      <canvas ref={canvasRef} aria-hidden="true" className="block w-full" />
      <span className="sr-only">{text}</span>
    </div>
  );
};

export default DotWordmark;
