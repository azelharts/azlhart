"use client";

import { useEffect, useRef } from "react";

import { HALFTONE, fieldTarget, link, quad } from "@/lib/gl";

interface HeroCanvasProps {
  /** Morphs the halftone dots into square pixels while a work is hovered. */
  highlight: boolean;
}

/*
 * Pass 1, at one texel per halftone cell: liquid metal. Domain-warped fbm
 * (noise fed into noise) gives slow, folding chrome; a cosine palette from
 * near black to white turns the field into metallic bands, and a narrow
 * second lobe adds the bright specular streaks.
 */
const METAL = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + 17.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 1.8;
  float t = uTime * 0.05;

  vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(p + 3.5 * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p + 3.5 * q + vec2(8.3, 2.8) - t));
  float f = fbm(p + 3.0 * r);

  // Chrome reads as hard-edged reflections, not soft clouds: the bands are
  // sharpened with a smoothstep so each fold has a bright edge and a dark core.
  float band = 0.5 + 0.5 * cos(6.2831 * (f * 2.4 + r.x * 0.6 + t));
  float metal = smoothstep(0.35, 0.95, band) * 0.55;
  float spec = pow(max(0.0, cos(6.2831 * (f * 3.1 - t * 0.7))), 24.0);
  // A soft light from the upper left, so the surface reads as lit chrome.
  float light = smoothstep(1.3, 0.0, length(uv - vec2(0.35, 0.75)));
  float L = clamp(metal * (0.45 + 0.55 * light) + spec * 0.45, 0.0, 1.0);
  gl_FragColor = vec4(vec3(L), 1.0);
}
`;

/**
 * The hero's background: liquid metal, rendered as a halftone.
 *
 * Generated, not filmed: there is no video to download, and the field is
 * computed at one texel per dot (a few thousand texels) before the dots are
 * drawn, so the expensive noise runs on a tiny texture rather than on every
 * screen pixel. Renders only while on screen and the tab is visible; with
 * reduced motion it draws a single still frame.
 */
const HeroCanvas = ({ highlight }: HeroCanvasProps) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef(highlight);

  useEffect(() => {
    highlightRef.current = highlight;
  }, [highlight]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // A fresh canvas per effect run: cleanup releases the GL context, and a
    // canvas whose context was lost never gets a working one back (StrictMode
    // mounts twice in development).
    const canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.className = "absolute inset-0 h-full w-full";
    host.appendChild(canvas);

    const gl = canvas.getContext("webgl", {
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) {
      canvas.remove();
      return;
    }

    let metal: WebGLProgram;
    let halftone: WebGLProgram;
    try {
      metal = link(gl, METAL);
      halftone = link(gl, HALFTONE);
    } catch {
      canvas.remove();
      return;
    }

    const bindQuad = quad(gl);

    // The low-res field lives in a texture-backed framebuffer.
    const field = fieldTarget(gl);

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cell = 7 * dpr;
    let cols = 1;
    let rows = 1;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      cell = (width < 834 ? 6 : 7) * dpr;
      cols = Math.ceil(canvas.width / cell);
      rows = Math.ceil(canvas.height / cell);

      field.resize(cols, rows);
    };
    resize();

    const u = {
      metalRes: gl.getUniformLocation(metal, "uRes"),
      metalTime: gl.getUniformLocation(metal, "uTime"),
      field: gl.getUniformLocation(halftone, "uField"),
      fill: gl.getUniformLocation(halftone, "uFill"),
      grain: gl.getUniformLocation(halftone, "uGrain"),
      grid: gl.getUniformLocation(halftone, "uGrid"),
      cell: gl.getUniformLocation(halftone, "uCell"),
      highlight: gl.getUniformLocation(halftone, "uSquare"),
      time: gl.getUniformLocation(halftone, "uTime"),
    };

    const t0 = performance.now();
    let tint = 0;

    const paint = (now: number) => {
      const t = reduced ? 12 : (now - t0) / 1000;

      // Pass 1: the metal field, one texel per cell.
      gl.bindFramebuffer(gl.FRAMEBUFFER, field.fbo);
      gl.viewport(0, 0, cols, rows);
      bindQuad(metal);
      gl.uniform2f(u.metalRes, cols, rows);
      gl.uniform1f(u.metalTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Pass 2: the halftone, at screen resolution.
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      bindQuad(halftone);
      tint += ((highlightRef.current ? 1 : 0) - tint) * 0.08;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, field.texture);
      gl.uniform1i(u.field, 0);
      gl.uniform1f(u.fill, 0.44);
      gl.uniform1f(u.grain, 0.035);
      gl.uniform2f(u.grid, cols, rows);
      gl.uniform1f(u.cell, cell);
      gl.uniform1f(u.highlight, tint);
      gl.uniform1f(u.time, t);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let frame = 0;
    let running = false;
    const loop = (now: number) => {
      paint(now);
      frame = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running) return;
      if (reduced) {
        paint(performance.now());
        return;
      }
      running = true;
      frame = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (!running) paint(performance.now());
    });
    ro.observe(canvas);

    let onScreen = true;
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(canvas);
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className="absolute inset-0" />;
};

export default HeroCanvas;
