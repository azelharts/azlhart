"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import { process } from "@/lib/content";
import { useStudioScroll } from "@/components/SmoothScroll";
import { drukWide } from "@/lib/utils";

export default function ProcessSection({
  compact = false,
}: {
  compact?: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const scroll = useStudioScroll();
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      if (!compact)
        mm.add(
          "(min-width: 1000px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
          () => {
            trigger.current = ScrollTrigger.create({
              trigger: root.current,
              pin: stage.current,
              start: "top 84px",
              end: "+=220%",
              pinSpacing: true,
              invalidateOnRefresh: true,
              onUpdate: (self) =>
                setActive(Math.min(3, Math.floor(self.progress * 4))),
            });
            return () => {
              trigger.current = null;
            };
          },
        );
      return () => mm.revert();
    },
    { scope: root },
  );
  useGSAP(
    () => {
      const mm = gsap.matchMedia(stage);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          ".process-visual img",
          { clipPath: "inset(100% 0 0 0)", scale: 1.08 },
          {
            clipPath: "inset(0% 0 0 0)",
            scale: 1,
            duration: 0.85,
            stagger: 0.08,
            overwrite: true,
          },
        );
        gsap.from(".process-copy", { y: 24, opacity: 0, duration: 0.65 });
      });
      return () => mm.revert();
    },
    { scope: stage, dependencies: [active], revertOnUpdate: true },
  );
  function select(index: number) {
    const st = trigger.current;
    if (st) {
      const target = st.start + ((index + 0.15) / 4) * (st.end - st.start);
      scroll.scrollTo(target);
    }
    setActive(index);
  }
  return (
    <section
      ref={root}
      className={`motion-process ${compact ? "compact-process" : ""}`}
      aria-label="How we work"
    >
      <div ref={stage} className="process-stage">
        <div className="process-top">
          <span className="eyebrow">[AZL® — 04] / How we work</span>
          <span className="interaction-hint">
            Scroll to explore / select a step
          </span>
        </div>
        <div className="process-tabs" role="group" aria-label="Process steps">
          {process.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-pressed={active === index}
              onClick={() => select(index)}
            >
              <span>0{index + 1}</span>
              {item.title}
            </button>
          ))}
        </div>
        <div className="process-composition">
          <div className="process-visual" key={active}>
            {[1, 2, 3].map((slot) => (
              <div key={slot}>
                <Image
                  src={`/images/process-${active + 1}-${slot}.jpg`}
                  alt=""
                  fill
                  sizes="(max-width: 700px) 80vw, 33vw"
                />
              </div>
            ))}
          </div>
          <div className="process-copy" aria-live="polite">
            <span className="process-number">[0{active + 1}]</span>
            <h2 className={drukWide.className}>{process[active].title}</h2>
            <p>{process[active].description}</p>
          </div>
        </div>
        <div className="process-meter" aria-hidden="true">
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} className={i < (active + 1) * 6 ? "lit" : ""} />
          ))}
        </div>
      </div>
      <div className="reduced-process">
        {process.map((item) => (
          <article key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
