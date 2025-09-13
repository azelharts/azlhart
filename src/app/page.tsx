"use client";

import Link from "next/link";
import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DrawSVGPlugin from "gsap/dist/DrawSVGPlugin";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import CustomEase from "gsap/dist/CustomEase";
import SplitText from "gsap/dist/SplitText";

import LogoSVG from "@/components/LogoSVG";
import RollingText from "@/components/RollingText";

const Home = () => {
  const heroSectionRef = useRef(null);

  useGSAP(() => {
    gsap.registerPlugin(DrawSVGPlugin, SplitText, ScrollTrigger);
    const getInitialDimensions = () => {
      const width = window.innerWidth;
      if (width >= 1256) {
        return {
          width: 235,
          height: 126,
          widthAfter: 1700,
          heightAfter: 915,
          bottom: "-12.5%",
          x: 96,
        };
      } else if (width >= 834) {
        return {
          width: 186,
          height: 100,
          widthAfter: 940,
          heightAfter: 505,
          bottom: "-12.5%",
          x: 64,
        };
      } else {
        return { width: 128, height: 70, bottom: "10%", x: 32 };
      }
    };

    const {
      width: initialWidth,
      height: initialHeight,
      widthAfter,
      heightAfter,
      bottom,
      x,
    } = getInitialDimensions();

    const headingSplit = SplitText.create(".slide-up", {
      type: "lines",
      autoSplit: true,
      mask: "lines",
    });

    gsap.set("#azlhart-logo", {
      position: "absolute",
      left: "50%",
      bottom: "50%",
      xPercent: -50,
      yPercent: -50,
      width: initialWidth,
      height: initialHeight,
    });

    const tl = gsap.timeline();
    tl.from("#logo-path", {
      drawSVG: 0,
      duration: 3.75,
      ease: "power3.inOut",
    })
      .to("#azlhart-logo", {
        duration: 1.5,
        ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        width: widthAfter ? widthAfter : 650,
        height: heightAfter ? heightAfter : 350,
        translateX: x,
        yPercent: 0,
        bottom: bottom,
      })
      .from(
        ".fade-up",
        {
          y: "35%",
          opacity: 0,
          stagger: 0.075,
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        },
        "-=1"
      )
      .from(".fill-width", {
        width: 0,
        stagger: { amount: 0.075 },
        ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
      })
      .from(
        ".fade-up-2",
        {
          y: "35%",
          opacity: 0,
          stagger: 0.075,
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        },
        "-=1.5"
      )
      .from(
        headingSplit.lines,
        {
          y: "100%",
          stagger: 0.075,
          ease: CustomEase.create("custom", "M0,0 C0.82,0.08 0.29,1 1,1"),
        },
        "-=1"
      );
  }, {});

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="h-[100vh] flex flex-col" ref={heroSectionRef}>
        {/* Container */}
        <div className="max-w-[1580px] relative h-full p-container w-full mx-auto">
          <div className="grid grid-cols-4 tablet:grid-cols-8 desktop:grid-cols-12 gap-y-8 h-full">
            <header className="relative text-xs tablet:text-base col-span-full z-20">
              <div className="flex flex-col desktop:flex-row gap-y-4 gap-x-11">
                <p className="fade-up">Studio of Mario Daruranto</p>
                <div className="flex flex-col gap-y-1 fade-up">
                  <span>Designer</span>
                  <span>Developer</span>
                </div>
                <div className="flex flex-col gap-y-1 fade-up">
                  <p>Kupang, East Nusa Tenggara</p>
                  <RollingText
                    href="mailto:hello@azlhart.com"
                    className="font-bold"
                  >
                    hello@azlhart.com
                  </RollingText>
                </div>
              </div>
            </header>

            <h2 className="font-[DrukWide] text-2xl tablet:text-4xl desktop:text-5xl col-span-full tablet:col-start-4 desktop:col-start-7 z-10 tablet:-translate-y-20 desktop:-translate-y-0 slide-up">
              “Turning brand <br />
              into tab everyone <br />
              keeps open”
            </h2>

            <div className="flex flex-col items-end gap-y-4 tablet:gap-y-8 justify-end col-span-full z-10">
              <div className="grid grid-cols-4 tablet:grid-cols-8 desktop:grid-cols-12 w-full tablet:text-lg">
                <div className="flex justify-end gap-x-3 tablet:gap-x-7 tablet:text-lg desktop:text-xl col-span-3 tablet:col-span-4 col-end-5 tablet:col-end-8">
                  <span className="slide-up">Independent</span>
                  <span className="slide-up">Creative</span>
                  <span className="slide-up">Studio</span>
                </div>
              </div>

              <h1 className="text-7xl tablet:text-[9rem] desktop:text-[16rem] font-[DrukWide] slide-up cursor-default">
                azlhart
              </h1>
            </div>
          </div>

          <LogoSVG />
        </div>
      </section>

      <section className="h-[100vh] w-full"></section>
    </div>
  );
};

export default Home;
