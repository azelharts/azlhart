"use client";
import { useEffect, useRef, useState } from "react";
interface BackgroundVideoProps {
  src: string;
  poster: string;
  className?: string;
  width: number;
  height: number;
}
export default function BackgroundVideo({
  src,
  poster,
  className,
  width,
  height,
}: BackgroundVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const update = () => {
      if (!visible || paused || motion.matches || document.hidden) {
        video.pause();
        return;
      }
      if (!video.getAttribute("src")) {
        video.src = src;
        video.load();
      }
      video.play().catch(() => {});
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(video);
    motion.addEventListener("change", update);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      video.pause();
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
    };
  }, [src, paused]);
  return (
    <>
      <video
        ref={ref}
        width={width}
        height={height}
        poster={poster}
        preload="none"
        loop
        muted
        playsInline
        aria-hidden="true"
        className={className}
      />
      <button
        type="button"
        className="video-toggle"
        onClick={() => setPaused(!paused)}
        aria-pressed={paused}
      >
        {paused ? "Play motion" : "Pause motion"}
      </button>
    </>
  );
}
