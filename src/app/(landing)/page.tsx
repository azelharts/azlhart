import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

const Home = () => {
  return (
    <main className="flex flex-col gap-y-20">
      <HeroSection />
      <AboutSection />
      <section className="h-screen w-full" />
    </main>
  );
};

export default Home;
