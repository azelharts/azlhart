import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/content";
import PageIntro from "@/components/PageIntro";
import CTA from "@/components/CTA";
export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return {
    title: project?.name ?? "Project not found",
    description: project
      ? `${project.name} — a ${project.platform} website project in the Azlhart portfolio.`
      : undefined,
    alternates: { canonical: `/works/${slug}` },
  };
}
export default async function Project({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main-content" className="inner-page">
      <Link className="back-link" href="/works">
        ← All work
      </Link>
      <PageIntro
        label={`${project.year} / ${project.platform}`}
        title={project.name}
      >
        <p>Selected website project · Azlhart</p>
      </PageIntro>
      <Image
        className="case-image"
        src={project.image}
        alt={`${project.name} project cover`}
        width={1920}
        height={1080}
        sizes="100vw"
        priority
      />
      <section className="editorial-grid detail-section">
        <div>
          <p className="eyebrow">Project at a glance</p>
          <dl className="project-facts">
            <div>
              <dt>Project</dt>
              <dd>{project.name}</dd>
            </div>
            <div>
              <dt>Platform</dt>
              <dd>{project.platform}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </div>
        <div className="prose">
          <h2>Considering a similar project?</h2>
          <p>
            Use this work as a starting point for a conversation about visual
            direction and platform fit. Share the pages, functionality and
            launch goals your team has in mind.
          </p>
          <p>
            For a deeper discussion of the project and relevant experience, get
            in touch with Mario.
          </p>
          <CTA
            href={`/contact?project=${encodeURIComponent(project.name)}`}
            text="Discuss your project"
          />
        </div>
      </section>
      <Link className="next-project" href={`/works/${next.slug}`}>
        <span className="eyebrow">Next project</span>
        <span>{next.name} ↗</span>
      </Link>
    </main>
  );
}
