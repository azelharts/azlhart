"use client";

import { useRef } from "react";

import { ArrowUp } from "lucide-react";

import { gsap, useGSAP, ScrollSmoother } from "@/lib/gsap";
import { revealLines } from "@/lib/animations";
import { useFontsReady } from "@/lib/hooks";
import { drukWide } from "@/lib/utils";

import { useContactPanel } from "./ContactPanel";
import CurrentTime from "./CurrentTime";
import DotWordmark from "./DotWordmark";
import ScrambleText from "./ScrambleText";
import TransitionLink from "./TransitionLink";

const SITEMAP = [
  { href: "/", label: "Index" },
  { href: "/about", label: "About" },
  { href: "/works", label: "Works" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fontsReady = useFontsReady();
  const openContact = useContactPanel();

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia(footerRef);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".ft-fade", {
          autoAlpha: 0,
          y: 24,
          stagger: 0.06,
          duration: 0.8,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 85%",
            once: true,
          },
        });
        // The question rises in line by line; scrambling it reflowed the
        // wrapped lines and shifted the whole footer.
        revealLines(headingRef.current);
      });
    },
    { scope: footerRef, dependencies: [fontsReady], revertOnUpdate: true },
  );

  const toTop = () => {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTo(0, true);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="max-w-container px-container mx-auto w-full overflow-hidden"
    >
      <div className="flex flex-col gap-y-16 border-t border-white/25 pt-10">
        {/* Call to action */}
        <div className="custom-grid gap-y-8">
          <h2
            ref={headingRef}
            className={`ft-heading tablet:col-span-6 desktop:col-span-7 tablet:text-5xl desktop:text-6xl col-span-full text-3xl !leading-[105%] uppercase ${drukWide.className}`}
          >
            Got something that has to hold up?
          </h2>
          <div className="ft-fade tablet:col-span-2 tablet:col-end-9 desktop:col-span-3 desktop:col-end-13 tablet:justify-end col-span-full flex items-end">
            <button
              type="button"
              onClick={openContact}
              className="tablet:w-auto tablet:min-w-[240px] flex w-full items-center justify-between border border-white px-5 py-4"
            >
              <ScrambleText text="let's talk" />
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Columns */}
        <div className="custom-grid p-responsive gap-y-10">
          <div className="ft-fade col-span-2 flex flex-col gap-y-4">
            <span className="text-white/40">SITEMAP</span>
            {SITEMAP.map((l) => (
              <TransitionLink key={l.href} href={l.href} className="w-fit">
                <ScrambleText text={l.label} />
              </TransitionLink>
            ))}
          </div>
          <div className="ft-fade col-span-2 flex flex-col gap-y-4">
            <span className="text-white/40">CONTACT</span>
            <a href="mailto:mariodaruranto68@gmail.com" className="w-fit">
              <ScrambleText text="mariodaruranto68@gmail.com" />
            </a>
            <button
              type="button"
              onClick={openContact}
              className="w-fit text-left"
            >
              <ScrambleText text="Open the contact form" />
            </button>
          </div>
          <div className="ft-fade desktop:col-start-7 tablet:col-span-2 col-span-2 flex flex-col gap-y-4">
            <span className="text-white/40">BASED IN</span>
            <span className="font-normal">Kupang, East Nusa Tenggara</span>
            <span className="font-normal text-white/60">
              10.17° S, 123.61° E
            </span>
          </div>
          <div className="ft-fade tablet:col-span-2 desktop:col-end-13 tablet:items-end tablet:text-right col-span-2 flex flex-col gap-y-4">
            <span className="text-white/40">LOCAL TIME</span>
            <span className="flex items-center gap-x-2 font-normal">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />
              <CurrentTime />
            </span>
            <button
              type="button"
              onClick={toTop}
              className="group flex w-fit items-center gap-x-2"
            >
              <ScrambleText text="Back to top" />
              <ArrowUp
                size={14}
                strokeWidth={1.5}
                className="transition-transform duration-300 group-hover:-translate-y-0.5"
              />
            </button>
          </div>
        </div>

        {/* Wordmark, fitted edge to edge */}
        <div className="flex flex-col gap-y-4">
          <DotWordmark />
          <div className="p-responsive flex justify-between border-t border-white/15 py-5 text-white/40">
            <span>&copy; {new Date().getFullYear()} Mario Daruranto</span>
            <span>Kupang, East Nusa Tenggara</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
