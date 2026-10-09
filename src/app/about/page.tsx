import type { Metadata } from "next";
import Image from "next/image";
import PageIntro from "@/components/PageIntro";
import CTA from "@/components/CTA";
export const metadata: Metadata = {
  title: "Studio",
  description:
    "Meet Mario Daruranto, the independent designer and developer behind Azlhart in Kupang, Indonesia.",
  alternates: { canonical: "/about" },
};
export default function About() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="01 / The studio" title="A direct line to the maker.">
        <p>
          Azlhart is the independent creative studio of Mario Daruranto. Design
          and development, brought together for brands that care about how their
          business feels online.
        </p>
      </PageIntro>
      <section className="editorial-grid">
        <div className="editorial-image">
          <Image
            src="/images/landing-1.jpg"
            alt="Visual study from the Azlhart studio"
            fill
            sizes="(max-width: 700px) 100vw, 50vw"
          />
        </div>
        <div className="prose">
          <p className="eyebrow">Based in Kupang. Connected worldwide.</p>
          <h2>
            Small studio.
            <br />
            Shared ambition.
          </h2>
          <p>
            Work directly with the person shaping the design and building the
            experience. From a focused marketing site to a custom web
            application, the starting point is what your audience needs to
            understand and do.
          </p>
          <p>
            The approach combines considered typography, purposeful motion and
            practical implementation in Framer or Next.js.
          </p>
          <CTA href="/services" text="Explore the capabilities" />
        </div>
      </section>
      <section className="detail-section">
        <p className="eyebrow">Working together</p>
        <div className="three-grid">
          {[
            [
              "One shared brief",
              "A clear audience, business objective and agreed scope keep decisions focused.",
            ],
            [
              "Visible progress",
              "Review direction and implementation at agreed milestones, with consolidated feedback.",
            ],
            [
              "A considered handover",
              "Discuss content ownership, editing access and support needs before the project is scoped.",
            ],
          ].map(([title, copy]) => (
            <div key={title}>
              <h2>{title}</h2>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
