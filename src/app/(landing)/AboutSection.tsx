"use client";

import { useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CTAButton from "@/components/CTAButton";

const AboutSection = () => {
  return (
    <section className="h-fit hidden flex-col sub-sections bg-white">
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid">
          <p className="col-span-full text-[2.25rem] tablet:text-5xl desktop:col-start-2 desktop:text-6xl desktop:col-end-11 font-[DrukWide] !leading-[120%] z-20 mix-blend-difference text-white">
            &quot;Shaping digital worlds with motion, precision, and bold
            expression. Designing for impact, developing for performance, and
            crafting experiences that feel alive&quot;
          </p>

          <p className="col-span-3 mt-32 text-sm tablet:text-base desktop:text-xl tablet:col-start-3 tablet:col-end-8 tablet:col-span-5 desktop:col-start-6 desktop:col-end-12 !leading-[120%] z-20 mix-blend-difference text-white">
            We merge creative design with{" "}
            <span className="font-[BricolageGrotesqueBold]">
              technical execution
            </span>{" "}
            , blending motion, clarity, and speed into every build. The result:
            immersive websites and applications that connect with audiences,
            scale with ambition, and leave a lasting impression.
          </p>

          <span className="section-quote self-end desktop:self-auto font-[DrukWide] col-span-2 mt-40 col-end-5 tablet:col-end-9 desktop:col-end-13 desktop:row-start-4 z-20 mix-blend-difference text-white">
            &quot;PHILOSOPHY&quot;
          </span>

          <CTAButton
            text="About us"
            href="/about"
            className="col-end-4 col-span-3 justify-self-end tablet:col-end-auto tablet:col-start-3 desktop:col-start-6 desktop:justify-self-start desktop:row-start-3 mt-16 z-20 mix-blend-difference text-white !border-white/50"
          />

          {/* Backgrounds */}
          <Image
            src="/images/about/about-3.avif"
            width={717}
            height={1024}
            alt=""
            className="rounded-sm absolute right-[20px] tablet:right-[96px] desktop:right-auto desktop:left-9 top-16 w-[95px] h-[165px] tablet:w-[360px] tablet:h-[250px] desktop:w-[456px] desktop:h-[540px] object-cover object-top"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="rounded-sm absolute left-[20px] tablet:left-[128px] desktop:left-auto desktop:right-[138px] top-60 tablet:top-80 desktop:top-[280px] w-[142px] h-[98px] tablet:w-[170px] tablet:h-[216px] desktop:w-[456px] desktop:h-[654px] object-cover"
          >
            <source src="/images/about/about-2.mp4" type="video/mp4" />
            &quot;Your browser does not support the video tag&quot;
          </video>
          <Image
            src="/images/about/about-1.avif"
            width={717}
            height={1024}
            alt=""
            className="rounded-sm absolute left-[108px] tablet:left-auto tablet:right-[75px] desktop:right-auto desktop:left-[412px] top-[480px] tablet:top-[575px] desktop:top-[810px] w-[95px] h-[165px] tablet:w-[274px] tablet:h-[225px] desktop:w-[346px] desktop:h-[280px] object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
