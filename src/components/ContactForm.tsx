"use client";
import { contactEmail } from "@/lib/site";
import { useState, type FormEvent } from "react";
export default function ContactForm({
  service = "",
  project = "",
}: {
  service?: string;
  project?: string;
}) {
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setBrief(
      `Name: ${data.get("name")}\nCompany: ${data.get("company")}\nEmail: ${data.get("email")}\nService: ${data.get("service")}\nBudget: ${data.get("budget")}\nTarget launch: ${data.get("timeline")}\n\n${data.get("message")}`,
    );
    setCopied(false);
  }
  return (
    <form
      className="contact-form"
      onSubmit={prepare}
      onChange={() => {
        setBrief("");
        setCopied(false);
      }}
    >
      <div className="form-grid">
        <label>
          Your name
          <input name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label>
          Company
          <input
            name="company"
            autoComplete="organization"
            required
            maxLength={160}
          />
        </label>
        <label className="full">
          Work email
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            maxLength={200}
          />
        </label>
        <label className="full">
          What do you need?
          <select name="service" defaultValue={service}>
            <option value="">Help me choose</option>
            <option>Website design</option>
            <option>Framer websites</option>
            <option>Next.js development</option>
          </select>
        </label>
        <label>
          Budget range <span>(optional)</span>
          <input
            name="budget"
            placeholder="Amount and currency"
            maxLength={100}
          />
        </label>
        <label>
          Target launch <span>(optional)</span>
          <input
            name="timeline"
            placeholder="Date or flexible"
            maxLength={100}
          />
        </label>
        <label className="full">
          Tell me about the project
          <textarea
            name="message"
            required
            rows={6}
            maxLength={4000}
            defaultValue={
              project ? `I’m interested in a project like ${project}. ` : ""
            }
            placeholder="Your goals, audience, pages, functionality and any useful links."
          />
        </label>
      </div>
      <p className="form-note">
        This prepares an email on your device. Nothing is sent or stored by this
        form. You’ll review and send the brief in your email app.
      </p>
      <button className="solid-button" type="submit">
        Prepare email brief ↗
      </button>
      {brief && (
        <div className="brief-result" role="status">
          <h2>Your brief is ready</h2>
          <p>Open your email app, then send the message to {contactEmail}.</p>
          <a
            className="solid-button"
            href={`mailto:${contactEmail}?subject=${encodeURIComponent("Project inquiry — Azlhart")}&body=${encodeURIComponent(brief)}`}
          >
            Open email app ↗
          </a>
          <button
            type="button"
            className="text-button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(brief);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
          >
            {copied ? "Brief copied" : "Copy brief"}
          </button>
          <details>
            <summary>No email app? View and copy your brief</summary>
            <pre>{brief}</pre>
          </details>
        </div>
      )}
    </form>
  );
}
