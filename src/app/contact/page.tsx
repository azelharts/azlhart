import { contactEmail } from "@/lib/site";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
import ContactForm from "@/components/ContactForm";
export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell Mario about your brand, project goals and timeline. Start a website design or development conversation with Azlhart.",
  alternates: { canonical: "/contact" },
};
export default async function Contact({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; project?: string }>;
}) {
  const params = await searchParams;
  const service = typeof params.service === "string" ? params.service : "";
  const project =
    typeof params.project === "string" ? params.project.slice(0, 120) : "";
  return (
    <main id="main-content" className="inner-page">
      <PageIntro
        label="05 / Start a conversation"
        title="What’s your next move?"
      >
        <p>
          Tell me what you’re building, who it’s for, and what needs to change.
          A rough brief is a good place to start.
        </p>
      </PageIntro>
      <div className="contact-layout">
        <aside className="prose">
          <h2>Let’s find the right fit.</h2>
          <a className="contact-email" href={`mailto:${contactEmail}`}>
            {contactEmail} ↗
          </a>
          <p>
            Kupang, Indonesia
            <br />
            UTC+8 · Remote collaboration
          </p>
          <h3>What happens next</h3>
          <ol>
            <li>Share your goals and current website, if you have one.</li>
            <li>We discuss fit, scope and any open questions.</li>
            <li>
              Agree on deliverables, timing and fees in a proposal before
              kickoff.
            </li>
          </ol>
          <p>Prefer your own format? Email your brief directly.</p>
        </aside>
        <ContactForm service={service} project={project} />
      </div>
    </main>
  );
}
