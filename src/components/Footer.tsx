import { contactEmail } from "@/lib/site";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-invite">
        <p className="eyebrow">Have something in mind?</p>
        <Link href="/contact">
          Let’s make it
          <br />
          work for you. ↗
        </Link>
      </div>
      <div className="footer-bottom">
        <p>
          Azlhart® · Studio of Mario Daruranto
          <br />
          <span>Kupang, Indonesia · Working worldwide · UTC+8</span>
        </p>
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <nav aria-label="Footer navigation">
          <Link href="/services">Services</Link>
          <Link href="/works">Work</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
