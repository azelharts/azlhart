import HeroSection from "./HeroSection";

const Home = () => {
  return (
    <main className="tablet:gap-y-52 desktop:gap-y-72 flex flex-col gap-y-40">
      <HeroSection />
      <section className="h-screen w-full" />
    </main>
  );
};

export default Home;
