"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
const links = [
  ["/about", "Studio"],
  ["/services", "Services"],
  ["/works", "Work"],
  ["/archive", "Archive"],
];
export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <header
      className="site-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          button.current?.focus();
        }
      }}
    >
      <Link
        href="/"
        className="nav-brand"
        aria-label="Azlhart home"
        onClick={() => setOpen(false)}
      >
        azlhart<span>®</span>
      </Link>
      <nav aria-label="Main navigation" className="desktop-nav">
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
          >
            {label}
          </Link>
        ))}
      </nav>
      <Link
        href="/contact"
        className="nav-contact"
        onClick={() => setOpen(false)}
      >
        Let’s talk ↗
      </Link>
      <button
        ref={button}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        {open ? "Close −" : "Menu +"}
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        className="mobile-nav"
        hidden={!open}
      >
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
            <span>↗</span>
          </Link>
        ))}
      </nav>
    </header>
  );
}
