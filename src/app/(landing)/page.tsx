import HeroSection from "./HeroSection";
import WorkSection from "./WorkSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-40 desktop:gap-y-44">
      <HeroSection />
      <WorkSection />
      <section className="h-[100vh] w-full hidden sub-sections"></section>
    </main>
  );
};

export default Home;
