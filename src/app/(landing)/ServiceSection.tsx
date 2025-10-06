"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/CustomEase";

import Header from "@/components/Header";

import { drukWide } from "@/lib/utils";
import Image from "next/image";

const services = [
  {
    serviceTitle: "web-design",
    serviceDescription:
      "We guide every visual decision from start to finish, ensuring clarity, emotion, and impact across every touchpoint.",
    imageSrc: "/images/service-1.jpg",
  },
  {
    serviceTitle: "framer-sites",
    serviceDescription:
      "Design meets execution with real-time, scalable websites — all crafted natively inside Framer for speed and precision.",
    imageSrc: "/images/service-2.jpg",
  },
  {
    serviceTitle: "web-apps",
    serviceDescription:
      "We build dynamic, scalable web apps with sleek design and robust engineering — made with Next.js for SEO & Performance.",
    imageSrc: "/images/service-3.jpg",
  },
];

const ServiceSection = () => {
  const serviceRef = useRef<HTMLElement>(null);
  const serviceNumberAndTitleRefs = useRef<
    (HTMLSpanElement | HTMLHeadingElement)[]
  >([]);
  const serviceDescriptionRefs = useRef<HTMLParagraphElement[]>([]);
  const serviceImageRefs = useRef<HTMLDivElement[]>([]);

  // Generic helper to add refs to arrays
  const addToRefs = <T extends HTMLElement>(
    refsArray: React.MutableRefObject<T[]>,
  ) => {
    return (el: T | null) => {
      if (el && !refsArray.current.includes(el)) {
        refsArray.current.push(el);
      }
    };
  };

  // Reusable animation config
  const scrollTriggerConfig = {
    start: "top bottom",
    once: true,
  };

  useGSAP(() => {
    gsap.registerPlugin(SplitText, CustomEase);
    CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1");

    document.fonts.ready.then(() => {
      // Animate descriptions with SplitText
      serviceDescriptionRefs.current.forEach((el) => {
        SplitText.create(el, {
          type: "lines",
          autoSplit: true,
          mask: "lines",
          onSplit: (self) => {
            gsap.from(self.lines, {
              scrollTrigger: {
                trigger: el,
                ...scrollTriggerConfig,
              },
              y: "100%",
              stagger: 0.075,
              ease: "custom",
            });
          },
        });
      });

      // Animate number and title pairs
      for (let i = 0; i < serviceNumberAndTitleRefs.current.length; i += 2) {
        const numberAndTitle = [
          serviceNumberAndTitleRefs.current[i],
          serviceNumberAndTitleRefs.current[i + 1],
        ];

        gsap.from(numberAndTitle, {
          scrollTrigger: {
            trigger: numberAndTitle[0],
            ...scrollTriggerConfig,
          },
          duration: 0.75,
          opacity: 0,
          ease: "custom",
        });
      }

      // Animate images with clip-path
      serviceImageRefs.current.forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            ...scrollTriggerConfig,
          },
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.75,
          ease: "custom",
        });
      });
    });
  });

  return (
    <section className="relative flex flex-col overflow-clip" ref={serviceRef}>
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="capabilites" number={2} subText="digital-execution" />

        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          {services.map((service, idx) => (
            <div
              key={service.serviceTitle}
              className="custom-grid tablet:gap-y-12 col-span-full gap-y-8"
            >
              <span
                ref={addToRefs(serviceNumberAndTitleRefs)}
                className="p-responsive order-1 col-start-1 self-start text-white/50"
              >
                &#91;0{idx + 1}&#93;
              </span>

              <h3
                ref={addToRefs(serviceNumberAndTitleRefs)}
                className={`h3-responsive tablet:justify-self-start desktop:col-span-5 tablet:text-start order-2 col-span-3 col-start-2 self-start justify-self-end text-end ${drukWide.className}`}
              >
                {service.serviceTitle.toUpperCase()}
              </h3>

              <div
                ref={addToRefs(serviceImageRefs)}
                className="tablet:order-4 tablet:col-start-5 desktop:col-span-6 desktop:col-start-7 desktop:h-[440px] relative order-3 col-span-4 h-[345px]"
              >
                <Image
                  src={service.imageSrc}
                  alt={`${service.serviceTitle} service image`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <p
                ref={addToRefs(serviceDescriptionRefs)}
                className="p-service-responsive tablet:order-3 tablet:col-span-4 desktop:col-span-6 order-4 col-span-full !leading-[125%] text-white/50"
              >
                <span className="tablet:inline-block desktop:w-[100px] hidden w-[50px]" />
                {service.serviceDescription}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
