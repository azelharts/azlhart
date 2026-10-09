import Header from "@/components/Header";
import CTA from "@/components/CTA";
const FAQS = [
  {
    question: "What type of projects do you specialize in?",
    answer:
      "I provide creative direction, branding, UI/UX design, and Framer development tailored for modern digital experiences.",
  },
  {
    question: "How do we start working together?",
    answer:
      "Simply reach out through my contact form or email. We'll schedule a discovery call to understand your vision, goals, and timeline before creating a tailored proposal.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes, I collaborate remotely with clients around the world and adapt seamlessly across time zones and workflows.",
  },
  {
    question: "What is your typical turnaround time?",
    answer:
      "Timing depends on scope, content readiness and review rounds. Share your target launch date so we can agree on a realistic schedule before kickoff.",
  },
  {
    question: "Can you handle both design and build?",
    answer:
      "Yes. I handle both design and Framer development from start to finish — ensuring that the final experience matches the creative vision with precision and performance.",
  },
  {
    question: "How much does a typical project cost?",
    answer:
      "Pricing varies depending on the project's scale, complexity, and requirements. After our discovery call, I'll provide a detailed proposal that reflects your goals and deliverables.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Payment milestones and any deposit are agreed in the project proposal before work starts.",
  },
  {
    question: "What's your process like?",
    answer:
      "Each project begins with a discovery call, followed by design phases, client reviews, and hands-on development.",
  },
];

export default function FAQSection() {
  return (
    <section className="px-container">
      <Header headline="Good to know" number={5} subText="Before we begin" />
      <div className="section-intro">
        <h2>Your questions, answered.</h2>
        <CTA text="Ask about your project" />
      </div>
      <div className="faq-list">
        {FAQS.map((faq) => (
          <details key={faq.question}>
            <summary>
              {faq.question}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
