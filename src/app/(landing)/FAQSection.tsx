"use client";

import { useId, useRef, useState } from "react";

import Image from "next/image";

import { Plus } from "lucide-react";

import { gsap, useGSAP } from "@/lib/gsap";
import { useFontsReady } from "@/lib/hooks";
import { revealLines, revealFade, revealInstantly } from "@/lib/animations";

import Header from "@/components/Header";
import CTA from "@/components/CTA";
import CurrentTime from "@/components/CurrentTime";
import { drukWide } from "@/lib/utils";

const FAQS = [
  {
    question: "What type of projects do you specialize in?",
    answer:
      "I provide creative direction, branding, UI/UX design, and Framer development tailored for modern digital experiences.",
  },
  {
    question: "How do we start working together?",
    answer:
      "Simply reach out through my contact form or email. We'll schedule a discovery call to understand your vision, goals, and timeline before creating a tailored proposal.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes, I collaborate remotely with clients around the world and adapt seamlessly across time zones and workflows.",
  },
  {
    question: "What is your typical turnaround time?",
    answer:
      "Turnaround depends on the project scope, but most sites are delivered within 2–4 weeks from initial kickoff.",
  },
  {
    question: "Can you handle both design and build?",
    answer:
      "Yes. I handle both design and Framer development from start to finish — ensuring that the final experience matches the creative vision with precision and performance.",
  },
  {
    question: "How much does a typical project cost?",
    answer:
      "Pricing varies depending on the project's scale, complexity, and requirements. After our discovery call, I'll provide a detailed proposal that reflects your goals and deliverables.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes. I typically require a 30%-50% upfront deposit to secure your project in my schedule, with the remaining balance due upon completion or launch.",
  },
  {
    question: "What's your process like?",
    answer:
      "Each project begins with a discovery call, followed by design phases, client reviews, and hands-on development.",
  },
];

const FAQItem = ({ faq }: { faq: (typeof FAQS)[0] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const panelId = useId();

  const { contextSafe } = useGSAP(
    () => {
      // One paused timeline built up front and played/reversed on click.
      // Building a fresh timeline per click (the previous approach) left the
      // old tweens running, so fast clicking stacked competing animations.
      timeline.current = gsap
        .timeline({ paused: true })
        .to(answerRef.current, { height: "auto", autoAlpha: 1, y: 0 })
        .to(iconRef.current, { rotate: 45 }, "<");
    },
    { scope: itemRef },
  );

  const toggleFAQ = contextSafe(() => {
    const tl = timeline.current;
    if (!tl) return;

    // invalidate() re-measures `height: "auto"`, so the panel stays correct
    // after a resize or font swap changes how the answer wraps.
    if (isOpen) tl.reverse();
    else tl.invalidate().play();

    setIsOpen(!isOpen);
  });

  return (
    <div ref={itemRef} className="faq-item bg-white/5">
      <button
        type="button"
        onClick={toggleFAQ}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="flex w-full flex-col px-4"
      >
        <div className="flex min-h-[60px] w-full items-center justify-between">
          <span className="p-responsive text-left">{faq.question}</span>
          <Plus ref={iconRef} width={16} height={16} className="shrink-0" />
        </div>
        <div
          id={panelId}
          ref={answerRef}
          className="h-0 w-full translate-y-[15px] overflow-hidden opacity-0"
        >
          <p className="p-responsive mt-2 mb-[30px] max-w-[90%] text-left !leading-[125%] text-white/50">
            {faq.answer}
          </p>
        </div>
      </button>
    </div>
  );
};

const FAQSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const fontsReady = useFontsReady();

  useGSAP(
    () => {
      if (!fontsReady) return;

      // Scoped to this component: useGSAP's `scope` only covers selectors
      // resolved synchronously in its callback, and matchMedia handlers run
      // later. That matters here — `.work-count` exists in both this section
      // and the other one, so an unscoped lookup animates both.
      const mm = gsap.matchMedia(containerRef);

      mm.add("(prefers-reduced-motion: reduce)", () =>
        revealInstantly([".faq-item"]),
      );

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealLines(headingRef.current);
        // One trigger with a stagger rather than eight — the items are stacked
        // in a single column, so they all enter within the same scroll moment.
        revealFade(".faq-item", 0.05);
      });
    },
    { dependencies: [fontsReady], scope: containerRef, revertOnUpdate: true },
  );

  return (
    <section
      className="relative flex flex-col overflow-clip"
      ref={containerRef}
    >
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <Header headline="help-center" number={2} subText="clarifications" />
        <div className="custom-grid desktop:gap-y-32 h-fit gap-y-16 py-16">
          <h3
            ref={headingRef}
            className={`h3-responsive desktop:col-span-7 tablet:col-span-5 col-span-4 !leading-[125%] uppercase ${drukWide.className}`}
          >
            Your questions, our clear answer
          </h3>

          <div className="tablet:col-span-3 tablet:justify-self-end tablet:items-end tablet:flex-col desktop:col-span-5 tablet:jusity-start col-span-full flex flex-col items-start gap-y-4">
            <p className="cta-p-responsive text-white/50">
              Don&apos;t find what you&apos;re looking for?
            </p>
            <CTA text="contact us" />
          </div>

          <div className="tablet:col-span-4 desktop:col-start-7 desktop:col-span-6 tablet:order-3 tablet:col-start-5 col-span-full flex flex-col gap-y-4">
            {FAQS.map((faq) => (
              <FAQItem key={faq.question} faq={faq} />
            ))}
          </div>

          <div className="tablet:col-span-3 desktop:col-span-4 tablet:row-start-2 tablet:self-end col-span-full flex flex-col gap-y-6">
            <p className="cta-p-responsive mb-4 !leading-[125%] text-white/50">
              Thoughtful answers to the questions that matter most
            </p>

            <div className="p-responsive flex flex-col gap-y-2">
              <div className="flex justify-between text-white/50">
                <span>Current location:</span>
                <span>Local time:</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase">Remote</span>
                <CurrentTime />
              </div>
            </div>
            <div ref={imageRef} className="tablet:h-[350px] relative h-[160px]">
              <Image
                src="/images/faq.jpg"
                alt=""
                fill
                loading="lazy"
                sizes="(max-width: 833px) 100vw, (max-width: 1255px) 37vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
