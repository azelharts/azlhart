import HeroSection from "./HeroSection";
import ServiceSection from "./ServiceSection";
import WorkSection from "./WorkSection";
import AboutSection from "./AboutSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-40 tablet:gap-y-52 desktop:gap-y-72">
      <HeroSection />
      <WorkSection />
      <ServiceSection />
      <AboutSection />
      <section className="h-[100vh] w-full hidden flex-col"></section>
    </main>
  );
};

export default Home;
