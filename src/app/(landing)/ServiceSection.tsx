"use client";

import { useRef } from "react";

import Image from "next/image";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import {
  revealLines,
  revealFade,
  revealWipe,
  revealInstantly,
} from "@/lib/animations";

import Header from "@/components/Header";

import { drukWide } from "@/lib/utils";

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

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (!fontsReady) return;

      // Scoped to this component: useGSAP's `scope` only covers selectors
      // resolved synchronously in its callback, and matchMedia handlers run
      // later. That matters here — `.work-count` exists in both this section
      // and the other one, so an unscoped lookup animates both.
      const mm = gsap.matchMedia(serviceRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([
          ".service-description",
          ".service-heading",
          ".service-image",
        ]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Selectors are safe here: useGSAP's `scope` confines every lookup to
        // this section, so `.service-image` can't reach into another component.
        gsap.utils
          .toArray<HTMLElement>(".service-description")
          .forEach((el) => {
            revealLines(el);
          });

        services.forEach((_, idx) => {
          revealFade(`.service-heading-${idx}`);
          revealWipe(`.service-image-${idx}`);
        });
      });
    },
    { dependencies: [fontsReady], scope: serviceRef, revertOnUpdate: true },
  );

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
                className={`service-heading service-heading-${idx} p-responsive order-1 col-start-1 self-start text-white/50`}
              >
                &#91;0{idx + 1}&#93;
              </span>

              <h3
                className={`service-heading service-heading-${idx} h3-responsive tablet:justify-self-start desktop:col-span-5 tablet:text-start order-2 col-span-3 col-start-2 self-start justify-self-end text-end ${drukWide.className}`}
              >
                {service.serviceTitle.toUpperCase()}
              </h3>

              <div
                className={`service-image service-image-${idx} tablet:order-4 tablet:col-start-5 desktop:col-span-6 desktop:col-start-7 desktop:h-[440px] relative order-3 col-span-4 h-[345px]`}
              >
                <Image
                  src={service.imageSrc}
                  alt={`${service.serviceTitle} service image`}
                  fill
                  loading="lazy"
                  sizes="(max-width: 833px) 100vw, (max-width: 1255px) 50vw, 50vw"
                  className="object-cover"
                />
              </div>

              <p className="service-description p-service-responsive tablet:order-3 tablet:col-span-4 desktop:col-span-6 order-4 col-span-full !leading-[125%] text-white/50">
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
