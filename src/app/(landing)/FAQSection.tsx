"use client";

import { RefObject, useRef } from "react";

import Image from "next/image";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import SplitText from "gsap/dist/SplitText";
import CustomEase from "gsap/CustomEase";

import Header from "@/components/Header";

import { drukWide } from "@/lib/utils";
import { Plus } from "lucide-react";
import CurrentTime from "@/components/CurrentTime";
import CTA from "@/components/CTA";

const FAQS = [
  {
    question: "What type of projects do you specialize in?",
    answer:
      "I provide creative direction, branding, UI/UX design, and Framer development tailored for modern digital experiences.",
  },
  {
    question: "How do we start working together?",
    answer:
      "Simply reach out through my contact form or email. We’ll schedule a discovery call to understand your vision, goals, and timeline before creating a tailored proposal.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes — I collaborate remotely with clients around the world and adapt seamlessly across time zones and workflows.",
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
      "Pricing varies depending on the project’s scale, complexity, and requirements. After our discovery call, I’ll provide a detailed proposal that reflects your goals and deliverables.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes. I typically require a 30%-50% upfront deposit to secure your project in my schedule, with the remaining balance due upon completion or launch.",
  },
  {
    question: "What’s your process like?",
    answer:
      "Each project begins with a discovery call, followed by design phases, client reviews, and hands-on development.",
  },
];

const FAQSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
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

          <div className="tablet:col-span-3 tablet:justify-self-end tablet:items-end tablet:flex-col desktop:col-span-5 tablet:jusity-start col-span-full flex items-center justify-between gap-y-8">
            <p className="cta-p-responsive text-white/50">
              Don't find what you're looking for?
            </p>
            <CTA text="contact us" />
          </div>

          <div className="tablet:col-span-4 desktop:col-start-7 desktop:col-span-6 tablet:order-3 tablet:col-start-5 col-span-full flex flex-col gap-y-4">
            {FAQS.map((faq, idx) => (
              <button
                key={idx}
                className="flex h-[60px] w-full justify-between bg-white/5 px-4"
              >
                <div className="flex w-full items-center justify-between">
                  <span className="p-responsive">{faq.question}</span>
                  <Plus width={16} height={16} />
                </div>
              </button>
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
            <div className="tablet:h-[350px] relative h-[160px]">
              <Image
                src="/images/faq.jpg"
                alt=""
                fill
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
