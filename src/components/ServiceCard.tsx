"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CustomEase from "gsap/dist/CustomEase";

import { type LucideIcon } from "lucide-react";

interface ServiceCardProps {
  type: string;
  services: string[];
  icon: LucideIcon;
}

const ServiceCard = ({ type, services, icon: Icon }: ServiceCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const subServicesRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  const { contextSafe } = useGSAP(
    () => {
      gsap.registerPlugin(CustomEase);
    },
    { scope: cardRef }
  );

  const hoverIn = contextSafe(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
      },
    });

    tl.to(subServicesRef.current, {
      y: "100%",
      duration: 0.25,
    }).to(
      iconRef.current,
      {
        x: "100%",
        y: "-100%",
        duration: 0.25,
      },
      "-=0.25"
    );
  });

  const hoverOut = contextSafe(() => {
    const tl = gsap.timeline({
      defaults: {
        ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
      },
    });

    tl.to(subServicesRef.current, {
      y: 0,
      duration: 0.25,
    }).to(
      iconRef.current,
      {
        x: "auto",
        y: "auto",
        duration: 0.25,
      },
      "-=0.25"
    );
  });

  return (
    <div
      className="w-full h-[400px] tablet:h-[500px] desktop:h-[600px] flex flex-col justify-between relative border border-foreground/25 even:border-t-0 even:border-b-0 desktop:even:border-t-[1px] desktop:even:border-b-[1px] desktop:even:border-l-0 desktop:even:border-r-0 pt-8 overflow-hidden"
      onMouseEnter={hoverIn}
      onMouseLeave={hoverOut}
      ref={cardRef}
    >
      <h3 className="font-[DrukWide] text-5xl tablet:text-6xl desktop:text-7xl -translate-x-3">
        {type}.
      </h3>
      <div
        className="flex flex-wrap gap-4 p-6 -translate-y-24 tablet:-translate-y-32 desktop:-translate-y-52 z-20"
        ref={subServicesRef}
      >
        {services.map((service) => (
          <span
            key={service}
            className="text-sm tablet:text-base desktop:text-lg flex items-center justify-center px-2 py-1 rounded-[4px] bg-[#ECECEC]"
          >
            &quot;{service.toUpperCase()}&quot;
          </span>
        ))}
      </div>

      <Icon
        size={200}
        color="#2C2C2C"
        className="absolute tablet:w-[360px] tablet:h-[360px] -bottom-14 tablet:-bottom-24 -right-8 opacity-10"
        ref={iconRef}
      />
    </div>
  );
};

export default ServiceCard;
