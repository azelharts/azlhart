"use client";

import { useRef } from "react";

import Image from "next/image";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { revealLines, revealWipe, revealInstantly } from "@/lib/animations";

import Header from "@/components/Header";
import CTA from "@/components/CTA";

const AboutSection = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const firstParagraph = useRef<HTMLParagraphElement>(null);
  const secondParagraph = useRef<HTMLParagraphElement>(null);

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (!fontsReady) return;

      // Scoped to this component: useGSAP's `scope` only covers selectors
      // resolved synchronously in its callback, and matchMedia handlers run
      // later — without this they'd resolve against the whole document.
      const mm = gsap.matchMedia(aboutRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".about-p", ".about-image"]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealLines(firstParagraph.current);
        revealLines(secondParagraph.current);
        revealWipe(imageRef.current);
      });
    },
    { dependencies: [fontsReady], scope: aboutRef, revertOnUpdate: true },
  );

  return (
    <section className="relative flex flex-col overflow-clip" ref={aboutRef}>
      {/* Container */}
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header
          headline="personal-profile"
          number={1}
          subText="visual-thinker"
        />

        <div className="custom-grid tablet:gap-y-6 desktop:gap-y-16 h-fit gap-y-16 py-16">
          {/* The wipe animates this wrapper, not the <img> — next/image
              overwrites inline styles on the element it renders. */}
          <div
            ref={imageRef}
            className="about-image tablet:col-start-4 tablet:h-[250px] desktop:col-start-7 tablet:block relative col-span-2 hidden h-[115px]"
          >
            <Image
              src="/images/landing-1.jpg"
              alt=""
              fill
              loading="lazy"
              sizes="(max-width: 833px) 50vw, (max-width: 1255px) 25vw, 17vw"
              className="object-cover"
            />
          </div>

          <p ref={firstParagraph} className="about-p col-span-full">
            <span className="tablet:inline-block desktop:w-[400px] hidden w-[100px]" />
            Shaping digital worlds with motion, precision, and bold expression.
            Designing for impact, developing for performance, and crafting
            experiences that feel alive.
          </p>
          <p ref={secondParagraph} className="about-p col-span-full">
            Every project begins with intention from visual identity to
            interaction. We design with purpose, helping brands move with
            confidence and stand out with timeless relevance.
          </p>

          <CTA
            text="more about us"
            className="cta-p-responsive tablet:col-end-7 desktop:col-end-11 col-end-5"
            ctaIcon
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
