"use client";

import { useRef } from "react";

import Link from "next/link";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const CTAButton = ({ href, text, className }: CTAButtonProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "w-[210px] h-[84px] border border-foreground/50 flex flex-col justify-between pb-1 pl-1",
        className
      )}
    >
      <ArrowUpRight className="self-end" strokeWidth={1} />
      <span className="self-start">{text}</span>
    </Link>
  );
};

export default CTAButton;
