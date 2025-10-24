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

const processes = [
  {
    processTitle: "discovery",
    processDescription:
      "We dive deep into your brand, goals, and audience to uncover insights that guide meaningful decisions. Every great solution starts with asking the right questions.",
    processImage: [
      { processImageSrc: "/images/process-1.avif", subtitle: "Curiosity" },
    ],
  },
];

const ProcessSection = () => {
  const processRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {});
    },
    { scope: processRef },
  );

  return (
    <section
      className="sticky top-0 flex h-[100vh] flex-col border border-green-500"
      ref={processRef}
    >
      {/* Container */}
      <div className="max-w-container px-container desktop:!pb-0 relative z-10 mx-auto h-full w-full">
        {/* <Header
          headline="creative-process"
          number={4}
          subText="story-telling"
        /> */}

        <div className="custom-grid desktop:grid-rows-[auto_auto_autopx] h-full gap-x-4 gap-y-12 py-16">
          <span className="p-responsive tablet:col-start-3 desktop:col-start-5 col-start-1 text-white/50">
            &#91;01&#93;
          </span>

          <h3
            className={`h3-responsive tablet:col-end-9 tablet:justify-self-start tablet:col-span-4 desktop:col-end-auto desktop:col-start-7 col-span-3 col-end-5 justify-self-end ${drukWide.className}`}
          >
            {"discovery.".toUpperCase()}
          </h3>

          <div className="tablet:col-span-6 tablet:col-start-3 desktop:col-start-1 desktop:translate-y-[380px] col-span-4 flex justify-between">
            {new Array(20).fill(null).map((_, idx) => (
              <div
                key={idx}
                className="tablet-[h-[30px]] h-5 w-[2px] bg-white/25"
              />
            ))}
          </div>

          <div className="desktop:block col-span-6 hidden" />

          <div className="tablet:col-span-5 desktop:col-span-3 desktop:-translate-y-12 relative col-span-4 flex h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] relative h-[160px] w-full">
              <Image
                src="/images/process-1.avif"
                fill
                alt=""
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <span className="text-sm text-white capitalize">curiosity</span>
          </div>

          <div className="tablet:flex desktop:-translate-y-12 relative col-span-3 hidden h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] relative h-[160px] w-full">
              <Image
                src="/images/process-1.avif"
                fill
                alt=""
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <span className="text-sm text-white capitalize">curiosity</span>
          </div>

          <div className="desktop:flex desktop:col-span-6 desktop:-translate-y-12 relative col-span-3 hidden h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] desktop:h-[400px] relative h-[160px] w-full">
              <Image
                src="/images/process-1.avif"
                fill
                alt=""
                objectFit="cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>

          <p className="p-service-responsive desktop:!text-2xl tablet:col-span-7 desktop:col-span-8 col-span-4 !leading-[125%] text-white/50">
            We dive deep into your brand, goals, and audience to uncover
            insights that guide meaningful decisions. Every great solution
            starts with asking the right questions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
