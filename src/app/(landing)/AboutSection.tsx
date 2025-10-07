"use client";

import { useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/dist/CustomEase";

import Header from "@/components/Header";
import CTA from "@/components/CTA";

const AboutSection = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const firstParagraph = useRef<HTMLParagraphElement>(null);
  const secondParagraph = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {
        const split = [firstParagraph, secondParagraph].map((el) =>
          SplitText.create(el.current, {
            type: "lines",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => {
              return gsap.from(self.lines, {
                scrollTrigger: {
                  trigger: el.current,
                  start: "top bottom",
                  once: true,
                },
                y: "100%",
                stagger: 0.075,
                ease: "custom",
              });
            },
          }),
        );

        gsap.from(imageRef.current, {
          scrollTrigger: {
            trigger: imageRef.current,
            start: "top bottom",
            once: true,
          },
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.75,
          ease: "custom",
        });
      });
    },
    { scope: aboutRef },
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
          <div className="tablet:col-start-4 tablet:h-[250px] desktop:col-start-7 tablet:block relative col-span-2 hidden h-[115px]">
            <Image
              ref={imageRef}
              src="/images/landing-1.jpg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
