"use client";

import { useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/CustomEase";

import Header from "@/components/Header";
import CTA from "@/components/CTA";

import { drukWide } from "@/lib/utils";

const featuredWorks = [
  {
    workTitle: "feetstudio",
    workType: "framer",
    workYear: "2025",
    imageSrc: "/images/featured-work-1.jpg",
  },
  {
    workTitle: "aetheria",
    workType: "nextjs",
    workYear: "2024",
    imageSrc: "/images/featured-work-2.jpg",
  },
  {
    workTitle: "c&a",
    workType: "framer",
    workYear: "2025",
    imageSrc: "/images/featured-work-3.jpg",
  },
];

const WorkSection = () => {
  const workRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const totalWorkRef = useRef<HTMLSpanElement[]>([]);

  const addToTotalWorkRefs = (element: HTMLSpanElement | null) => {
    if (element && !totalWorkRef.current.includes(element)) {
      totalWorkRef.current.push(element);
    }
  };

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {
        SplitText.create(headingRef.current, {
          type: "lines",
          autoSplit: true,
          mask: "lines",
          onSplit: (self) => {
            return gsap.from(self.lines, {
              scrollTrigger: {
                trigger: headingRef.current,
                start: "top bottom",
                once: true,
              },
              y: "100%",
              stagger: 0.075,
              ease: "custom",
            });
          },
        });

        totalWorkRef.current.forEach((el) => {
          gsap.from(el, {
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              once: true,
            },
            duration: 0.75,
            opacity: 0,
            ease: "custom",
          });
        });
      });
    },
    { scope: workRef },
  );

  return (
    <section className="relative flex flex-col overflow-clip" ref={workRef}>
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header
          headline="featured-project"
          number={3}
          subText="creative-development"
        />

        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          <h3
            ref={headingRef}
            className={`h3-responsive tablet:col-span-5 desktop:col-span-7 col-span-4 !leading-[125%] uppercase ${drukWide.className}`}
          >
            Frames that speak louder than words
          </h3>

          {/* Mobile & Tablet */}
          <div className="tablet:col-span-3 tablet:col-end-9 tablet:flex-col tablet:justify-self-end desktop:hidden col-span-full flex items-end justify-between">
            <CTA
              text="more case studies"
              ctaIcon
              className="tablet:translate-y-0 cta-p-responsive translate-y-2"
            />
            <span
              ref={addToTotalWorkRefs}
              className={`h3-responsive ${drukWide.className}`}
            >
              &#91;9&#93;
            </span>
          </div>

          {/* Desktop */}
          <CTA
            text="more case studies"
            ctaIcon
            className="desktop:flex cta-p-responsive col-span-2 col-end-11 hidden self-end"
          />
          <span
            ref={addToTotalWorkRefs}
            className={`h3-responsive desktop:block col-end-13 hidden self-end justify-self-end ${drukWide.className}`}
          >
            &#91;9&#93;
          </span>

          <div className="col-span-full flex flex-col gap-y-8">
            {featuredWorks.map((work) => (
              <div
                key={work.workTitle}
                className="relative h-screen w-full overflow-hidden"
              >
                <Image
                  src={work.imageSrc}
                  alt={`${work.workTitle} work thumbnail`}
                  width={1920}
                  height={1080}
                  className="h-[160%] w-[100%] object-cover brightness-50"
                  data-speed="auto"
                />
                <span className="p-responsive absolute-center-y left-4 uppercase">
                  {work.workType}
                </span>
                <p className="p-responsive absolute-center font-bold uppercase">
                  {work.workTitle}
                </p>
                <span className="p-responsive absolute-center-y right-4 uppercase">
                  {work.workYear}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
