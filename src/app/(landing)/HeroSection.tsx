"use client";
import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, SplitText } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { drukWide } from "@/lib/utils";
import LogoSVG from "@/components/LogoSVG";
import ScrambleText from "@/components/ScrambleText";
import BackgroundVideo from "@/components/BackgroundVideo";

export default function HeroSection() {
  const root = useRef<HTMLElement>(null);
  const logo = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const intro = useRef<gsap.core.Timeline | null>(null);
  const ready = useFontsReady();
  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const split = SplitText.create(".hero-statement, .hero-name", {
          type: "lines",
          mask: "lines",
        });
        let returning = false;
        try {
          returning = sessionStorage.getItem("azl-intro") === "seen";
          sessionStorage.setItem("azl-intro", "seen");
        } catch {}
        gsap.set(path.current, { strokeWidth: 6 });
        intro.current = gsap
          .timeline()
          .from(path.current, {
            drawSVG: "0%",
            duration: returning ? 0.6 : 2.2,
            ease: "power2.inOut",
          })
          .fromTo(
            ".hero-mark",
            { scale: 0.16, opacity: 1 },
            { scale: 1, opacity: 0.5, duration: 1.3 },
            "-=0.2",
          )
          .to(path.current, { strokeWidth: 1, duration: 1.3 }, "<")
          .from(".hero-film", { opacity: 0, duration: 1.4 }, "<")
          .from(
            split.lines,
            { yPercent: 110, duration: 1, stagger: 0.12 },
            "-=0.8",
          )
          .from(
            ".hero-meta, .hero-bottomline",
            { y: 16, opacity: 0, duration: 0.8, stagger: 0.1 },
            "-=0.8",
          );
        return () => {
          split.revert();
          intro.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );
  return (
    <section className="original-hero" ref={root}>
      <div className="hero-film">
        <BackgroundVideo
          src="/videos/hero-compressed.mp4"
          poster="/images/hero-thumbnail.webp"
          width={1920}
          height={1080}
          className="hero-film-video"
        />
      </div>
      <div className="hero-mark" aria-hidden="true">
        <LogoSVG refs={[logo, path]} />
      </div>
      <div className="hero-meta">
        <span>Studio of Mario Daruranto</span>
        <span>
          Designer
          <br />
          Developer
        </span>
        <span>
          Kupang, Indonesia
          <br />
          Available worldwide
        </span>
      </div>
      <h2 className={`hero-statement ${drukWide.className}`}>
        Turning brands
        <br />
        into tabs everyone
        <br />
        keeps open.
      </h2>
      <div className="hero-bottomline">
        <span>Independent / Creative / Studio</span>
        <Link href="/works">
          <ScrambleText text="Explore the work ↗" />
        </Link>
      </div>
      <h1 className={`hero-name ${drukWide.className}`}>azlhart</h1>
      <button
        type="button"
        className="intro-control"
        onClick={() => {
          const tl = intro.current;
          if (tl) {
            if (tl.progress() < 1) tl.progress(1);
            else tl.restart();
          }
        }}
      >
        Skip / replay intro ↻
      </button>
    </section>
  );
}
