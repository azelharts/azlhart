"use client";

import { RefObject, useRef } from "react";

import Image from "next/image";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/dist/SplitText";

import { drukWide } from "@/lib/utils";

const processes = [
  {
    processNumber: 1,
    processTitle: "discovery",
    processImages: [
      "/images/process-1.avif",
      "/images/process-1.avif",
      "/images/process-1.avif",
    ],
    processDescription:
      "We dive deep into your brand, goals, and audience to uncover insights that guide meaningful decisions. Every great solution starts with asking the right questions.",
  },
];

const ProcessSection = () => {
  const processContainerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {
        const bars = gsap.utils.toArray(".process_progress") as HTMLElement[];
        let scrollFlags = [false, false, false];

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: processContainerRef.current,
            start: "top top",
            end: "+=700%",
            pin: true,
            scrub: true,
            markers: true,
            onUpdate: (self) => {
              // Scroll Down
              if (self.progress >= 0.25 && scrollFlags[0] === false) {
                gsap.to("#process_number_one", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_two", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_one", {
                  duration: 0.75,
                  y: "-100%",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_two", {
                  duration: 0.75,
                  y: 0,
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[0] = true;
              }

              // Scroll Up
              if (self.progress <= 0.25 && scrollFlags[0] === true) {
                gsap.to("#process_number_one", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_two", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_one", {
                  duration: 0.75,
                  y: "0",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_two", {
                  duration: 0.75,
                  y: "100%",
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[0] = false;
              }

              // Scroll Down
              if (self.progress >= 0.5 && scrollFlags[1] === false) {
                gsap.to("#process_number_two", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_three", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_two", {
                  duration: 0.75,
                  y: "-100%",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_three", {
                  duration: 0.75,
                  y: 0,
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[1] = true;
              }

              // Scroll Up
              if (self.progress <= 0.5 && scrollFlags[1] === true) {
                gsap.to("#process_number_two", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_three", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_two", {
                  duration: 0.75,
                  y: "0",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_three", {
                  duration: 0.75,
                  y: "100%",
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[1] = false;
              }

              // Scroll Down
              if (self.progress >= 0.75 && scrollFlags[2] === false) {
                gsap.to("#process_number_three", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_four", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_three", {
                  duration: 0.75,
                  y: "-100%",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_four", {
                  duration: 0.75,
                  y: 0,
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[2] = true;
              }

              // Scroll Up
              if (self.progress <= 0.75 && scrollFlags[2] === true) {
                gsap.to("#process_number_three", {
                  duration: 0.75,
                  opacity: 1,
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_number_four", {
                  duration: 0.75,
                  opacity: 0,
                  ease: "custom",
                  overwrite: true,
                });

                gsap.to("#process_title_three", {
                  duration: 0.75,
                  y: "0",
                  ease: "custom",
                  overwrite: true,
                });
                gsap.to("#process_title_four", {
                  duration: 0.75,
                  y: "100%",
                  ease: "custom",
                  overwrite: true,
                });
                scrollFlags[2] = false;
              }
            },
          },
        });

        bars.forEach((bar, i) => {
          tl.to(
            bar,
            {
              opacity: 1,
              duration: 5, // 5 unit not 5 seconds
            },
            i * 5,
          ); // Position each animation at 0, 5, 10, 15, etc.
        });

        SplitText.create("#process_description_one", {
          type: "lines",
          autoSplit: true,
          mask: "lines",
          onSplit: (self) => {
            gsap.from(self.lines, {
              scrollTrigger: {
                trigger: "#process_description_one",
                start: "top bottom",
                once: true,
              },
              y: "100%",
              stagger: 0.075,
              ease: "custom",
            });
          },
        });

        gsap.from(["#process_number_one", "#process_title_one"], {
          scrollTrigger: "#process_number_one",
          opacity: 0,
          duration: 0.75,
          ease: "custom",
        });

        gsap.from([".process_image"], {
          scrollTrigger: ".process_image",
          clipPath: "inset(0% 0% 100% 0%)",
          stagger: 0.075,
          ease: "custom",
        });
      });
    },
    { scope: processContainerRef },
  );

  return (
    <section
      className="sticky top-0 flex h-[100vh] flex-col border border-green-500"
      ref={processContainerRef}
    >
      {/* Container */}
      <div className="max-w-container px-container desktop:!pb-0 relative z-10 mx-auto h-full w-full">
        <div className="custom-grid desktop:grid-rows-[auto_auto_auto] h-full auto-rows-min gap-x-4 gap-y-12 py-16">
          <div className="tablet:col-start-3 desktop:col-start-5 tablet:h-[32px] desktop:h-[44px] relative col-start-1 h-[22px] border border-green-500">
            <span
              id="process_number_one"
              className="p-responsive absolute top-0 left-0 text-white/50"
            >
              &#91;01&#93;
            </span>
            <span
              id="process_number_two"
              className="p-responsive absolute top-0 left-0 text-white/50 opacity-0"
            >
              &#91;02&#93;
            </span>
            <span
              id="process_number_three"
              className="p-responsive absolute top-0 left-0 text-white/50 opacity-0"
            >
              &#91;03&#93;
            </span>
            <span
              id="process_number_four"
              className="p-responsive absolute top-0 left-0 text-white/50 opacity-0"
            >
              &#91;04&#93;
            </span>
          </div>

          <div className="tablet:col-end-9 tablet:justify-self-start tablet:col-span-4 desktop:col-end-13 desktop:col-start-7 desktop:h-[44px] tablet:h-[32px] relative col-span-3 col-end-5 h-[22px] w-full justify-self-end overflow-hidden border border-green-500">
            <h3
              id="process_title_one"
              className={`h3-responsive tablet:left-0 h3-fade absolute top-0 right-0 ${drukWide.className} z-50`}
            >
              DISCOVER
            </h3>
            <h3
              id="process_title_two"
              className={`h3-responsive tablet:left-0 absolute top-0 right-0 translate-y-full ${drukWide.className} z-40`}
            >
              DESIGN
            </h3>
            <h3
              id="process_title_three"
              className={`h3-responsive tablet:left-0 absolute top-0 right-0 translate-y-full ${drukWide.className} z-40`}
            >
              REVIEW
            </h3>
            <h3
              id="process_title_four"
              className={`h3-responsive tablet:left-0 absolute top-0 right-0 translate-y-full ${drukWide.className} z-40`}
            >
              DELIVER
            </h3>
          </div>

          <div className="tablet:col-span-6 tablet:col-start-3 desktop:col-start-1 desktop:translate-y-[400px] col-span-4 flex justify-between">
            {new Array(20).fill(null).map((_, idx) => (
              <div
                key={idx}
                className="tablet-[h-[30px]] process_progress h-5 w-[2px] bg-white opacity-25"
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
                className="process_image"
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
                className="process_image"
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
                className="process_image"
              />
            </div>
          </div>

          <p
            id="process_description_one"
            className="p-service-responsive desktop:col-start-2 desktop:!text-2xl tablet:col-span-7 desktop:col-span-8 col-span-4 !leading-[125%] text-white/50"
          >
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
