import HeroSection from "./HeroSection";

const Home = () => {
  const enableScroll = () => {};

  return (
    <main className="flex flex-col">
      <HeroSection />
      <section className="h-[100vh] w-full hidden sub-sections"></section>
    </main>
  );
};

export default Home;
