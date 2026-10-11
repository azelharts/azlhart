"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
const studies = [
  {
    image: "/images/landing-1.jpg",
    title: "Perspective",
    copy: "Begin with the audience. What should someone understand, feel and do?",
  },
  {
    image: "/images/service-1.jpg",
    title: "Composition",
    copy: "Typography, space and imagery give a brand its own rhythm.",
  },
  {
    image: "/images/service-3.jpg",
    title: "Interaction",
    copy: "Build the behavior with the visual direction. Every response is part of the experience.",
  },
];
export default function StudioStack() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const start = useRef(0);
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".studio-study-image", {
          rotate: -4,
          x: -30,
          opacity: 0,
          duration: 0.7,
        });
        gsap.from(".studio-study-caption", {
          y: 12,
          opacity: 0,
          duration: 0.5,
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );
  const next = () => setActive((n) => (n + 1) % studies.length);
  return (
    <div ref={root} className="studio-study">
      <div
        className="studio-study-stage"
        onPointerDown={(e) => {
          start.current = e.clientX;
        }}
        onPointerUp={(e) => {
          if (Math.abs(e.clientX - start.current) > 45) next();
        }}
      >
        <span className="study-backplate" aria-hidden="true" />
        <div className="studio-study-image" key={active}>
          <Image
            src={studies[active].image}
            alt={`Studio visual study: ${studies[active].title}`}
            fill
            sizes="(max-width: 700px) 90vw, 45vw"
            draggable={false}
          />
        </div>
        <button
          type="button"
          className="study-next"
          onClick={next}
          aria-label="Next studio study"
        >
          ↗
        </button>
      </div>
      <div className="studio-study-caption" aria-live="polite">
        <span className="eyebrow">Visual notes / 0{active + 1}</span>
        <h2>{studies[active].title}</h2>
        <p>{studies[active].copy}</p>
      </div>
      <div className="study-dots" role="group" aria-label="Studio studies">
        {studies.map((study, i) => (
          <button
            type="button"
            key={study.title}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            {study.title}
          </button>
        ))}
      </div>
    </div>
  );
}
