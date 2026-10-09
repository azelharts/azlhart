import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ProjectGrid from "@/components/ProjectGrid";
export const metadata: Metadata = {
  title: "Selected work",
  description:
    "Explore application, research and portfolio projects with public source code and previews.",
  alternates: { canonical: "/works" },
};
export default function Works() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="03 / Selected work" title="A feel for the work.">
        <p>
          Websites and applications, with public previews and source code.
          Explore the implemented features and project context to find the
          experience relevant to your team.
        </p>
      </PageIntro>
      <ProjectGrid />
    </main>
  );
}
