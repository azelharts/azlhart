"use client";

import { useRef } from "react";

import Image from "next/image";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/dist/SplitText";

import { drukWide } from "@/lib/utils";

// Constants
const SCROLL_THRESHOLDS = [0.25, 0.5, 0.75];
const ANIMATION_DURATION = 0.75;
const EASE = "custom";
const PROCESSES = [
  {
    id: 1,
    number: "[01]",
    title: "DISCOVER",
    description:
      "We dive deep into your brand, goals, and audience to uncover insights that guide meaningful decisions. Every great solution starts with asking the right questions.",
    images: [
      { src: "/images/process-1-1.jpg", label: "curiosity" },
      { src: "/images/process-1-2.jpg", label: "insight" },
      { src: "/images/process-1-3.jpg", label: null },
    ],
  },
  {
    id: 2,
    number: "[02]",
    title: "DESIGN",
    description:
      "We craft elegant solutions that blend aesthetics with functionality. Our designs are purposeful, user-centered, and built to make an impact.",
    images: [
      { src: "/images/process-2-1.jpg", label: "creativity" },
      { src: "/images/process-2-2.jpg", label: "structure" },
      { src: "/images/process-2-3.jpg", label: null },
    ],
  },
  {
    id: 3,
    number: "[03]",
    title: "REVIEW",
    description:
      "We test, refine, and iterate. Feedback drives improvement, ensuring every detail aligns with your vision and exceeds expectations.",
    images: [
      { src: "/images/process-3-1.jpg", label: "focus" },
      { src: "/images/process-3-2.jpg", label: "refinement" },
      { src: "/images/process-3-3.jpg", label: null },
    ],
  },
  {
    id: 4,
    number: "[04]",
    title: "DELIVER",
    description:
      "We launch your project with confidence and provide ongoing support. Your success is our success, and we're here for the long haul.",
    images: [
      { src: "/images/process-4-1.jpg", label: "excellence" },
      { src: "/images/process-4-2.jpg", label: "growth" },
      { src: "/images/process-4-3.jpg", label: null },
    ],
  },
];

const animateElements = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animations: Array<{ target: string; [key: string]: any }>,
) => {
  animations.forEach(({ target, ...props }) => {
    gsap.to(target, {
      duration: ANIMATION_DURATION,
      ease: EASE,

      ...props,
    });
  });
};

const ProcessSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.registerPlugin(SplitText, CustomEase);
      CustomEase.create(EASE, "M0,0 C0.82,0.08 0.29,1 1,1");

      document.fonts.ready.then(() => {
        const bars = gsap.utils.toArray(".process_progress") as HTMLElement[];
        const scrollFlags = [false, false, false];

        // Main timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "+=700%",
            pin: true,
            scrub: true,
            markers: true,
            onUpdate: (self) => {
              SCROLL_THRESHOLDS.forEach((threshold, index) => {
                const current = index + 1;
                const next = current + 1;

                // Scroll Down
                if (self.progress >= threshold && !scrollFlags[index]) {
                  animateElements([
                    // Numbers
                    { target: `#process_number_${current}`, opacity: 0 },
                    { target: `#process_number_${next}`, opacity: 1 },

                    // Titles
                    { target: `#process_title_${current}`, y: "-100%" },
                    { target: `#process_title_${next}`, y: 0 },

                    // Images
                    {
                      target: `.process_images_${current - 1}`,
                    },
                    {
                      target: `.process_images_${current}`,
                      clipPath: "inset(0% 0% 0% 0%)",
                      stagger: "0.075",
                    },

                    // Image Labels
                    {
                      target: `.process_images_label_${current - 1}`,
                      opacity: 0,
                    },
                    {
                      target: `.process_images_label_${current}`,
                      opacity: 1,
                    },

                    // Descriptions
                    {
                      target: `#process_description_${current}`,
                      opacity: 0,
                      y: "-50px",
                    },
                    {
                      target: `#process_description_${next}`,
                      opacity: 1,
                      y: 0,
                    },
                  ]);
                  scrollFlags[index] = true;
                }

                // Scroll Up
                if (self.progress <= threshold && scrollFlags[index]) {
                  animateElements([
                    // Numbers
                    { target: `#process_number_${current}`, opacity: 1 },
                    { target: `#process_number_${next}`, opacity: 0 },

                    // Titles
                    { target: `#process_title_${current}`, y: 0 },
                    { target: `#process_title_${next}`, y: "100%" },

                    // Images
                    {
                      target: `.process_images_${current}`,
                      clipPath: "inset(0% 0% 100% 0%)",
                      stagger: 0.075,
                    },
                    {
                      target: `.process_images_${next}`,
                    },

                    // Image Labels
                    {
                      target: `.process_images_label_${current - 1}`,
                      opacity: 1,
                    },
                    {
                      target: `.process_images_label_${current}`,
                      opacity: 0,
                    },

                    // Descriptions
                    {
                      target: `#process_description_${current}`,
                      opacity: 1,
                      y: 0,
                    },
                    {
                      target: `#process_description_${next}`,
                      opacity: 0,
                      y: "50px",
                    },
                  ]);
                  scrollFlags[index] = false;
                }
              });
            },
          },
        });

        // Animate progress bars
        bars.forEach((bar, i) => {
          tl.to(bar, { opacity: 1, duration: 5 }, i * 5);
        });

        // Initial animations
        PROCESSES.forEach((process, index) => {
          const isFirst = index === 0;

          // Split text animation for descriptions
          SplitText.create(`#process_description_${process.id}`, {
            type: "lines",
            autoSplit: true,
            mask: "lines",
            onSplit: (self) => {
              gsap.from(self.lines, {
                scrollTrigger: {
                  trigger: `#process_description_${process.id}`,
                  start: "top bottom",
                  once: true,
                },
                y: "100%",
                stagger: 0.075,
                ease: EASE,
              });
            },
          });

          // Initial fade in for first process
          if (isFirst) {
            gsap.from(
              [`#process_number_${process.id}`, `#process_title_${process.id}`],
              {
                scrollTrigger: `#process_number_${process.id}`,
                opacity: 0,
                duration: ANIMATION_DURATION,
                ease: EASE,
              },
            );

            gsap.from(".process_image", {
              scrollTrigger: ".process_image",
              clipPath: "inset(0% 0% 100% 0%)",
              stagger: 0.075,
              ease: EASE,
            });

            gsap.from(".process_images_label_0", {
              scrollTrigger: ".process_images_label_0",
              opacity: 0,
              stagger: 0.075,
              ease: EASE,
            });
          }
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      className="sticky top-0 flex h-[100vh] flex-col"
      ref={containerRef}
    >
      {/* Container */}
      <div className="max-w-container px-container desktop:!pb-0 relative z-10 mx-auto h-full w-full">
        <div className="custom-grid desktop:grid-rows-[auto_auto_auto] h-full gap-x-4 gap-y-12 py-16">
          {/* Process Numbers */}
          <div className="tablet:col-start-3 desktop:col-start-5 tablet:h-[32px] desktop:h-[44px] relative col-start-1 h-[22px] self-center">
            {PROCESSES.map((process, index) => (
              <span
                key={process.id}
                id={`process_number_${process.id}`}
                className={`p-responsive absolute top-0 left-0 text-white/50 ${
                  index > 0 ? "opacity-0" : ""
                }`}
              >
                {process.number}
              </span>
            ))}
          </div>

          {/* Process Titles */}
          <div className="tablet:col-end-9 tablet:justify-self-start tablet:col-span-4 desktop:col-end-13 desktop:col-start-7 desktop:h-[44px] tablet:h-[32px] relative col-span-3 col-end-5 h-[22px] w-full self-center justify-self-end overflow-hidden">
            {PROCESSES.map((process, index) => (
              <h3
                key={process.id}
                id={`process_title_${process.id}`}
                className={`h3-responsive tablet:left-0 absolute top-0 right-0 ${
                  index > 0 && "translate-y-full"
                } ${drukWide.className}`}
              >
                {process.title}
              </h3>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="tablet:col-span-6 tablet:col-start-3 desktop:col-start-1 desktop:row-start-3 desktop:self-end col-span-4 flex justify-between">
            {new Array(20).fill(null).map((_, idx) => (
              <div
                key={idx}
                className="tablet-[h-[30px]] process_progress h-5 w-[2px] bg-white opacity-25"
              />
            ))}
          </div>

          {/* <div className="desktop:block col-span-6 hidden" /> */}

          {/* Image 1 */}
          <div className="tablet:col-span-5 desktop:col-span-3 relative col-span-4 flex h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] relative h-[160px] w-full">
              {PROCESSES.map((process, idx) => (
                <Image
                  key={idx}
                  src={process.images[0].src}
                  fill
                  alt=""
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover ${
                    idx === 0
                      ? "process_image"
                      : idx === 1
                        ? "process_images_1"
                        : idx === 2
                          ? "process_images_2"
                          : "process_images_3"
                  }`}
                  style={idx !== 0 ? { clipPath: "inset(0% 0% 100% 0%)" } : {}}
                />
              ))}
            </div>
            <div className="relative">
              {PROCESSES.map((process, idx) => (
                <span
                  key={idx}
                  className={`absolute top-0 left-0 text-sm text-white capitalize ${
                    idx > 0 ? "opacity-0" : ""
                  } ${
                    idx === 0
                      ? "process_images_label_0"
                      : idx === 1
                        ? "process_images_label_1"
                        : idx === 2
                          ? "process_images_label_2"
                          : "process_images_label_3"
                  }`}
                >
                  {process.images[0].label}
                </span>
              ))}
            </div>
          </div>

          <div className="tablet:flex relative col-span-3 hidden h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] relative h-[160px] w-full">
              {PROCESSES.map((process, idx) => (
                <Image
                  key={idx}
                  src={process.images[1].src}
                  fill
                  alt=""
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover ${
                    idx === 0
                      ? "process_image"
                      : idx === 1
                        ? "process_images_1"
                        : idx === 2
                          ? "process_images_2"
                          : "process_images_3"
                  }`}
                  style={idx !== 0 ? { clipPath: "inset(0% 0% 100% 0%)" } : {}}
                />
              ))}
            </div>
            <div className="relative">
              {PROCESSES.map((process, idx) => (
                <span
                  key={idx}
                  className={`absolute top-0 left-0 text-sm text-white capitalize ${
                    idx > 0 ? "opacity-0" : ""
                  } ${
                    idx === 0
                      ? "process_images_label_0"
                      : idx === 1
                        ? "process_images_label_1"
                        : idx === 2
                          ? "process_images_label_2"
                          : "process_images_label_3"
                  }`}
                >
                  {process.images[1].label}
                </span>
              ))}
            </div>
          </div>

          <div className="desktop:flex desktop:col-span-6 relative col-span-3 hidden h-full flex-col gap-y-4">
            <div className="tablet:h-[300px] desktop:h-[400px] relative h-[160px] w-full">
              {PROCESSES.map((process, idx) => (
                <Image
                  key={idx}
                  src={process.images[2].src}
                  fill
                  alt=""
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover ${
                    idx === 0
                      ? "process_image"
                      : idx === 1
                        ? "process_images_1"
                        : idx === 2
                          ? "process_images_2"
                          : "process_images_3"
                  }`}
                  style={idx !== 0 ? { clipPath: "inset(0% 0% 100% 0%)" } : {}}
                />
              ))}
            </div>
          </div>

          <p
            id="process_description_one"
            className="p-service-responsive desktop:col-start-7 desktop:!text-2xl tablet:col-span-7 desktop:col-span-6 col-span-4 self-end !leading-[125%] text-white/50"
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
