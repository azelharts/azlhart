"use client";

import { RefObject, useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/CustomEase";

import Header from "@/components/Header";

import { drukWide } from "@/lib/utils";

const FAQSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <section
      className="relative flex flex-col overflow-clip"
      ref={containerRef}
    >
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="help-center" number={2} subText="clarifications" />
        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16"></div>
      </div>
    </section>
  );
};

export default FAQSection;
