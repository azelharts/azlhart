import type { Metadata } from "next";
import Link from "@/components/TransitionLink";
import MotionLab from "@/components/MotionLab";
import PageIntro from "@/components/PageIntro";
import { projects } from "@/lib/content";
export const metadata: Metadata = {
  title: "Archive & experiments",
  description:
    "Playable motion studies, visual experiments and the Azlhart project index.",
  alternates: { canonical: "/archive" },
};
export default function Archive() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="04 / Archive" title="A space to play.">
        <p>
          Motion studies and small explorations. Draw, resolve, reveal—take the
          controls and see what happens.
        </p>
      </PageIntro>
      <MotionLab />
      <section className="detail-section">
        <p className="eyebrow">Project index / by repository start year</p>
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
      </section>
    </main>
  );
}
