"use client";

import { useContactPanel } from "@/components/ContactPanel";
import DotWordmark from "@/components/DotWordmark";
import Header from "@/components/Header";
import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

const LINKS = [
  { href: "/", label: "Back to the index" },
  { href: "/works", label: "Read the works" },
  { href: "/about", label: "About me" },
];

/**
 * The 404: the same materials as every other page. "404" is printed in dots
 * and keeps breathing; the message decodes; three links and the contact
 * panel give the way back.
 */
const NotFoundContent = () => {
  const openContact = useContactPanel();

  return (
    <section className="max-w-container px-container mx-auto flex min-h-[100svh] w-full flex-col justify-between">
      <div className="desktop:pt-48 tablet:pt-40 flex flex-col gap-y-12 pt-32">
        <Header headline="not-found" number={404} subText="error" />
        <div className="custom-grid gap-y-8">
          <p className="tablet:text-2xl tablet:col-span-5 desktop:col-span-6 col-span-full text-xl !leading-[140%] font-light">
            <ScrambleText
              text="This page doesn't exist,"
              className="font-light"
            />
            <br />
            <ScrambleText
              text="or it moved somewhere else."
              className="font-light"
            />
          </p>
          <ul className="p-responsive tablet:col-span-3 tablet:col-end-9 desktop:col-span-3 desktop:col-end-13 col-span-full flex flex-col gap-y-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <TransitionLink href={l.href}>
                  <ScrambleText text={`${l.label} →`} />
                </TransitionLink>
              </li>
            ))}
            <li>
              <button type="button" onClick={openContact}>
                <ScrambleText text="Tell me what was missing →" />
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="pb-8">
        <DotWordmark text="404" scrub={false} />
      </div>
    </section>
  );
};

export default NotFoundContent;
