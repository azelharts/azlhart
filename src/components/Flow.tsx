"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";

export interface FlowNode {
  id: string;
  label: string;
  /** A short second line, e.g. "every 3 s". */
  note?: string;
}

interface FlowProps {
  nodes: FlowNode[];
  /** Rows of node ids. Up to three ids per row. */
  layout: string[][];
  /** [from, to, label?] */
  edges: [string, string, string?][];
  caption?: string;
}

type Line = { d: string; mx: number; my: number; label?: string };

const CHARS = "azlhart0123456789#/[]";

/**
 * A small box-and-arrow diagram for the articles.
 *
 * Nodes sit on a CSS grid, one row per `layout` entry; the connectors are an
 * SVG drawn over it from the measured box positions, routed as straight or
 * single-elbow lines. When the figure scrolls into view the connectors draw
 * themselves and every label decodes, the same scramble the rest of the site
 * uses for text.
 */
const Flow = ({ nodes, layout, edges, caption }: FlowProps) => {
  const rootRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  // On a narrow column the rows can't fit side by side: stack every node in
  // reading order, one per row, and let the connectors run down the page.
  const [narrow, setNarrow] = useState(false);

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const rows = narrow ? layout.flat().map((id) => [id]) : layout;
  const cols = Math.max(...rows.map((r) => r.length));

  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const measure = () => {
      setNarrow(grid.parentElement!.clientWidth < 480);
      const base = grid.getBoundingClientRect();
      const box = (id: string) => {
        const el = grid.querySelector<HTMLElement>(`[data-node="${id}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          l: r.left - base.left,
          r: r.right - base.left,
          t: r.top - base.top,
          b: r.bottom - base.top,
          cx: r.left - base.left + r.width / 2,
          cy: r.top - base.top + r.height / 2,
        };
      };

      const next: Line[] = [];
      for (const [from, to, label] of edges) {
        const a = box(from);
        const b = box(to);
        if (!a || !b) continue;

        let d: string;
        let mx: number;
        let my: number;
        if (Math.abs(a.cy - b.cy) < 4) {
          // Same row: straight across, edge to edge.
          const [x1, x2] = a.cx < b.cx ? [a.r, b.l] : [a.l, b.r];
          d = `M${x1},${a.cy} H${x2}`;
          mx = (x1 + x2) / 2;
          my = a.cy;
        } else if (Math.abs(a.cx - b.cx) < 4) {
          // Same column: straight down (or up).
          const [y1, y2] = a.cy < b.cy ? [a.b, b.t] : [a.t, b.b];
          d = `M${a.cx},${y1} V${y2}`;
          mx = a.cx;
          my = (y1 + y2) / 2;
        } else {
          // Different row and column: leave from the bottom, one elbow.
          const down = a.cy < b.cy;
          const y1 = down ? a.b : a.t;
          const y2 = down ? b.t : b.b;
          const midY = (y1 + y2) / 2;
          d = `M${a.cx},${y1} V${midY} H${b.cx} V${y2}`;
          mx = (a.cx + b.cx) / 2;
          my = midY;
        }
        next.push({ d, mx, my, label });
      }
      setLines(next);
      setSize({ w: base.width, h: base.height });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(grid);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [narrow]);

  useGSAP(
    () => {
      if (!lines.length) return;
      const mm = gsap.matchMedia(rootRef);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 80%",
            once: true,
          },
        });
        tl.from(".flow-node", {
          autoAlpha: 0,
          duration: 0.4,
          stagger: 0.08,
        }).from(
          ".flow-line",
          { drawSVG: 0, duration: 0.6, stagger: 0.12, ease: "power2.inOut" },
          0.2,
        );
        gsap.utils
          .toArray<HTMLElement>(".flow-text", rootRef.current)
          .forEach((el, i) =>
            tl.from(
              el,
              {
                duration: 0.7,
                ease: "none",
                scrambleText: { text: "", chars: CHARS, speed: 0.5 },
              },
              0.1 + i * 0.05,
            ),
          );
      });
    },
    { dependencies: [lines.length], scope: rootRef, revertOnUpdate: true },
  );

  return (
    <figure ref={rootRef} className="article-flow">
      <div className="tablet:p-8 relative overflow-x-auto border border-white/15 p-5">
        <div
          ref={gridRef}
          className="relative grid gap-x-10 gap-y-12"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(120px, 1fr))` }}
        >
          {rows.map((row, r) =>
            row.map((id, c) => {
              const node = byId.get(id);
              if (!node) return null;
              return (
                <div
                  key={id}
                  data-node={id}
                  className="flow-node flex flex-col gap-y-1.5 border border-white/40 bg-[var(--background)] px-3 py-2.5"
                  style={{ gridRow: r + 1, gridColumn: c + 1 }}
                >
                  <span className="flow-text text-xs !leading-[130%] font-bold text-white">
                    {node.label}
                  </span>
                  {node.note && (
                    <span className="flow-text text-[11px] !leading-[130%] text-white/50">
                      {node.note}
                    </span>
                  )}
                </div>
              );
            }),
          )}

          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={size.w}
            height={size.h}
          >
            <defs>
              <marker
                id="flow-arrow"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path
                  d="M0,0 L8,4 L0,8"
                  fill="none"
                  stroke="white"
                  strokeOpacity="0.6"
                />
              </marker>
            </defs>
            {lines.map((l, i) => (
              <path
                key={i}
                className="flow-line"
                d={l.d}
                fill="none"
                stroke="white"
                strokeOpacity="0.45"
                strokeWidth="1"
                markerEnd="url(#flow-arrow)"
              />
            ))}
          </svg>

          {lines.map(
            (l, i) =>
              l.label && (
                <span
                  key={`label-${i}`}
                  className="flow-text pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 bg-[var(--background)] px-1.5 text-[10px] whitespace-nowrap text-white/60"
                  style={{ left: l.mx, top: l.my }}
                >
                  {l.label}
                </span>
              ),
          )}
        </div>
      </div>
      {caption && (
        <figcaption className="article-label mt-3">
          &#91;FIG.&#93; {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default Flow;
