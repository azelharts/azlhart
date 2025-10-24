import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";
import ProcessSection from "./ProcessSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-20">
      <HeroSection />
      <AboutSection />
      <ServiceSection />
      <WorkSection />
      <div className="h-[400vh] border border-red-500">
        <ProcessSection />
      </div>
      <section className="h-screen w-full" />
    </main>
  );
};

export default Home;
