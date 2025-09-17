"use client";
import { useRef } from "react";

import WorkCard from "@/components/WorkCard";
import CTAButton from "@/components/CTAButton";

const featuredWorks = [
  {
    title: "FeetStudio",
    subtitle: "Creative Story Telling Agency",
    videoSrc: "/videos/Ocean Wave.mp4",
    logo: "/images/feetstudio logo - white.png",
    service: "development",
  },
  {
    title: "Aetheria",
    subtitle: "Start Your Journey & Discover Peace",
    service: "desgin & development",
    imageSrc: "/images/aetheria.png",
  },
  {
    title: "C&A",
    subtitle: "Kupang MSMEs Center  ",
    service: "desgin & development",
    imageSrc: "/images/C&A.png",
  },
];

const WorkSection = () => {
  const workRef = useRef<HTMLElement>(null);
  return (
    <section className="h-fit hidden flex-col sub-sections" ref={workRef}>
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid gap-y-8">
          {/* Header */}
          <div className="max-w-container flex flex-col desktop:flex-row desktop:justify-between desktop:items-end font-[DrukWide] col-span-full gap-y-8">
            <h2 className="section-sub-heading self-start desktop:self-auto desktop:max-w-[75%]">
              Brands we&apos;ve worked with.
            </h2>
            <blockquote className="section-quote self-end desktop:self-auto">
              &quot;FEATURED WORK&quot;
            </blockquote>
          </div>

          {/* Work Cards - Mobile*/}
          <div className="flex flex-col gap-y-12 col-span-full desktop:hidden desktop:invisible">
            {featuredWorks.map((work) => (
              <WorkCard
                key={work.title}
                title={work.title}
                subtitle={work.subtitle}
                logo={work.logo}
                service={work.service}
                videoSrc={work.videoSrc}
                imageSrc={work.imageSrc}
                imageHeight={600}
              />
            ))}
          </div>

          <h3 className="section-sub-heading col-span-full text-end mt-4 desktop:hidden">
            SEE MORE <br />
            TABS
          </h3>

          <CTAButton
            href="/works"
            text="See All Work"
            className="col-span-3 col-start-1 tablet:col-start-2 desktop:hidden"
          />

          <span className="section-sub-heading col-end-5 tablet:col-start-6 tablet:col-end-auto  justify-self-end desktop:hidden">
            &quot;3&quot;
          </span>

          {/* Work Cards - Desktop */}
          <div className="hidden desktop:grid grid-cols-12 auto-rows-max gap-x-9 gap-y-16 col-span-full mt-24">
            <WorkCard
              videoSrc="/videos/Ocean Wave.mp4"
              logo="/images/feetstudio logo - white.png"
              className="col-span-9"
              imageHeight={690}
            />
            <WorkCard
              variant="imageOnly"
              imageSrc="/images/Social Preview.png"
              className="col-span-3"
              imageHeight={690}
            />

            <WorkCard
              imageSrc="/images/aetheria.png"
              className="col-span-4"
              imageHeight={840}
            />

            <div className="col-span-8 flex flex-col justify-between">
              <WorkCard imageSrc="/images/C&A.png" imageHeight={545} />
              <h3 className="section-sub-heading col-span-full text-end">
                SEE MORE <br />
                TABS
              </h3>
            </div>

            <CTAButton
              href="/works"
              text="See All Work"
              className="col-span-3 col-start-1 tablet:col-start-2 desktop:col-start-5 mt-24"
            />

            <span className="section-sub-heading col-end-5 tablet:col-start-6 tablet:col-end-auto  desktop:col-start-10 justify-self-end desktop:justify-self-start mt-24">
              &quot;3&quot;
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
