import type { Metadata } from "next";

import { getWorks } from "@/lib/works";

import Footer from "@/components/Footer";

import WorksIndex from "./WorksIndex";

export const metadata: Metadata = {
  title: "Works | Mario Daruranto",
  description:
    "Write-ups of features I've built for production products: what the problem was, what constrained it, and how it was solved.",
};

const WorksPage = async () => {
  const works = await getWorks();

  return (
    <main className="flex flex-col gap-y-32">
      <WorksIndex works={works} />
      <Footer />
    </main>
  );
};

export default WorksPage;
