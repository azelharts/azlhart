import type { Metadata } from "next";
import Image from "next/image";
import PageIntro from "@/components/PageIntro";
import CTA from "@/components/CTA";
import { services, process } from "@/lib/content";
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
      {services.map((service, i) => (
        <section className="service-row" key={service.title}>
          <div className="prose">
            <p className="eyebrow">
              0{i + 1} / {service.title}
            </p>
            <h2>{service.title}</h2>
            <p>{service.fit}</p>
            <h3>Typical scope</h3>
            <ul>
              {service.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <CTA
              href={`/contact?service=${encodeURIComponent(service.title)}`}
              text="Discuss this service"
            />
          </div>
          <div className="editorial-image">
            <Image
              src={service.image}
              alt=""
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </div>
        </section>
      ))}
      <section className="detail-section">
        <p className="eyebrow">From first conversation to handover</p>
        <div className="process-grid">
          {process.map((step, i) => (
            <div key={step.title}>
              <span className="eyebrow">0{i + 1}</span>
              <h2>{step.title}</h2>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>
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
