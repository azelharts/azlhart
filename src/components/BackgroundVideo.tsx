"use client";

import { useRef } from "react";

import { useGSAP, ScrollTrigger } from "@/lib/gsap";

interface BackgroundVideoProps {
  src: string;
  poster: string;
  className?: string;
  width: number;
  height: number;
}

/**
 * A decorative background video that doesn't load until it's scrolled to.
 *
 * `autoplay` overrides `preload="none"` — the browser fetches the whole file
 * immediately even when the element is far below the fold. That put 1.4MB on
 * the critical path for a video nobody sees until they've scrolled past four
 * sections. Here the source is only attached once the element nears the
 * viewport, and playback pauses again when it leaves, so an off-screen video
 * never burns decode time.
 */
const BackgroundVideo = ({
  src,
  poster,
  className,
  width,
  height,
}: BackgroundVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    const video = videoRef.current;
    if (!video) return;

    const load = () => {
      if (video.dataset.loaded) return;
      video.dataset.loaded = "true";

      const source = document.createElement("source");
      source.src = src;
      source.type = "video/mp4";
      video.appendChild(source);
      video.load();
    };

    ScrollTrigger.create({
      trigger: video,
      // Start fetching a screen early so it's ready by the time it's on screen.
      start: "top bottom+=100%",
      end: "bottom top",
      onEnter: () => {
        load();
        video.play().catch(() => {});
      },
      onEnterBack: () => {
        load();
        video.play().catch(() => {});
      },
      onLeave: () => video.pause(),
      onLeaveBack: () => video.pause(),
    });
  });

  return (
    <video
      ref={videoRef}
      width={width}
      height={height}
      poster={poster}
      preload="none"
      loop
      muted
      playsInline
      aria-hidden="true"
      className={className}
      data-speed="auto"
      style={{ willChange: "transform" }}
    />
  );
};

export default BackgroundVideo;
