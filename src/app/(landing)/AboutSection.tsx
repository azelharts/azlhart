"use client";

import { useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Header from "@/components/Header";
import { drukWide } from "@/lib/utils";
import CTA from "@/components/CTA";

const AboutSection = () => {
  const aboutRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.registerPlugin();
  });

  return (
    <section className="relative flex flex-col overflow-clip" ref={aboutRef}>
      {/* Container */}
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header
          headline="personal-profile"
          number={1}
          subText="visual-thinker"
        />

        <div className="custom-grid h-fit gap-y-16 py-16">
          <div className="tablet:col-start-4 tablet:h-[250px] desktop:col-start-7 tablet:opacity-100 relative col-span-2 mt-16 h-[115px] opacity-0">
            <Image
              src="/images/landing-1.jpg"
              alt=""
              fill
              className="object-cover"
            />
          </div>

          <p
            className={`tablet:indent-[100px] desktop:indent-[400px] desktop:text-7xl tablet:text-6xl tablet:!leading-[3.875rem] desktop:!leading-[4.75rem] col-span-full text-4xl !leading-[2.625rem] font-semibold`}
          >
            Shaping digital worlds with motion, precision, and bold expression.
            Designing for impact, developing for performance, and crafting
            experiences that feel alive.
          </p>
          <p
            className={`tablet:mt-0 tablet:text-6xl desktop:text-7xl tablet:!leading-[3.875rem] desktop:!leading-[4.75rem] col-span-full text-4xl !leading-[2.625rem] font-semibold`}
          >
            Every project begins with intention from visual identity to
            interaction. We design with purpose, helping brands move with
            confidence and stand out with timeless relevance.
          </p>

          <CTA
            text="more about us"
            className="p-responsive tablet:col-end-7 desktop:col-end-11 col-end-5"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
