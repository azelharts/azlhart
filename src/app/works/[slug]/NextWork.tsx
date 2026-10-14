"use client";

import { useState } from "react";

import { drukWide } from "@/lib/utils";
import { pad, type Work } from "@/lib/works";

import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

/**
 * The "next work" link at the end of an article. The one-line label
 * scrambles on hover; the title only dims, since a wrapped title would
 * reflow while scrambling.
 */
const NextWork = ({ work }: { work: Work }) => {
  const [active, setActive] = useState(false);

  return (
    <TransitionLink
      href={`/works/${work.slug}`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className="group custom-grid gap-y-6 border-t border-white/25 pt-6 font-normal"
    >
      <span className="article-label col-span-2">
        NEXT WORK &#91;{pad(work.index)}&#93;
      </span>
      <span className="p-responsive tablet:col-end-9 desktop:col-end-13 col-span-2 col-end-5 justify-self-end font-bold">
        <ScrambleText text="read next" active={active} />
      </span>
      <span
        className={`tablet:col-span-6 desktop:col-span-9 tablet:text-5xl desktop:text-7xl col-span-full text-3xl !leading-[110%] uppercase transition-opacity duration-500 group-hover:opacity-60 ${drukWide.className}`}
      >
        {work.title}
      </span>
    </TransitionLink>
  );
};

export default NextWork;
