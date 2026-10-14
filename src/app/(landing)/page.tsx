import { getWorks } from "@/lib/works";

import HeroSection from "./HeroSection";

// The landing page is the hero and nothing else. Everything else lives
// under /works.
const Home = async () => {
  const works = await getWorks();

  return (
    <main>
      <HeroSection
        works={works
          .slice(0, 7)
          .map(({ slug, index, title }) => ({ slug, index, title }))}
        total={works.length}
      />
    </main>
  );
};

export default Home;
