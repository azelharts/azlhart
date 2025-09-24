import HeroSection from "./HeroSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";
import AboutSection from "./AboutSection";
import TestimonialSection from "./TestimonialSection";
import BookingFlowSection from "./BookingFlowSection";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-40 tablet:gap-y-52 desktop:gap-y-72">
      <HeroSection />
      <WorkSection />
      <ServiceSection />
      <AboutSection />
      <TestimonialSection />
      <BookingFlowSection />
    </main>
  );
};

export default Home;
