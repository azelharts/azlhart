"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

import { DotWipe, type Origin, type WipeOptions } from "@/lib/dots";
import { cn } from "@/lib/utils";

export interface DotSurfaceHandle {
  play: (to: 0 | 1, options?: WipeOptions) => Promise<void>;
  set: (coverage: 0 | 1) => void;
  /** A pointer event's position, in this surface's coordinates. */
  originOf: (e: { clientX: number; clientY: number }) => Origin;
}

interface DotSurfaceProps {
  color?: string;
  cell?: number;
  className?: string;
}

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A canvas that fills its parent and can grow into a solid surface of dots.
 * Put it behind content (the parent needs `relative`) and drive it through the
 * ref. With reduced motion, every play() jumps straight to its end state.
 */
const DotSurface = forwardRef<DotSurfaceHandle, DotSurfaceProps>(
  function DotSurface({ color = "#ffffff", cell = 14, className }, ref) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const wipe = useRef<DotWipe | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const instance = new DotWipe(canvas, color, cell);
      wipe.current = instance;
      const ro = new ResizeObserver(() => instance.resize());
      ro.observe(canvas);
      return () => {
        ro.disconnect();
        instance.stop();
        wipe.current = null;
      };
    }, [color, cell]);

    useImperativeHandle(ref, () => ({
      play: (to, options) => {
        const instance = wipe.current;
        if (!instance) return Promise.resolve();
        if (reducedMotion()) {
          instance.set(to);
          return Promise.resolve();
        }
        return instance.play(to, options);
      },
      set: (coverage) => wipe.current?.set(coverage),
      originOf: (e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        return rect
          ? { x: e.clientX - rect.left, y: e.clientY - rect.top }
          : "center";
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full",
          className,
        )}
      />
    );
  },
);

export default DotSurface;
