"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const workCardVariants = cva("flex flex-col", {
  variants: {
    variant: {
      default: "gap-y-4",
      imageOnly: "gap-y-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const descriptionVariants = cva("flex flex-col gap-y-2", {
  variants: {
    variant: {
      default: "flex flex-col desktop:gap-y-2",
      imageOnly: "hidden",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface WorkCardProps extends VariantProps<typeof workCardVariants> {
  title?: string;
  subtitle?: string;
  logo?: string;
  service?: string;
  imageHeight: number;
  videoSrc?: string | undefined;
  imageSrc?: string | undefined;
  className?: string;
}

const WorkCard = ({
  title = "FeetStudio",
  subtitle = "Creative Story Telling Agency",
  logo,
  service = "design & development",
  variant = "default",
  imageHeight,
  videoSrc,
  imageSrc,
  className = "",
}: WorkCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const slideIndicatorRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {}, { scope: cardRef });

  return (
    <div className={cn(workCardVariants({ variant }), className)} ref={cardRef}>
      {/* Image/Video */}
      <div
        className="w-full desktop:h-auto relative rounded-[4px] overflow-hidden"
        style={{ height: imageHeight }}
      >
        {videoSrc && (
          <video
            width="320"
            height="240"
            preload="none"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover mix-blend-exclusion"
          >
            <source src="/videos/Ocean Wave.mp4" type="video/mp4" />
            &quot;Your browser does not support the video tag&quot;
          </video>
        )}

        {imageSrc && (
          <Image
            fill
            alt={`${title} image`}
            src={imageSrc}
            className="w-full h-full object-cover mix-blend-exclusion"
            loading="lazy"
          />
        )}

        {logo && (
          <Image
            src={logo}
            width={321}
            height={210}
            alt=""
            className="absolute-center"
            loading="lazy"
          />
        )}
        <div
          className="absolute-center-x bottom-4 tablet:bottom-8 flex gap-x-1 w-[95%]"
          ref={slideIndicatorRef}
        >
          <div className="relative w-full h-1">
            <div className="rounded-full bg-white/15 w-full h-full" />
            <div className="rounded-full bg-white absolute top-0 left-0 w-[45%] h-full" />
          </div>
          <div className="relative w-full h-1">
            <div className="rounded-full bg-white/15 w-full h-full" />
            <div className="rounded-full bg-white absolute top-0 left-0 w-[0%] h-full" />
          </div>
        </div>
      </div>

      {/* Description - Hidden in imageOnly variant */}
      <div className={cn(descriptionVariants({ variant }))}>
        <div className="flex justify-between">
          <p className="text-sm tablet:text-base desktop:text-lg">{title}</p>
          <p className="text-xs tablet:text-sm desktop:text-base">{service}</p>
        </div>
        <p className="text-xl tablet:text-2xl desktop:text-3xl font-[BricolageGrotesqueBold] max-w-[75%]">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default WorkCard;
