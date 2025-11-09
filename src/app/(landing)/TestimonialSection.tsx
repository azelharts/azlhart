"use client";

import { useRef } from "react";

import Image from "next/image";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import SplitText from "gsap/dist/SplitText";

import Header from "@/components/Header";

import CTA from "@/components/CTA";
import { drukWide } from "@/lib/utils";

const TESTIMONIALS = [
  {
    username: "Vanessa Wongso",
    position: "Founder, FeetStudio",
    profileUrl: "/images/profile.png",
    review:
      "Working with Mario has been such a great experience! They're super professional, creative, and really know how to bring ideas to life. Our website looks amazing thanks to his incredible work.",
  },
  {
    username: "Ben Josiah",
    position: "Founder, FeetStudio",
    profileUrl: "/images/profile.png",
    review:
      "Mario blends design and development perfectly. He turned our brand story into a refined and engaging digital experience that feels truly authentic.",
    variant: "compact",
  },
  {
    username: "Robertus Hudi",
    position: "Co-Founder, Aetheria",
    profileUrl: "/images/profile.png",
    review:
      "Mario quickly understood our vision and built a polished, unique website that fits us perfectly. His attention to detail made the process effortless.",
  },
  {
    username: "Carlos De'Aldi Yunatan",
    position: "Founder, C&A Kupang",
    profileUrl: "/images/profile.png",
    review:
      "Mario delivered beyond expectations. His clear guidance and thoughtful touches made our website stand out our audience loves it.",
  },
  {
    username: "Felicia Santoso",
    position: "Marketing Manager, Livenest",
    profileUrl: "/images/profile.png",
    review:
      "Mario helped shape our ideas into a sleek, functional website. His professionalism and problem-solving made everything smooth and enjoyable.",
    variant: "compact",
  },
];

type TestimonialCardProps = (typeof TESTIMONIALS)[0] & {
  ref: (element: HTMLDivElement | null) => void;
  variant: "default" | "compact";
  idx: number;
};

const TestimonialCard = ({
  ref,
  username,
  position,
  profileUrl,
  review,
  variant = "default",
  idx,
}: TestimonialCardProps) => {
  if (variant === "compact") {
    return (
      <div
        ref={ref}
        className={`desktop:col-span-6 relative col-span-full grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-24 gap-y-28 bg-white/5 p-6`}
      >
        <Image
          className="tablet:h-[68px] tablet:w-[68px] h-[42px] min-h-[42px] w-[42px] min-w-[42px]"
          src={profileUrl}
          alt="profile picture"
          width={42}
          height={42}
        />
        <div className="tablet:text-xs desktop:text-sm desktop:gap-y-2 flex flex-col gap-y-1 self-end text-[0.625rem]">
          <span>{username}</span>
          <span className="text-white/50">{position}</span>
        </div>
        <span className={`${drukWide.className} text-[4rem] text-white/10`}>
          “
        </span>
        <p className="tablet:text-2xl text-xs !leading-[125%]">
          &quot;{review}&quot;
        </p>

        <div className="tablet:top-[120px] absolute top-[90px] left-0 h-[1px] w-full bg-white/10" />
        <div className="tablet:left-[120px] absolute top-0 left-[90px] h-full w-[1px] bg-white/10" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`tablet:col-span-4 desktop:col-span-3 col-span-full grid grid-cols-2 grid-rows-[auto_auto] gap-y-16 bg-white/5 p-6 ${idx === 0 && "tablet:col-start-5 desktop:col-start-4"} ${idx === 3 && "desktop:order-last"}`}
    >
      <p className="tablet:text-sm desktop:text-base col-span-full text-xs !leading-[125%]">
        &quot;{review}&quot;
      </p>
      <div className="col-span-full flex items-end gap-x-4">
        <Image
          className="tablet:h-[68px] tablet:w-[68px] h-[42px] min-h-[42px] w-[42px] min-w-[42px]"
          src="/images/profile.png"
          alt="profile picture"
          width={42}
          height={42}
        />
        <div className="tablet:text-xs desktop:text-sm desktop:gap-y-2 flex flex-col gap-y-1 self-end text-[0.625rem]">
          <span>{username}</span>
          <span className="text-white/50">{position}</span>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const totalWorkRef = useRef<HTMLSpanElement[]>([]);
  const testimonialRef = useRef<HTMLDivElement[]>([]);

  const addToTotalWorkRefs = (element: HTMLSpanElement | null) => {
    if (element && !totalWorkRef.current.includes(element)) {
      totalWorkRef.current.push(element);
    }
  };

  const addToTestimonialRefs = (element: HTMLDivElement | null) => {
    if (element && !testimonialRef.current.includes(element)) {
      testimonialRef.current.push(element);
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

        testimonialRef.current.forEach((el) => {
          gsap.from(el, {
            scrollTrigger: el,
            duration: 0.75,
            opacity: 0,
            ease: "custom",
          });
        });
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      className="relative flex flex-col overflow-clip"
      ref={containerRef}
    >
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="testimonials" number={3} subText="real-feedback" />

        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          <h3
            ref={headingRef}
            className={`h3-responsive tablet:col-span-5 desktop:col-span-7 col-span-4 !leading-[125%] uppercase ${drukWide.className}`}
          >
            Real results, our happy customers
          </h3>

          {/* Mobile & Tablet */}
          <div className="tablet:col-span-3 tablet:col-end-9 tablet:flex-col tablet:justify-self-end desktop:hidden col-span-full flex items-end justify-between">
            <CTA
              text="get in touch"
              ctaIcon
              className="tablet:translate-y-0 cta-p-responsive translate-y-2"
            />
            <span
              ref={addToTotalWorkRefs}
              className={`h3-responsive ${drukWide.className}`}
            >
              &#91;5&#93;
            </span>
          </div>

          {/* Desktop */}
          <CTA
            text="get in touch"
            ctaIcon
            className="desktop:flex cta-p-responsive col-span-2 col-end-11 hidden self-end"
          />
          <span
            ref={addToTotalWorkRefs}
            className={`h3-responsive desktop:block col-end-13 hidden self-end justify-self-end ${drukWide.className}`}
          >
            &#91;5&#93;
          </span>

          {/* Testimonials */}
          <div className="custom-grid col-span-full !gap-x-4 gap-y-4">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard
                ref={addToTestimonialRefs}
                key={idx}
                username={testimonial.username}
                profileUrl={testimonial.profileUrl}
                position={testimonial.position}
                review={testimonial.review}
                variant={testimonial.variant ? "compact" : "default"}
                idx={idx}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
