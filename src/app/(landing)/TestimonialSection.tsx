"use client";

import { useRef } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import TestimonialCard from "@/components/TestimonialCard";
import CTAButton from "@/components/CTAButton";

const testimonials = [
  {
    review:
      "“Working with Mario has been such a great experience! They’re super professional, creative, and really know how to bring ideas to life. Our website looks amazing thanks to his incredible work.”",
    profileUrl:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
    username: "Ben Josiah & Vanessa Wongso",
    role: "CEO & Co-Founder, FeetStudio",
    companyProfileUrl:
      "https://framerusercontent.com/images/g0ycKcVss3ylm8svTFx2zCxVLO8.png?scale-down-to=512&width=530&height=347",
  },
  {
    review:
      "“Collaborating with Mario was seamless from start to finish. He took the time to understand our vision, then translated it into a website that feels both polished and uniquely ours. His attention to detail, creative instincts, and technical knowledge made the entire process effortless. We now have a digital presence that not only looks stunning but also performs exactly the way our business needs.”",
    profileUrl:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
    username: "Robertus Hudi",
    role: "Co-Founder, Aetheria",
    companyProfileUrl:
      "https://framerusercontent.com/images/g0ycKcVss3ylm8svTFx2zCxVLO8.png?scale-down-to=512&width=530&height=347",
  },
  {
    review:
      "“From the very first call, Mario showed a deep understanding of what we wanted to achieve. He guided us with clarity, offered thoughtful suggestions, and then delivered a website that exceeded expectations in every way. The animations and interactions make the experience unforgettable, and the feedback from our audience has been overwhelmingly positive. I’d recommend him without hesitation.”",
    profileUrl:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
    username: "Carlos De'Aldi Yunatan",
    role: "CEO/Founder, C&A Kupang",
    companyProfileUrl:
      "https://framerusercontent.com/images/g0ycKcVss3ylm8svTFx2zCxVLO8.png?scale-down-to=512&width=530&height=347",
  },
  {
    review:
      "“From the very first call, Mario showed a deep understanding of what we wanted to achieve. He guided us with clarity, offered thoughtful suggestions, and then delivered a website that exceeded expectations in every way. The animations and interactions make the experience unforgettable, and the feedback from our audience has been overwhelmingly positive. I’d recommend him without hesitation.”",
    profileUrl:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
    username: "Gerald Antonio Japari",
    role: "Owner, Se'i Babi Kolhua",
    companyProfileUrl:
      "https://framerusercontent.com/images/g0ycKcVss3ylm8svTFx2zCxVLO8.png?scale-down-to=512&width=530&height=347",
  },
  {
    review:
      "“From the very first call, Mario showed a deep understanding of what we wanted to achieve. He guided us with clarity, offered thoughtful suggestions, and then delivered a website that exceeded expectations in every way. The animations and interactions make the experience unforgettable, and the feedback from our audience has been overwhelmingly positive. I’d recommend him without hesitation.”",
    profileUrl:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg",
    username: "Edward Hartantio",
    role: "Owner, R.M. Tanjung",
    companyProfileUrl:
      "https://framerusercontent.com/images/g0ycKcVss3ylm8svTFx2zCxVLO8.png?scale-down-to=512&width=530&height=347",
  },
];

const TestimonialSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const testimonialCardsContainerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {}, { scope: containerRef });

  return (
    <section
      className="h-fit flex-col hidden sub-sections bg-white"
      ref={containerRef}
    >
      <div className="max-w-container relative p-container w-full mx-auto">
        <div className="flex flex-col gap-y-8 h-fit sticky top-0 left-0">
          {/* Testimonial Cards Container */}
          <div
            className="h-[100vh] w-full flex flex-col items-center justify-center relative"
            id="sticktop"
          >
            <div className="flex gap-x-8">
              <h2 className="font-[DrukWide] text-6xl tablet:text-7xl desktop:text-8xl text-nowrap">
                TESTIMONIAL REVIEW
              </h2>
              <h2 className="font-[DrukWide] text-6xl tablet:text-7xl desktop:text-8xl text-nowrap">
                TESTIMONIAL REVIEW
              </h2>
            </div>
            <div className="flex gap-x-8">
              <h2 className="font-[DrukWide] text-6xl tablet:text-7xl desktop:text-8xl text-white text-nowrap text-stroke">
                TESTIMONIAL REVIEW
              </h2>
              <h2 className="font-[DrukWide] text-6xl tablet:text-7xl desktop:text-8xl text-white text-nowrap text-stroke">
                TESTIMONIAL REVIEW
              </h2>
            </div>

            <div className="custom-grid w-full h-full absolute top-0 left-0">
              <CTAButton
                text="Get in touch"
                href="/"
                className="col-start-1 col-end-5 tablet:col-start-1 tablet:col-end-9 desktop:col-start-3 desktop:col-end-5  justify-self-center self-center translate-y-[140px] tablet:translate-y-[164px] desktop:translate-y-[212px]"
              />
            </div>
          </div>

          {/* Testmonial Cards */}
          <div
            className="custom-grid gap-y-16 tablet:gap-y-24 desktop:gap-y-32 pb-[100vh]"
            id="end-trigger"
          >
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={idx}
                review={testimonial.review}
                profileUrl={testimonial.profileUrl}
                username={testimonial.username}
                role={testimonial.role}
                companyProfileUrl={testimonial.companyProfileUrl}
                className="col-start-1 col-end-5 tablet:col-start-2 tablet:col-end-8 desktop:col-start-7 desktop:col-end-12 z-20"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
