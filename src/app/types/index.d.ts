import { RefObject } from "react";

declare global {
  interface BaseProps {
    className?: string;
    children: ReactNode;
  }

  interface LinkProps extends BaseProps {
    as?: "link";
    href: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    onClick?: never;
  }

  interface ButtonProps extends BaseProps {
    as: "button";
    href?: never;
    target?: never;
    onClick?: () => void;
  }

  interface WorkCardProps {
    title?: string;
    subtitle?: string;
    logo?: string;
    service?: string;
    imageHeight: number;
    videoSrc?: string | undefined;
    imageSrc?: string | undefined;
    href: string;
    className?: string;
  }

  interface CTAButtonProps {
    href: string;
    text: string;
    className?: string;
  }
}
