"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { projects } from "@/lib/content";

export default function ProjectViewer({ slug }: { slug: string }) {
  const project = projects.find((item) => item.slug === slug)!;
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"overview" | "detail">("overview");
  const [position, setPosition] = useState(0);
  const [screen, setScreen] = useState<"desktop" | "mobile">("desktop");
  const drag = useRef<{ y: number; position: number; pointer: number } | null>(
    null,
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".case-viewer-frame", {
          clipPath: "inset(0 0 12% 0)",
          duration: 1,
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className="case-viewer">
      <div className="explorer-toolbar">
        <span className="eyebrow">Interface study / {project.name}</span>
        <div role="group" aria-label="Screenshot view">
          <button
            type="button"
            aria-pressed={mode === "overview"}
            onClick={() => {
              setMode("overview");
              setPosition(0);
            }}
          >
            Overview
          </button>
          <button
            type="button"
            aria-pressed={mode === "detail"}
            onClick={() => setMode("detail")}
          >
            Inspect +
          </button>
        </div>
      </div>
      {slug === "bpbd-kota-kupang" && (
        <div
          className="screen-selector"
          role="group"
          aria-label="Project screenshots"
        >
          <button
            type="button"
            aria-pressed={screen === "desktop"}
            onClick={() => {
              setScreen("desktop");
              setPosition(0);
            }}
          >
            Desktop / 01
          </button>
          <button
            type="button"
            aria-pressed={screen === "mobile"}
            onClick={() => {
              setScreen("mobile");
              setPosition(0);
            }}
          >
            Mobile / 02
          </button>
        </div>
      )}
      <div
        className={`case-viewer-frame ${mode === "detail" ? "is-inspecting" : ""}`}
        style={{ viewTransitionName: `project-${slug}` }}
        onPointerDown={(event) => {
          if (mode !== "detail") return;
          drag.current = {
            y: event.clientY,
            position,
            pointer: event.pointerId,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current || drag.current.pointer !== event.pointerId) return;
          setPosition(
            Math.max(
              0,
              Math.min(
                100,
                drag.current.position + (drag.current.y - event.clientY) / 3,
              ),
            ),
          );
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <Image
          src={
            screen === "mobile"
              ? "/images/projects/bpbd-kota-kupang-mobile.png"
              : project.image
          }
          alt={
            screen === "mobile"
              ? "SIncan-KotaKu public homepage at a mobile viewport"
              : project.imageAlt
          }
          fill
          priority
          sizes="100vw"
          style={
            mode === "detail"
              ? {
                  objectFit: "cover",
                  width: "160%",
                  height: "160%",
                  maxWidth: "none",
                  left: "-30%",
                  top: `-${position * 0.6}%`,
                }
              : { objectFit: "contain" }
          }
        />
        <span className="viewer-corner" aria-hidden="true">
          {mode === "detail" ? "Drag to inspect ↕" : "Public preview / 01"}
        </span>
      </div>
      {mode === "detail" && (
        <label className="viewer-slider">
          Explore screenshot{" "}
          <input
            type="range"
            min="0"
            max="100"
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
          />
        </label>
      )}
      <details
        className="project-details-drawer"
        onToggle={() => ScrollTrigger.refresh()}
      >
        <summary>
          Project notes <span>+</span>
        </summary>
        <div className="drawer-content">
          <p>{project.boundary}</p>
          <p>{project.stack}</p>
          <a href={project.demo} target="_blank" rel="noopener noreferrer">
            {project.demoLabel} ↗
          </a>
        </div>
      </details>
    </div>
  );
}
