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
