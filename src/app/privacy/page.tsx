import { contactEmail, contactEnabled } from "@/lib/site";
import type { Metadata } from "next";
import PageIntro from "@/components/PageIntro";
export const metadata: Metadata = {
  title: "Privacy",
  alternates: { canonical: "/privacy" },
};
export default function Privacy() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro
        label="Privacy / Website inquiries"
        title="A note on your information."
      >
        <p>How the project inquiry form works.</p>
      </PageIntro>
      <div className="prose privacy-copy">
        <h2>The brief stays on your device</h2>
        <p>
          The form prepares an email using the information you enter. It does
          not submit your details to a server or save them in browser storage.
          You choose whether to send the message through your email provider.
        </p>
        {!contactEnabled && (
          <p>
            Inquiries are not open yet. The current form lets you prepare and
            copy a brief without transmitting it to the studio.
          </p>
        )}
        <h2>When you send an email</h2>
        <p>
          The name, contact information and project details you include are
          shared with Azlhart to discuss your inquiry. Avoid including passwords
          or sensitive personal information in your brief.
        </p>
        <h2>Website delivery</h2>
        <p>
          The hosting provider may process technical request information to
          deliver and protect the website. This site does not include
          advertising trackers or an analytics integration in its application
          code.
        </p>
        <h2>Questions about your information</h2>
        <p>
          {contactEnabled ? (
            <>
              Contact <a href={`mailto:${contactEmail}`}>{contactEmail}</a> to
              ask about information you have shared or request its deletion.
            </>
          ) : (
            "A studio contact address will be provided when inquiries open. The current brief form does not collect your information."
          )}
        </p>
      </div>
    </main>
  );
}
