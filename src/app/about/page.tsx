import type { Metadata } from "next";

import Footer from "@/components/Footer";

import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "About | Mario Daruranto",
  description:
    "Frontend engineer with over a year of shipping web products in e-commerce, education, healthcare and HR.",
};

const AboutPage = () => (
  <main className="flex flex-col gap-y-32">
    <AboutContent />
    <Footer />
  </main>
);

export default AboutPage;
