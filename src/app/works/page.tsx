import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ProjectGrid from "@/components/ProjectGrid";
export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Explore selected Framer and Next.js website projects by Azlhart.",
  alternates: { canonical: "/works" },
};
export default function Works() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="03 / Selected work" title="A feel for the work.">
        <p>
          A selection of website projects across Framer and Next.js. Explore the
          visual direction, then let’s discuss what your own project needs.
        </p>
      </PageIntro>
      <ProjectGrid />
    </main>
  );
}
