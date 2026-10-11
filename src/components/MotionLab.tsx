"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import LogoSVG from "./LogoSVG";
import { drukWide } from "@/lib/utils";
const studies = ["Draw", "Resolve", "Reveal"];
const phrases = ["STAY CURIOUS", "MAKE IT MOVE", "AZLHART®"];
export default function MotionLab() {
  const [study, setStudy] = useState(0);
  const [amount, setAmount] = useState(100);
  const [phrase, setPhrase] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const { contextSafe } = useGSAP({ scope: root });
  const replay = contextSafe(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (study === 0) {
      gsap.killTweensOf(path.current);
      gsap.fromTo(
        path.current,
        { drawSVG: "0%" },
        { drawSVG: "100%", duration: 2, ease: "power2.inOut" },
      );
      setAmount(100);
    }
    if (study === 1)
      gsap.to(text.current, {
        duration: 1.1,
        scrambleText: {
          text: phrases[phrase],
          chars: "AZLHART/®0123456789",
          revealDelay: 0.15,
        },
        overwrite: true,
        ease: "none",
      });
    if (study === 2)
      gsap.fromTo(
        ".lab-reveal-top",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: `inset(0 ${100 - amount}% 0 0)`,
          duration: 1.2,
          overwrite: true,
        },
      );
  });
  const changeAmount = contextSafe((value: number) => {
    setAmount(value);
    if (study === 0) {
      gsap.killTweensOf(path.current);
      gsap.set(path.current, { drawSVG: `${value}%` });
    }
    if (study === 2) {
      gsap.killTweensOf(".lab-reveal-top");
      gsap.set(".lab-reveal-top", { clipPath: `inset(0 ${100 - value}% 0 0)` });
    }
  });
  function select(index: number) {
    gsap.killTweensOf([path.current, text.current]);
    setStudy(index);
    setAmount(index === 2 ? 50 : 100);
  }
  return (
    <div className="motion-lab" ref={root}>
      <div className="lab-tabs" role="group" aria-label="Motion experiments">
        {studies.map((name, index) => (
          <button
            type="button"
            key={name}
            onClick={() => select(index)}
            aria-pressed={study === index}
          >
            <span>Experiment / 0{index + 1}</span>
            {name}
            <span>↗</span>
          </button>
        ))}
      </div>
      <div className={`lab-stage lab-stage-${study}`}>
        <span className="lab-coordinate" aria-hidden="true">
          AZL® / {String(study + 1).padStart(3, "0")}
        </span>
        {study === 0 && (
          <div className="lab-logo">
            <LogoSVG refs={[svg, path]} strokeWidth={1.5} />
          </div>
        )}
        {study === 1 && (
          <div className={`lab-type ${drukWide.className}`}>
            <span ref={text} aria-hidden="true">
              {phrases[phrase]}
            </span>
            <span className="sr-only">{phrases[phrase]}</span>
          </div>
        )}
        {study === 2 && (
          <div
            className="lab-reveal"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              const box = e.currentTarget.getBoundingClientRect();
              changeAmount(
                Math.round(((e.clientX - box.left) / box.width) * 100),
              );
            }}
            onPointerMove={(e) => {
              if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
              const box = e.currentTarget.getBoundingClientRect();
              changeAmount(
                Math.max(
                  0,
                  Math.min(
                    100,
                    Math.round(((e.clientX - box.left) / box.width) * 100),
                  ),
                ),
              );
            }}
          >
            <Image
              src="/images/service-3.jpg"
              fill
              alt="Visual study beneath the reveal"
              sizes="90vw"
              draggable={false}
            />
            <div
              className="lab-reveal-top"
              style={{ clipPath: `inset(0 ${100 - amount}% 0 0)` }}
            >
              <Image
                src="/images/landing-1.jpg"
                fill
                alt="Visual study revealed by the slider"
                sizes="90vw"
                draggable={false}
              />
            </div>
            <span
              className="lab-reveal-handle"
              style={{ left: `${amount}%` }}
              aria-hidden="true"
            >
              ↔
            </span>
          </div>
        )}
        <span className="lab-stage-caption" aria-hidden="true">
          {
            [
              "A signature, traced in time.",
              "Order out of interference.",
              "Two frames. Your point of view.",
            ][study]
          }
        </span>
      </div>
      <div className="lab-controls">
        {study === 1 ? (
          <label>
            Choose a phrase
            <select
              value={phrase}
              onChange={(e) => {
                gsap.killTweensOf(text.current);
                setPhrase(Number(e.target.value));
              }}
            >
              {phrases.map((item, i) => (
                <option value={i} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <label>
            {study === 0 ? "Trace amount" : "Reveal position"}
            <input
              type="range"
              min="0"
              max="100"
              value={amount}
              onChange={(e) => changeAmount(Number(e.target.value))}
            />
          </label>
        )}
        <button type="button" className="outline-button" onClick={replay}>
          Replay motion ↻
        </button>
      </div>
      <p className="lab-note">
        {
          [
            "Move the slider to trace the studio mark, or replay its drawing sequence.",
            "Choose a phrase and replay the scramble to see characters resolve into words.",
            "Drag across the image or move the slider to reveal the second composition.",
          ][study]
        }{" "}
        Self-initiated interaction studies, built for this archive.
      </p>
    </div>
  );
}
