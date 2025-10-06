import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServiceSection from "./ServiceSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-20">
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <section className="h-screen w-full" />
    </main>
  );
};

export default Home;
