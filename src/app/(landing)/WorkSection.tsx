import { projects } from "@/lib/content";
import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import CTA from "@/components/CTA";
export default function WorkSection() {
  return (
    <section className="px-container">
      <Header
        headline="Selected work"
        number={3}
        subText="Websites & applications"
      />
      <div className="section-intro">
        <h2>Distinctive by design.</h2>
        <CTA href="/works" text={`Explore all ${projects.length} projects`} />
      </div>
      <ProjectGrid />
    </section>
  );
}
