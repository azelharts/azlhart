"use client";
import Link from "@/components/TransitionLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useStudioScroll } from "./SmoothScroll";
import ScrambleText from "./ScrambleText";
import LogoSVG from "./LogoSVG";
const links = [
  ["/about", "Studio"],
  ["/services", "Services"],
  ["/works", "Work"],
  ["/archive", "Archive"],
];
export default function Navbar() {
  const pathname = usePathname();
  const scroll = useStudioScroll();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const { contextSafe } = useGSAP({ scope: dialog });
  useEffect(() => {
    // Browser Back can change the route while the dialog is open.
    if (dialog.current?.open) {
      gsap.killTweensOf(dialog.current);
      dialog.current.close();
      setOpen(false);
      document.body.style.overflow = "";
      scroll.lock(false);
    }
  }, [pathname, scroll]);
  const close = contextSafe((immediate = false) => {
    setOpen(false);
    scroll.lock(false);
    document.body.style.overflow = "";
    const finish = () => {
      dialog.current?.close();
      button.current?.focus();
    };
    gsap.killTweensOf(dialog.current);
    if (immediate || matchMedia("(prefers-reduced-motion: reduce)").matches)
      finish();
    else
      gsap.to(dialog.current, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.4,
        onComplete: finish,
      });
  });
  const show = contextSafe(() => {
    dialog.current?.showModal();
    setOpen(true);
    scroll.lock(true);
    document.body.style.overflow = "hidden";
    gsap.killTweensOf(dialog.current);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        dialog.current,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.7 },
      );
      gsap.fromTo(
        ".menu-link",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.07,
          delay: 0.15,
          overwrite: true,
        },
      );
    } else gsap.set(dialog.current, { clipPath: "none" });
  });
  return (
    <header className="site-nav">
      <Link href="/" className="nav-brand" aria-label="Azlhart home">
        azlhart<span>®</span>
      </Link>
      <nav aria-label="Main navigation" className="desktop-nav">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
          >
            <ScrambleText text={label} />
          </Link>
        ))}
      </nav>
      <Link href="/contact" className="nav-contact">
        Let’s talk ↗
      </Link>
      <button
        ref={button}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => (open ? close() : show())}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <dialog
        ref={dialog}
        className="menu-dialog"
        aria-label="Explore Azlhart"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
      >
        <div className="menu-dialog-top">
          <span>AZLHART® / DIRECTORY</span>
          <button type="button" onClick={() => close()} autoFocus>
            Close −
          </button>
        </div>
        <div className="menu-art" aria-hidden="true">
          <LogoSVG />
        </div>
        <nav
          id="mobile-menu"
          aria-label="Mobile navigation"
          className="menu-links"
        >
          {links.map(([href, label], i) => (
            <Link
              key={href}
              href={href}
              className="menu-link"
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              onClick={() => close(true)}
            >
              <span>0{i + 1}</span>
              {label}
              <span>↗</span>
            </Link>
          ))}
        </nav>
        <div className="menu-dialog-bottom">
          <span>
            Independent creative studio
            <br />
            Kupang, Indonesia / UTC+8
          </span>
          <Link href="/contact" onClick={() => close(true)}>
            Have a project in mind? ↗
          </Link>
        </div>
      </dialog>
    </header>
  );
}
