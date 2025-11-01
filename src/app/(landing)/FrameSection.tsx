"use client";

import { useRef } from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/dist/SplitText";

import { drukWide } from "@/lib/utils";

const FrameSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {});
    },
    { scope: containerRef },
  );

  return (
    <section
      className="relative flex flex-col overflow-clip"
      ref={containerRef}
    >
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <div className="custom-grid desktop:gap-y-32 gap-y-16 py-16">
          <div className="col-span-full flex flex-col gap-y-8">
            <div className="tablet:h-[100vh] relative h-[80vh] w-full overflow-hidden">
              <video
                width={1920}
                height={1080}
                loop
                muted
                autoPlay
                playsInline
                className="h-[160%] w-[100%] object-cover brightness-50"
                data-speed="auto"
              >
                <source src="/videos/frame.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <h2
                className={`h3-responsive tablet:max-w-[456px] tablet:bottom-12 desktop:max-w-[656px] tablet:left-6 desktop:left-8 absolute bottom-4 left-4 max-w-[265px] !leading-[125%] uppercase ${drukWide.className}`}
              >
                Every Frame With Meaning
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameSection;
