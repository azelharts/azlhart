import type { Metadata } from "next";
import Link from "next/link";
import PageIntro from "@/components/PageIntro";
import { projects } from "@/lib/content";
export const metadata: Metadata = {
  title: "Project archive",
  description:
    "An index of the website projects featured in the Azlhart portfolio.",
  alternates: { canonical: "/archive" },
};
export default function Archive() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="04 / Archive" title="The project index.">
        <p>
          A quick view of the work featured in the portfolio, organized by the
          year each repository began.
        </p>
      </PageIntro>
      <div className="archive-list">
        {[...projects]
          .sort((a, b) => b.year.localeCompare(a.year))
          .map((project) => (
            <Link href={`/works/${project.slug}`} key={project.slug}>
              <span>{project.year}</span>
              <h2>{project.name}</h2>
              <span>{project.platform}</span>
              <span aria-hidden="true">↗</span>
            </Link>
          ))}
      </div>
    </main>
  );
}
