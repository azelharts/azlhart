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
        label={`${project.category} / ${project.platform}`}
        title={project.name}
      >
        <p>{project.summary}</p>
      </PageIntro>
      <Image
        className="case-image"
        src={project.image}
        alt={project.imageAlt}
        width={1920}
        height={1080}
        sizes="100vw"
        priority
      />
      <p className="screenshot-caption">
        Public preview capture · {project.category}. Protected workflows are not
        shown.
      </p>
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
              <dt>Repository started</dt>
              <dd>{project.year}</dd>
            </div>
          </dl>
        </div>
        <div className="prose">
          <h2>The brief behind the build</h2>
          <p>{project.context}</p>
          <h3>Implemented in the project</h3>
          <ul>
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          <h3>Why it matters for your team</h3>
          <p>{project.relevance}</p>
          <p className="project-boundary">{project.boundary}</p>
          <p>{project.stack}</p>
          <div className="project-evidence-links">
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              {project.demoLabel} ↗
            </a>
            <a href={project.repo} target="_blank" rel="noopener noreferrer">
              View public source ↗
            </a>
          </div>
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
