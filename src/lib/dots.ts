/**
 * The dot wipe: the site's one surface transition (see ART_DIRECTION.md).
 *
 * A grid of halftone dots grows from an origin until the dots overlap into a
 * solid surface, or shrinks back to nothing. Each cell starts after a delay
 * proportional to its distance from the origin, plus a little per-cell noise,
 * so the surface spreads out from the pointer like ink rather than as a
 * straight wipe.
 *
 * Drawn on a 2D canvas, and only while animating.
 */

export type Origin = { x: number; y: number } | "top" | "bottom" | "center";

export interface WipeOptions {
  origin?: Origin;
  /** Seconds the front takes to cross the whole surface. */
  spread?: number;
  /** Seconds a single dot takes to grow or shrink. */
  cellDuration?: number;
}

/** Stable per-cell noise in 0..1. */
const noise = (i: number, j: number) => {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return n - Math.floor(n);
};

const easeOut = (t: number) => 1 - (1 - t) * (1 - t);

export class DotWipe {
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;
  private frame = 0;
  private dpr = 1;
  /** 0 = clear, 1 = fully covered, as of the end of the last animation. */
  private coverage = 0;
  private finish: (() => void) | null = null;
  /** Each dot's current radius, so a reversal mid-way starts from where the
   *  dots actually are instead of jumping. */
  private radii = new Float32Array(0);
  private cols = 0;
  private rows = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private color: string,
    private cell = 18,
  ) {
    this.ctx = canvas.getContext("2d")!;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = rect.width;
    this.height = rect.height;
    this.canvas.width = Math.max(1, Math.round(rect.width * this.dpr));
    this.canvas.height = Math.max(1, Math.round(rect.height * this.dpr));
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.cols = Math.ceil(this.width / this.cell) + 1;
    this.rows = Math.ceil(this.height / this.cell) + 1;
    this.radii = new Float32Array(this.cols * this.rows).fill(
      this.coverage === 1 ? this.cell * 0.74 : 0,
    );
    this.paintStatic();
  }

  /** Jump to a state with no animation. */
  set(coverage: 0 | 1) {
    this.stop();
    this.coverage = coverage;
    this.radii.fill(coverage === 1 ? this.cell * 0.74 : 0);
    this.paintStatic();
  }

  /** Animate to covered (1) or clear (0). Resolves when the last dot settles. */
  play(
    to: 0 | 1,
    { origin = "bottom", spread = 0.6, cellDuration = 0.35 }: WipeOptions = {},
  ) {
    const animating = this.finish !== null;
    this.stop();
    if (!animating && this.coverage === to) return Promise.resolve();
    this.coverage = -1; // in between until this animation lands

    const { width: w, height: h, cell, cols, rows, radii } = this;
    const o =
      typeof origin === "object"
        ? origin
        : origin === "top"
          ? { x: w / 2, y: -h * 0.15 }
          : origin === "bottom"
            ? { x: w / 2, y: h * 1.15 }
            : { x: w / 2, y: h / 2 };

    // Precompute every cell's start delay once per animation.
    const delays = new Float32Array(cols * rows);
    const startRadii = radii.slice();
    let maxDist = 1;
    for (let j = 0; j < rows; j++)
      for (let i = 0; i < cols; i++) {
        const d = Math.hypot(i * cell - o.x, j * cell - o.y);
        delays[j * cols + i] = d;
        if (d > maxDist) maxDist = d;
      }
    for (let k = 0; k < delays.length; k++) {
      const i = k % cols;
      const j = (k / cols) | 0;
      delays[k] = (delays[k] / maxDist) * spread + noise(i, j) * spread * 0.25;
    }

    const total = spread * 1.25 + cellDuration;
    const rMax = cell * 0.74; // overlapping circles: a solid surface
    const start = performance.now();

    return new Promise<void>((resolve) => {
      this.finish = resolve;
      const tick = (now: number) => {
        const t = (now - start) / 1000;
        const { ctx } = this;
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        for (let k = 0; k < delays.length; k++) {
          const p = Math.min(1, Math.max(0, (t - delays[k]) / cellDuration));
          const r0 = startRadii[k];
          const r = r0 + ((to === 1 ? rMax : 0) - r0) * easeOut(p);
          radii[k] = r;
          if (r < 0.3) continue;
          const x = (k % cols) * cell;
          const y = ((k / cols) | 0) * cell;
          ctx.moveTo(x + r, y);
          ctx.arc(x, y, r, 0, Math.PI * 2);
        }
        ctx.fill();

        if (t < total) {
          this.frame = requestAnimationFrame(tick);
        } else {
          this.coverage = to;
          this.paintStatic();
          this.finish = null;
          resolve();
        }
      };
      this.frame = requestAnimationFrame(tick);
    });
  }

  stop() {
    cancelAnimationFrame(this.frame);
    this.finish?.();
    this.finish = null;
  }

  private paintStatic() {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    if (this.coverage === 1) {
      ctx.fillStyle = this.color;
      ctx.fillRect(0, 0, width, height);
    }
  }
}
