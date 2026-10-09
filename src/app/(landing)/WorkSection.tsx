import Header from "@/components/Header";
import ProjectGrid from "@/components/ProjectGrid";
import CTA from "@/components/CTA";
export default function WorkSection() {
  return (
    <section className="px-container">
      <Header headline="Selected work" number={3} subText="Framer & Next.js" />
      <div className="section-intro">
        <h2>Distinctive by design.</h2>
        <CTA href="/works" text="Explore all 3 projects" />
      </div>
      <ProjectGrid />
    </section>
  );
}
