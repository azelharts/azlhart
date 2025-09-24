import Link from "next/link";
import CTAButton from "./CTAButton";

const Footer = () => {
  return (
    <section className="w-full h-screen hidden flex-col sub-sections bg-[#151515]">
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid pt-20 text-white">
          <div className="flex justify-between col-span-full text-sm">
            <div className="flex flex-col gap-y-2">
              <p className="text-white/45 font-medium">
                Kupang, East Nusa Tenggara
              </p>
              <Link href="mailto:hello@azlhart.com">hello@azlhart.com</Link>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="text-white/45 font-medium">Local Time</p>
            </div>
          </div>

          <div className="col-span-full flex flex-col gap-y-4 mt-24">
            <div className="flex gap-x-12 text-5xl">
              <span className="w-8">01</span>
              <Link href="/work" className="font-[BricolageGrotesqueBold]">
                Work
              </Link>
            </div>
            <div className="flex gap-x-12 text-5xl">
              <span className="w-8">02</span>
              <Link href="/about" className="font-[BricolageGrotesqueBold]">
                about
              </Link>
            </div>
          </div>

          <CTAButton
            href="/"
            text="Get in touch"
            className="!border-white col-end-4"
          />
        </div>
      </div>
    </section>
  );
};

export default Footer;
