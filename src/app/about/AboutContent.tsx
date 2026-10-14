"use client";

import { useRef, useState } from "react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { revealInstantly, revealLines } from "@/lib/animations";
import { drukWide } from "@/lib/utils";

import Header from "@/components/Header";
import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

import SittingFigure from "./SittingFigure";

const EXPERIENCE = [
  {
    company: "Rakamin",
    role: "Frontend Engineer",
    years: "2025 / Now",
    period: "Nov 2025 to Present",
    place: "Jakarta",
  },
  {
    company: "Videfly",
    role: "Frontend Engineer",
    years: "2024 / 25",
    period: "Nov 2024 to Feb 2025",
    place: "Jakarta",
  },
  {
    company: "GOVOKASi Indonesia",
    role: "Web Developer",
    years: "2024",
    period: "Oct 2024 to Nov 2024",
    place: "Tangerang",
  },
  {
    company: "Bangkit Academy",
    role: "Cloud Computing Cohort",
    years: "2024",
    period: "Feb 2024 to Jul 2024",
    place: "Top 50 capstone",
  },
];

const LISTS = [
  {
    label: "Recognition",
    items: ["2nd Winner, PwC's Hack A Day (Securing AI), 2023"],
  },
  {
    label: "Certifications",
    items: [
      "Associate Cloud Engineer",
      "Google IT Support Specialization",
      "The Web Developer Bootcamp 2023",
    ],
  },
  {
    label: "Education",
    items: ["B.C.S. Informatics, Universitas Pelita Harapan, 2021 to 2025"],
  },
  {
    label: "Toolkit",
    items: [
      "React, Next.js, Vue, TypeScript",
      "GSAP, WebGL, Tailwind CSS",
      "Figma, Google Cloud",
    ],
  },
];

const AboutContent = () => {
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia(rootRef);
      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".about-fade"]),
      );
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealLines(headingRef.current);
        gsap.from(".about-fade", {
          autoAlpha: 0,
          y: 16,
          duration: 0.75,
          stagger: 0.06,
          delay: 0.3,
        });
      });
    },
    { dependencies: [fontsReady], scope: rootRef, revertOnUpdate: true },
  );

  return (
    <section
      ref={rootRef}
      className="max-w-container px-container mx-auto w-full"
    >
      <div className="desktop:pt-40 tablet:pt-36 flex flex-col gap-y-24 pt-28">
        <Header headline="about" number={2} subText="frontend engineer" />

        {/* Intro: the 8-bit figure on one side, who/what/for whom on the
            other. Under 100 words, so a skim gets all of it. */}
        <div className="custom-grid -mt-12 gap-y-12">
          <div className="about-fade tablet:col-span-4 desktop:col-span-5 tablet:row-start-1 desktop:max-w-[560px] col-span-full row-start-2">
            <SittingFigure />
          </div>
          {/* Top-aligned so name, role and links are all on screen on
              arrival, without scrolling past the figure first. */}
          <div className="tablet:col-span-4 tablet:col-start-5 desktop:col-span-6 desktop:col-start-6 desktop:pt-16 tablet:pt-8 col-span-full flex flex-col justify-start gap-y-8">
            <h1
              ref={headingRef}
              className={`tablet:text-5xl desktop:text-6xl text-[2rem] !leading-[95%] uppercase ${drukWide.className}`}
            >
              Mario Daruranto
            </h1>
            <p className="about-fade tablet:text-2xl text-xl !leading-[145%] font-light">
              Frontend engineer with over a year of shipping web products in
              e-commerce, education, healthcare and HR.
            </p>
            <p className="about-fade p-responsive !leading-[165%] text-white/60">
              I care about fluid motion and interfaces that stay consistent on
              every device, and I&apos;m happiest on the parts of a product that
              must not break. I also trained in cloud computing and deploy what
              I build on Google Cloud.
            </p>
            <div className="about-fade p-responsive flex flex-wrap gap-x-8 gap-y-3">
              <a
                href="https://www.linkedin.com/in/mario-imanuel-daruranto"
                target="_blank"
                rel="noreferrer"
              >
                <ScrambleText text="LinkedIn ↗" />
              </a>
              <a href="mailto:mariodaruranto68@gmail.com">
                <ScrambleText text="Email" />
              </a>
              <TransitionLink href="/works">
                <ScrambleText text="Selected works" />
              </TransitionLink>
            </div>
          </div>
        </div>

        {/* Experience as a timeline: years on the rail, roles beside them. */}
        <div className="custom-grid gap-y-8">
          <span className="article-label about-fade desktop:col-span-2 col-span-full">
            &#91;EXPERIENCE&#93;
          </span>
          <ol
            className="tablet:col-span-8 desktop:col-span-10 col-span-full flex flex-col"
            onMouseLeave={() => setHovered(null)}
          >
            {EXPERIENCE.map((job, i) => {
              const active = hovered === job.company;
              return (
                <li
                  key={job.company}
                  onMouseEnter={() => setHovered(job.company)}
                  className="about-fade tablet:gap-x-10 relative grid grid-cols-[auto_1fr] gap-x-6"
                >
                  {/* The rail: a dot per role, a line down to the next. */}
                  <span className="relative flex w-3 justify-center pt-2">
                    <span
                      className={`size-3 rounded-full border border-white transition-colors duration-300 ${active ? "bg-white" : "bg-[var(--background)]"}`}
                    />
                    {i < EXPERIENCE.length - 1 && (
                      <span className="absolute top-6 bottom-0 w-px bg-white/25" />
                    )}
                  </span>
                  <div className="tablet:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] grid gap-x-10 gap-y-3 pb-12">
                    <span
                      className={`tablet:text-5xl desktop:text-6xl text-3xl !leading-[90%] uppercase transition-opacity duration-300 ${active ? "opacity-100" : "opacity-40"} ${drukWide.className}`}
                    >
                      {job.years}
                    </span>
                    <div className="flex flex-col gap-y-2">
                      <span className="tablet:text-2xl text-lg font-semibold">
                        {job.company}
                      </span>
                      <span className="p-responsive">
                        <ScrambleText
                          text={job.role}
                          active={active}
                          className="font-normal"
                        />
                      </span>
                      <span className="article-label">
                        {job.period} / {job.place}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* The rest, boxed: recognition, certifications, school, tools. */}
        <div className="tablet:grid-cols-2 desktop:grid-cols-4 grid gap-px border border-white/15 bg-white/15">
          {LISTS.map((list) => (
            <div
              key={list.label}
              className="about-fade flex flex-col gap-y-5 bg-[var(--background)] p-6"
            >
              <span className="article-label">
                &#91;{list.label.toUpperCase()}&#93;
              </span>
              <ul className="flex flex-col gap-y-2">
                {list.items.map((item) => (
                  <li
                    key={item}
                    className="p-responsive !leading-[150%] font-normal"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutContent;
