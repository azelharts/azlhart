import HeroSection from "./HeroSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";
import AboutSection from "./AboutSection";
import TestimonialSection from "./TestimonialSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-40 tablet:gap-y-52 desktop:gap-y-72">
      <HeroSection />
      <WorkSection />
      <ServiceSection />
      <AboutSection />
      <TestimonialSection />
      <div className="w-full h-screen hidden sub-sections" />
    </main>
  );
};

export default Home;
