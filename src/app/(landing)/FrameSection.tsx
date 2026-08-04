import { drukWide } from "@/lib/utils";

import BackgroundVideo from "@/components/BackgroundVideo";

/**
 * Stays a server component — the only client code is the video wrapper, which
 * defers its own download. This previously pulled in GSAP, SplitText and
 * CustomEase just to run an empty `document.fonts.ready` callback.
 */
const FrameSection = () => {
  return (
    <section className="relative flex flex-col overflow-clip">
      <div className="max-w-container px-container relative mx-auto h-full w-full">
        <div className="custom-grid desktop:gap-y-32 gap-y-16 py-16">
          <div className="col-span-full flex flex-col gap-y-8">
            <div className="tablet:h-[100vh] relative h-[80vh] w-full overflow-hidden">
              <BackgroundVideo
                src="/videos/frame.mp4"
                poster="/images/frame-poster.webp"
                width={1280}
                height={720}
                className="h-[160%] w-[100%] object-cover brightness-50"
              />
              <h2
                className={`h3-responsive tablet:max-w-[456px] tablet:bottom-12 desktop:max-w-[656px] tablet:left-6 desktop:left-8 absolute bottom-4 left-4 max-w-[265px] !leading-[125%] uppercase ${drukWide.className}`}
              >
                Every Frame With Meaning
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FrameSection;
