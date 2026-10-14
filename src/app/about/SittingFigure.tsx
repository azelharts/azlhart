"use client";

import { useEffect, useRef } from "react";

import { gsap } from "@/lib/gsap";
import { HALFTONE, fieldTarget, link, quad } from "@/lib/gl";

/*
 * The figure, as signed distance functions, raymarched once per halftone
 * cell. A plumber in a cap sits with his legs out and his head bowed, the
 * pose from the reference. Every part is a sphere, ellipsoid or capsule;
 * materials are just luminances, so the result prints in the site's
 * white-on-black duotone.
 */
const FIGURE = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uAngle;
uniform float uJump;

float sdSphere(vec3 p, float r) { return length(p) - r; }
float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}
float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// Materials, as luminance.
const float RED = 0.45;
const float BLUE = 0.3;
const float WHITE = 0.95;
const float BROWN = 0.2;
const float GOLD = 0.85;
const float SKIN = 0.72;
const float DARK = 0.06;
const float HAIR = 0.22;

vec2 pick(vec2 a, vec2 b) { return a.x < b.x ? a : b; }

vec2 head(vec3 p) {
  vec2 d = vec2(sdSphere(p - vec3(0.0, 0.42, 0.02), 0.42), SKIN);
  d = pick(d, vec2(sdSphere(p - vec3(0.0, 0.3, 0.42), 0.16), SKIN));
  d = pick(d, vec2(sdSphere(vec3(abs(p.x), p.yz) - vec3(0.41, 0.38, 0.0), 0.1), SKIN));
  d = pick(d, vec2(sdEllipsoid(p - vec3(0.0, 0.18, 0.37), vec3(0.26, 0.07, 0.11)), DARK));
  d = pick(d, vec2(sdEllipsoid(p - vec3(0.0, 0.36, -0.12), vec3(0.4, 0.22, 0.26)), HAIR));
  // Cap: the top half of a sphere, plus a brim.
  float dome = max(sdSphere(p - vec3(0.0, 0.55, -0.02), 0.46), 0.5 - p.y);
  float brim = sdEllipsoid(p - vec3(0.0, 0.52, 0.36), vec3(0.4, 0.05, 0.22));
  float cap = min(dome, brim);
  // A plain white disc on the front of the cap.
  float disc = length((p - vec3(0.0, 0.78, 0.33)).xy);
  d = pick(d, vec2(cap, disc < 0.13 && p.z > 0.2 ? WHITE : RED));
  return d;
}

vec2 scene(vec3 p) {
  p.y -= uJump;
  vec3 m = vec3(abs(p.x), p.yz); // mirror for the paired parts

  float overalls = sdEllipsoid(p - vec3(0.0, 0.55, 0.0), vec3(0.5, 0.55, 0.42));
  float legs = sdCapsule(m, vec3(0.22, 0.3, 0.15), vec3(0.3, 0.3, 0.75), 0.17);
  vec2 d = vec2(smin(overalls, legs, 0.08), BLUE);

  float shirt = sdEllipsoid(p - vec3(0.0, 0.88, -0.05), vec3(0.48, 0.28, 0.37));
  float arms = sdCapsule(m, vec3(0.42, 0.85, 0.0), vec3(0.62, 0.36, 0.15), 0.13);
  d = pick(d, vec2(smin(shirt, arms, 0.06), RED));
  d = pick(d, vec2(sdSphere(m - vec3(0.66, 0.25, 0.22), 0.16), WHITE));
  d = pick(d, vec2(sdEllipsoid(m - vec3(0.32, 0.3, 0.95), vec3(0.2, 0.24, 0.24)), BROWN));
  d = pick(d, vec2(sdSphere(m - vec3(0.2, 0.78, 0.36), 0.06), GOLD));

  // Head bowed forward, nodding slowly as if half asleep.
  float nod = 0.38 + 0.05 * sin(uTime * 1.3);
  vec3 h = p - vec3(0.0, 1.0, 0.0);
  float c = cos(nod), s = sin(nod);
  h = vec3(h.x, c * h.y + s * h.z, -s * h.y + c * h.z);
  d = pick(d, head(h));
  return d;
}

vec3 normal(vec3 p) {
  const vec2 e = vec2(0.002, -0.002);
  return normalize(
    e.xyy * scene(p + e.xyy).x + e.yyx * scene(p + e.yyx).x +
    e.yxy * scene(p + e.yxy).x + e.xxx * scene(p + e.xxx).x);
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // Orbit camera around the figure.
  vec3 target = vec3(0.0, 0.85, 0.35);
  vec3 ro = target + vec3(sin(uAngle) * 5.2, 1.1, cos(uAngle) * 5.2);
  vec3 fw = normalize(target - ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * 2.1 + rt * uv.x + up * uv.y);

  float t = 0.0;
  vec2 hit = vec2(1.0, -1.0);
  for (int i = 0; i < 72; i++) {
    hit = scene(ro + rd * t);
    if (hit.x < 0.002 || t > 10.0) break;
    t += hit.x;
  }

  float L = 0.0;
  if (hit.x < 0.002) {
    vec3 p = ro + rd * t;
    vec3 n = normal(p);
    vec3 light = normalize(vec3(0.5, 0.9, 0.7));
    float diff = max(dot(n, light), 0.0);
    float spec = pow(max(dot(reflect(-light, n), -rd), 0.0), 24.0);
    float rim = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
    L = hit.y * (0.45 + 0.75 * diff) + spec * 0.3 + rim * 0.15;
  }
  gl_FragColor = vec4(vec3(clamp(L, 0.0, 1.0)), 1.0);
}
`;

/**
 * The about page's easter egg: a seated plumber in 3D, raymarched and printed
 * as small, tight halftone dots. Spins slowly, drags to rotate, jumps when
 * clicked.
 */
const SittingFigure = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Fresh canvas per run, as in the hero: a lost context can't be reused.
    const canvas = document.createElement("canvas");
    canvas.className =
      "block h-full w-full cursor-grab touch-pan-y active:cursor-grabbing";
    canvas.setAttribute("role", "img");
    canvas.setAttribute(
      "aria-label",
      "A 3D halftone figure of a plumber in a cap, sitting with his head bowed",
    );
    host.prepend(canvas);

    const gl = canvas.getContext("webgl", { antialias: false });
    if (!gl) {
      canvas.remove();
      return;
    }
    let figure: WebGLProgram;
    let halftone: WebGLProgram;
    try {
      figure = link(gl, FIGURE);
      halftone = link(gl, HALFTONE);
    } catch {
      canvas.remove();
      return;
    }
    const bind = quad(gl);
    const field = fieldTarget(gl);

    const u = {
      res: gl.getUniformLocation(figure, "uRes"),
      time: gl.getUniformLocation(figure, "uTime"),
      angle: gl.getUniformLocation(figure, "uAngle"),
      jump: gl.getUniformLocation(figure, "uJump"),
      field: gl.getUniformLocation(halftone, "uField"),
      grid: gl.getUniformLocation(halftone, "uGrid"),
      cell: gl.getUniformLocation(halftone, "uCell"),
      square: gl.getUniformLocation(halftone, "uSquare"),
      htime: gl.getUniformLocation(halftone, "uTime"),
      fill: gl.getUniformLocation(halftone, "uFill"),
      grain: gl.getUniformLocation(halftone, "uGrain"),
      clear: gl.getUniformLocation(halftone, "uClear"),
    };

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Small, tight dots: about 4 CSS px apart.
    let cell = 4 * dpr;
    let cols = 1;
    let rows = 1;

    const resize = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      cell = (width < 400 ? 3.5 : 4) * dpr;
      cols = Math.ceil(canvas.width / cell);
      rows = Math.ceil(canvas.height / cell);
      field.resize(cols, rows);
    };
    resize();

    let angle = 0.35;
    let velocity = reduced ? 0 : 0.35;
    let dragging = false;
    let lastX = 0;
    let moved = 0;
    let jump = 0;
    let jumping = false;
    const t0 = performance.now();
    let last = t0;

    const paint = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!dragging) {
        angle += velocity * dt;
        velocity += ((reduced ? 0 : 0.35) - velocity) * Math.min(1, dt * 1.5);
      }
      if (jumping) {
        jump += dt / 0.6;
        if (jump >= 1) {
          jump = 0;
          jumping = false;
        }
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, field.fbo);
      gl.viewport(0, 0, cols, rows);
      bind(figure);
      gl.uniform2f(u.res, cols, rows);
      gl.uniform1f(u.time, reduced ? 0 : (now - t0) / 1000);
      gl.uniform1f(u.angle, angle);
      gl.uniform1f(u.jump, Math.sin(jump * Math.PI) * 0.5);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      bind(halftone);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, field.texture);
      gl.uniform1i(u.field, 0);
      gl.uniform2f(u.grid, cols, rows);
      gl.uniform1f(u.cell, cell);
      gl.uniform1f(u.square, 0);
      gl.uniform1f(u.htime, 0);
      gl.uniform1f(u.fill, 0.48);
      gl.uniform1f(u.grain, 0);
      gl.uniform1f(u.clear, 1);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    let frame = 0;
    let visible = false;
    const loop = (now: number) => {
      paint(now);
      if (visible && !reduced) frame = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(() => {
      resize();
      paint(performance.now());
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(loop);
      }
    });
    io.observe(canvas);

    // Drag to spin; a flick keeps spinning and eases back to the idle spin.
    const down = (e: PointerEvent) => {
      dragging = true;
      moved = 0;
      lastX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      moved += Math.abs(dx);
      angle -= dx * 0.01;
      velocity = -dx * 0.5;
      if (reduced) paint(performance.now());
    };
    const up = () => {
      dragging = false;
      // A click (no real drag): he jumps.
      if (moved >= 4 || jumping) return;
      jumping = true;
      jump = 0;
      if (reduced) return;
      if (!visible) frame = requestAnimationFrame(loop);
      const label = labelRef.current;
      if (!label) return;
      gsap.fromTo(
        label,
        { autoAlpha: 1, y: 0 },
        { y: -24, autoAlpha: 0, duration: 0.9, delay: 0.3, ease: "power2.out" },
      );
      gsap.to(label, {
        duration: 0.4,
        ease: "none",
        scrambleText: { text: "+1 UP", chars: "azlhart0123456789", speed: 0.6 },
      });
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <figure className="flex flex-col gap-y-3">
      <div ref={hostRef} className="relative aspect-square w-full">
        <span
          ref={labelRef}
          aria-hidden="true"
          className="pointer-events-none invisible absolute top-[14%] left-1/2 -translate-x-1/2 text-sm font-bold"
        >
          +1 UP
        </span>
      </div>
      <figcaption className="article-label flex justify-between gap-4">
        <span>&#91;FIG. ✱&#93; Me, after a long sprint</span>
        <span>Drag to spin, click to jump</span>
      </figcaption>
    </figure>
  );
};

export default SittingFigure;
