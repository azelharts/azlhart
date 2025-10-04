import localFont from "next/font/local";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const drukWide = localFont({
  src: "../fonts/DrukWide-Medium.woff2",
  weight: "400",
});

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getInitialLogoDimensions = () => {
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
