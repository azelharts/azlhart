"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { flushSync } from "react-dom";
import { projects } from "@/lib/content";
import { gsap, useGSAP, Flip, ScrollTrigger } from "@/lib/gsap";
import TransitionLink from "./TransitionLink";

export default function ProjectGrid() {
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [view, setView] = useState<"gallery" | "index">("gallery");
  useEffect(() => {
    try {
      if (sessionStorage.getItem(`azl-work-view:${pathname}`) === "index")
        setView("index");
    } catch {}
  }, [pathname]);
  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>(".project-image").forEach((image) => {
          gsap.from(image, {
            clipPath: "inset(12% 0 12% 0)",
            y: 30,
            duration: 1,
            scrollTrigger: { trigger: image, start: "top 95%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  const changeView = contextSafe((next: "gallery" | "index") => {
    if (next === view || !root.current) return;
    try {
      sessionStorage.setItem(`azl-work-view:${pathname}`, next);
    } catch {}
    const cards = root.current.querySelectorAll(".project-card");
    gsap.killTweensOf(cards);
    const state = Flip.getState(cards);
    flushSync(() => setView(next));
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        stagger: 0.035,
        onComplete: () => ScrollTrigger.refresh(),
      });
    else ScrollTrigger.refresh();
  });
  return (
    <div ref={root} className="work-explorer">
      <div className="explorer-toolbar">
        <span className="eyebrow">Selected projects / 0{projects.length}</span>
        <div role="group" aria-label="Project view">
          <button
            type="button"
            aria-pressed={view === "gallery"}
            onClick={() => changeView("gallery")}
          >
            Gallery <span>▦</span>
          </button>
          <button
            type="button"
            aria-pressed={view === "index"}
            onClick={() => changeView("index")}
          >
            Index <span>☰</span>
          </button>
        </div>
      </div>
      <div
        className={`project-grid ${view === "index" ? "project-index" : ""}`}
      >
        {projects.map((project, index) => (
          <TransitionLink
            className="project-card"
            key={project.slug}
            href={`/works/${project.slug}`}
          >
            <div
              className={`project-image project-screen ${project.slug === "aetheria" ? "mobile-screen" : ""}`}
              style={{ viewTransitionName: `project-${project.slug}` }}
            >
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                sizes={
                  view === "index" ? "180px" : "(max-width: 700px) 100vw, 50vw"
                }
              />
              <span className="project-open" aria-hidden="true">
                Explore project ↗
              </span>
              <span className="project-index-number" aria-hidden="true">
                0{index + 1}
              </span>
            </div>
            <div className="project-information">
              <div className="project-caption">
                <h2>{project.name}</h2>
                <span>
                  {project.platform} · {project.year} ↗
                </span>
              </div>
              <p className="project-category">{project.category}</p>
              <p className="project-summary">{project.summary}</p>
            </div>
          </TransitionLink>
        ))}
      </div>
    </div>
  );
}
