"use client";

import { useRef } from "react";

import Image from "next/image";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import {
  revealLines,
  revealFade,
  revealBatch,
  revealInstantly,
} from "@/lib/animations";

import Header from "@/components/Header";
import CTA from "@/components/CTA";
import { drukWide } from "@/lib/utils";

const TESTIMONIALS = [
  {
    username: "Vanessa Wongso",
    position: "Founder, FeetStudio",
    profileUrl: "/images/profile.png",
    review:
      "Working with Mario has been such a great experience! They're super professional, creative, and really know how to bring ideas to life. Our website looks amazing thanks to his incredible work.",
  },
  {
    username: "Ben Josiah",
    position: "Founder, FeetStudio",
    profileUrl: "/images/profile.png",
    review:
      "Mario blends design and development perfectly. He turned our brand story into a refined and engaging digital experience that feels truly authentic.",
    variant: "compact",
  },
  {
    username: "Robertus Hudi",
    position: "Co-Founder, Aetheria",
    profileUrl: "/images/profile.png",
    review:
      "Mario quickly understood our vision and built a polished, unique website that fits us perfectly. His attention to detail made the process effortless.",
  },
  {
    username: "Carlos De'Aldi Yunatan",
    position: "Founder, C&A Kupang",
    profileUrl: "/images/profile.png",
    review:
      "Mario delivered beyond expectations. His clear guidance and thoughtful touches made our website stand out our audience loves it.",
  },
  {
    username: "Felicia Santoso",
    position: "Marketing Manager, Livenest",
    profileUrl: "/images/profile.png",
    review:
      "Mario helped shape our ideas into a sleek, functional website. His professionalism and problem-solving made everything smooth and enjoyable.",
    variant: "compact",
  },
];

type TestimonialCardProps = (typeof TESTIMONIALS)[0] & {
  variant: "default" | "compact";
  idx: number;
};

const TestimonialCard = ({
  username,
  position,
  profileUrl,
  review,
  variant = "default",
  idx,
}: TestimonialCardProps) => {
  const avatar = (
    <Image
      className="tablet:h-[68px] tablet:w-[68px] h-[42px] min-h-[42px] w-[42px] min-w-[42px]"
      src={profileUrl}
      alt=""
      width={68}
      height={68}
      loading="lazy"
    />
  );

  if (variant === "compact") {
    return (
      <div className="testimonial-card desktop:col-span-6 relative col-span-full grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-24 gap-y-28 bg-white/5 p-6">
        {avatar}
        <div className="tablet:text-xs desktop:text-sm desktop:gap-y-2 flex flex-col gap-y-1 self-end text-[0.625rem]">
          <span>{username}</span>
          <span className="text-white/50">{position}</span>
        </div>
        <span className={`${drukWide.className} text-[4rem] text-white/10`}>
          “
        </span>
        <p className="tablet:text-2xl text-xs !leading-[125%]">
          &quot;{review}&quot;
        </p>

        <div className="tablet:top-[120px] absolute top-[90px] left-0 h-[1px] w-full bg-white/10" />
        <div className="tablet:left-[120px] absolute top-0 left-[90px] h-full w-[1px] bg-white/10" />
      </div>
    );
  }

  return (
    <div
      className={`testimonial-card tablet:col-span-4 desktop:col-span-3 col-span-full grid grid-cols-2 grid-rows-[auto_auto] gap-y-16 bg-white/5 p-6 ${idx === 0 && "tablet:col-start-5 desktop:col-start-4"} ${idx === 3 && "desktop:order-last"}`}
    >
      <p className="tablet:text-sm desktop:text-base col-span-full text-xs !leading-[125%]">
        &quot;{review}&quot;
      </p>
      <div className="col-span-full flex items-end gap-x-4">
        {avatar}
        <div className="tablet:text-xs desktop:text-sm desktop:gap-y-2 flex flex-col gap-y-1 self-end text-[0.625rem]">
          <span>{username}</span>
          <span className="text-white/50">{position}</span>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (!fontsReady) return;

      // Scoped to this component: useGSAP's `scope` only covers selectors
      // resolved synchronously in its callback, and matchMedia handlers run
      // later. That matters here — `.work-count` exists in both this section
      // and the other one, so an unscoped lookup animates both.
      const mm = gsap.matchMedia(containerRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".testimonial-card", ".work-count"]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealLines(headingRef.current);
        revealFade(".work-count");
        // Batched: the cards sit in a grid, so several cross the threshold at
        // once. One coalesced tween beats five independent ScrollTriggers.
        revealBatch(".testimonial-card");
      });
    },
    { dependencies: [fontsReady], scope: containerRef, revertOnUpdate: true },
  );

  return (
    <section
      className="relative flex flex-col overflow-clip"
      ref={containerRef}
    >
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="testimonials" number={3} subText="real-feedback" />

        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          <h3
            ref={headingRef}
            className={`h3-responsive tablet:col-span-5 desktop:col-span-7 col-span-4 !leading-[125%] uppercase ${drukWide.className}`}
          >
            Real results, our happy customers
          </h3>

          {/* Mobile & Tablet */}
          <div className="tablet:col-span-3 tablet:col-end-9 tablet:flex-col tablet:justify-self-end desktop:hidden col-span-full flex items-end justify-between">
            <CTA
              text="get in touch"
              ctaIcon
              className="tablet:translate-y-0 cta-p-responsive translate-y-2"
            />
            <span className={`work-count h3-responsive ${drukWide.className}`}>
              &#91;5&#93;
            </span>
          </div>

          {/* Desktop */}
          <CTA
            text="get in touch"
            ctaIcon
            className="desktop:flex cta-p-responsive col-span-2 col-end-11 hidden self-end"
          />
          <span
            className={`work-count h3-responsive desktop:block col-end-13 hidden self-end justify-self-end ${drukWide.className}`}
          >
            &#91;5&#93;
          </span>

          {/* Testimonials */}
          <div className="custom-grid col-span-full !gap-x-4 gap-y-4">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard
                key={testimonial.username}
                username={testimonial.username}
                profileUrl={testimonial.profileUrl}
                position={testimonial.position}
                review={testimonial.review}
                variant={testimonial.variant ? "compact" : "default"}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
