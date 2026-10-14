"use client";

import type { ComponentProps, MouseEvent } from "react";

import Link from "next/link";

import { usePageTransition } from "./PageTransition";

type Props = Omit<ComponentProps<typeof Link>, "href"> & { href: string };

/**
 * A next/link that routes through the page transition. Modified clicks
 * (new tab, new window, download) fall through to the browser untouched.
 */
const TransitionLink = ({ href, onClick, ...props }: Props) => {
  const navigate = usePageTransition();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    )
      return;

    event.preventDefault();
    navigate(href);
  };

  return <Link href={href} onClick={handleClick} {...props} />;
};

export default TransitionLink;
