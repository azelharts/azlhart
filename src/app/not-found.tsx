import Link from "next/link";
import PageIntro from "@/components/PageIntro";
export default function NotFound() {
  return (
    <main id="main-content" className="inner-page">
      <PageIntro label="404 / Page not found" title="Let’s get you back.">
        <p>
          This page doesn’t exist. Explore the selected work or start a
          conversation.
        </p>
      </PageIntro>
      <div className="flex gap-8">
        <Link className="solid-button" href="/works">
          Explore work ↗
        </Link>
        <Link className="solid-button" href="/contact">
          Contact the studio ↗
        </Link>
      </div>
    </main>
  );
}
