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

  useGSAP(() => {
    gsap.registerPlugin(SplitText, CustomEase);

    document.fonts.ready.then(() => {});
  });
  return (
    <section className="relative flex flex-col overflow-clip" ref={serviceRef}>
      {/* Container */}
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="capabilites" number={2} subText="digital-execution" />

        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          {services.map((service, idx) => (
            <div
              key={service.serviceTitle}
              className="custom-grid tablet:gap-y-12 col-span-full gap-y-8"
            >
              <span className="p-responsive order-1 col-start-1 self-start text-white/50">
                &#91;0{idx + 1}&#93;
              </span>
              <h3
                className={`h3-responsive tablet:justify-self-start desktop:col-span-5 order-2 col-span-3 col-start-2 self-start justify-self-end ${drukWide.className}`}
              >
                {service.serviceTitle.toUpperCase()}
              </h3>

              <div className="tablet:order-4 tablet:col-start-5 desktop:col-span-6 desktop:col-start-7 desktop:h-[440px] relative order-3 col-span-4 h-[345px]">
                <Image
                  src={service.imageSrc}
                  alt={`${service.serviceTitle} service image`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <p className="p-service-responsive tablet:order-3 tablet:col-span-4 desktop:col-span-6 order-4 col-span-full !leading-[125%] text-white/50">
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
