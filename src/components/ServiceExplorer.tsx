"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { services } from "@/lib/content";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import CTA from "./CTA";

export default function ServiceExplorer() {
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const service = services[active];
  useGSAP(
    () => {
      const mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".service-explorer-image", {
          clipPath: "inset(0 100% 0 0)",
          duration: 0.85,
        });
        gsap.from(".service-explorer-copy > *", {
          y: 18,
          opacity: 0,
          duration: 0.6,
          stagger: 0.055,
        });
      });
      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: root, dependencies: [active], revertOnUpdate: true },
  );
  return (
    <div className="service-explorer" ref={root}>
      <div
        className="service-picker"
        role="group"
        aria-label="Explore capabilities"
      >
        {services.map((item, i) => (
          <button
            type="button"
            key={item.title}
            aria-pressed={i === active}
            onClick={() => setActive(i)}
          >
            <span>0{i + 1}</span>
            {item.title}
            <span>↗</span>
          </button>
        ))}
      </div>
      <div className="service-explorer-content" key={active}>
        <div className="service-explorer-image">
          <Image
            src={service.image}
            alt=""
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <div className="prose service-explorer-copy">
          <p className="eyebrow">Your starting point / 0{active + 1}</p>
          <h2>{service.title}</h2>
          <p>{service.fit}</p>
          <h3>What we can shape together</h3>
          <ul>
            {service.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="service-input">
            {
              [
                "Bring your brand assets, audience, references and the pages you have in mind.",
                "Bring your content types, editing needs and target launch. We’ll define the CMS and handover together.",
                "Bring your user roles, key workflows and integration needs. We’ll map the product before the build.",
              ][active]
            }
          </p>
          <CTA
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            text="Discuss this service"
          />
          {active !== 1 && (
            <CTA
              className="service-related"
              href={`/works/${active === 0 ? "onlytheflames" : "hirestack"}`}
              text="Explore a related implementation"
            />
          )}
        </div>
      </div>
    </div>
  );
}
