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
      "Mario combines design sensibility with technical precision in a way that's rare to find. He didn't just build our site, he shaped the digital experience around our brand story. The result feels refined, engaging, and truly on point with our identity.",
    variant: "compact",
  },
  {
    username: "Robertus Hudi",
    position: "Co-Founder, Aetheria",
    profileUrl: "/images/profile.png",
    review:
      "Collaborating with Mario was seamless from start to finish. He took the time to understand our vision, then translated it into a website that feels both polished and uniquely ours. His attention to detail, creative instincts, and technical knowledge made the entire process effortless. We now have a digital presence that not only looks stunning but also performs exactly the way our business needs.",
  },
  {
    username: "Carlos De'Aldi Yunatan",
    position: "Founder, C&A Kupang",
    profileUrl: "/images/profile.png",
    review:
      "From the very first call, Mario showed a deep understanding of what we wanted to achieve. He guided us with clarity, offered thoughtful suggestions, and then delivered a website that exceeded expectations in every way. The animations and interactions make the experience unforgettable, and the feedback from our audience has been overwhelmingly positive. I'd recommend him without hesitation.",
  },
  {
    username: "Felicia Santoso",
    position: "Marketing Manager, Livenest",
    profileUrl: "/images/profile.png",
    review:
      "Mario was instrumental in elevating our online presence. He brought structure to our ideas, refined our visual direction, and built a platform that not only looks sleek but functions perfectly. His professionalism and calm, problem-solving attitude made the collaboration a pleasure from start to finish.",
    variant: "compact",
  },
];

type TestimonialCardProps = (typeof TESTIMONIALS)[0] & {
  variant: "default" | "compact";
  idx: number;
};

const TestimonialCard = ({
  username,
  position,
  profileUrl,
  review,
  variant = "default",
  idx,
}: TestimonialCardProps) => {
  if (variant === "compact") {
    return (
      <div className="desktop:col-span-6 desktop:gap-y-14 relative col-span-full grid grid-cols-[auto_1fr] grid-rows-[auto_auto] gap-x-12 gap-y-28 bg-white/5 p-6">
        <Image
          className="h-[42px] min-h-[42px] w-[42px] min-w-[42px]"
          src={profileUrl}
          alt="profile picture"
          width={42}
          height={42}
        />
        <div className="tablet:text-xs flex flex-col gap-y-1 self-end text-[0.625rem]">
          <span>{username}</span>
          <span className="text-white/50">{position}</span>
        </div>
        <span className={`${drukWide.className} text-[4rem] text-white/10`}>
          “
        </span>
        <p className="tablet:text-2xl text-xs !leading-[125%]">
          &quot;{review}&quot;
        </p>

        <div className="absolute top-[90px] left-0 h-[1px] w-full bg-white/10" />
        <div className="absolute top-0 left-[90px] h-full w-[1px] bg-white/10" />
      </div>
    );
  }

  return (
    <div
      className={`tablet:col-span-4 desktop:col-span-3 desktop:gap-y-8 col-span-full grid grid-cols-2 grid-rows-[auto_auto] gap-y-16 bg-white/5 p-6 ${idx === 0 && "tablet:col-start-5 desktop:col-start-4"}`}
    >
      <p className="tablet:text-sm col-span-full text-xs !leading-[125%]">
        &quot;{review}&quot;
      </p>
      <div className="col-span-full flex items-end gap-x-4">
        <Image
          className="h-[42px] min-h-[42px] w-[42px] min-w-[42px]"
          src="/images/profile.png"
          alt="profile picture"
          width={42}
          height={42}
        />
        <div className="tablet:text-xs flex flex-col gap-y-1 self-end text-[0.625rem]">
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

  const addToTotalWorkRefs = (element: HTMLSpanElement | null) => {
    if (element && !totalWorkRef.current.includes(element)) {
      totalWorkRef.current.push(element);
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
            text="more case studies"
            ctaIcon
            className="desktop:flex cta-p-responsive col-span-2 col-end-11 hidden self-end"
          />
          <span
            ref={addToTotalWorkRefs}
            className={`h3-responsive desktop:block col-end-13 hidden self-end justify-self-end ${drukWide.className}`}
          >
            &#91;9&#93;
          </span>

          {/* Testimonials */}
          <div className="custom-grid tablet:gap-y-6 tablet:!gap-x-6 col-span-full !gap-x-4 gap-y-4">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard
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
