import { RefObject } from "react";

declare global {
  interface LogoSVGProps {
    refs: [RefObject<SVGSVGElement | null>, RefObject<SVGPathElement | null>];
    strokeWidth?: number;
    className?: string;
  }

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
}
