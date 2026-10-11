import type { Metadata } from "next";
import ServiceExplorer from "@/components/ServiceExplorer";
import ProcessSection from "@/app/(landing)/ProcessSection";
import PageIntro from "@/components/PageIntro";
import CTA from "@/components/CTA";
export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design, Framer websites and Next.js development. Explore deliverables and the Azlhart project process.",
  alternates: { canonical: "/services" },
};
export default function Services() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="02 / Capabilities" title="Built around your next move.">
        <p>
          A new presence, a better marketing site, or a custom digital product.
          Choose the starting point; we’ll define the right scope together.
        </p>
      </PageIntro>
      <ServiceExplorer />
      <ProcessSection compact />
      <section className="detail-section prose">
        <h2>Scope first. Then a proposal.</h2>
        <p>
          Pricing and timing depend on the number of pages, content readiness,
          integrations and review rounds. Share your target launch and budget
          range so we can discuss a realistic approach.
        </p>
        <p>
          Hosting, third-party subscriptions, content creation and post-launch
          support should be agreed explicitly in your proposal.
        </p>
        <CTA text="Start a project brief" />
      </section>
    </main>
  );
}
