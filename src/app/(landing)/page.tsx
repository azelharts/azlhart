import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";
import ProcessSection from "./ProcessSection";
import FAQSection from "./FAQSection";

import FrameSection from "./FrameSection";

const Home = () => {
  return (
    <main id="main-content" className="flex flex-col gap-y-20">
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <WorkSection />
      <ProcessSection />
      <FAQSection />
      <FrameSection />
    </main>
  );
};

export default Home;
