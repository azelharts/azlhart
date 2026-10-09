import Image from "next/image";
import Link from "next/link";
import { drukWide } from "@/lib/utils";
export default function HeroSection() {
  return (
    <section className="home-hero">
      <Image
        src="/images/hero-thumbnail.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero-background"
      />
      <div className="hero-topline">
        <span>Studio of Mario Daruranto</span>
        <span>Kupang, Indonesia · Worldwide</span>
      </div>
      <div className="hero-message">
        <p className="eyebrow">Independent design & development</p>
        <h1 className={drukWide.className}>
          Your brand.
          <br />A website
          <br />
          with purpose.
        </h1>
        <p>
          Distinctive websites for brands ready for their next chapter. From
          design direction to Framer and Next.js development.
        </p>
        <div className="hero-actions">
          <Link className="solid-button" href="/works">
            Explore the work ↗
          </Link>
          <Link className="outline-button" href="/contact">
            Start a project ↗
          </Link>
        </div>
      </div>
      <div className={`hero-wordmark ${drukWide.className}`} aria-hidden="true">
        azlhart
      </div>
    </section>
  );
}
