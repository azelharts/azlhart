import Header from "@/components/Header";
import { process } from "@/lib/content";
export default function ProcessSection() {
  return (
    <section className="px-container">
      <Header
        headline="The process"
        number={4}
        subText="A clear path to launch"
      />
      <div className="process-grid py-16">
        {process.map((step, i) => (
          <div key={step.title}>
            <span className="eyebrow">0{i + 1}</span>
            <h2>{step.title}</h2>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
