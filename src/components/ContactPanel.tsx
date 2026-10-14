"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { X } from "lucide-react";

import { gsap, useGSAP, EASE, ScrollSmoother } from "@/lib/gsap";
import { cn, drukWide } from "@/lib/utils";

import CurrentTime from "./CurrentTime";
import DotSurface, { type DotSurfaceHandle } from "./DotSurface";
import ScrambleText from "./ScrambleText";

const EMAIL = "mariodaruranto68@gmail.com";

const TOPICS = [
  "Full-time role",
  "Freelance project",
  "Collaboration",
  "Just saying hi",
] as const;

const ContactContext = createContext<(() => void) | null>(null);

/** Opens the "let's talk" panel from anywhere in the tree. */
export const useContactPanel = () => {
  const open = useContext(ContactContext);
  if (!open) throw new Error("useContactPanel outside <ContactPanel>");
  return open;
};

/**
 * The "let's talk" panel: a sheet that slides over the right side of any page.
 *
 * There's no backend behind the site, so the form composes an email instead
 * of posting anywhere: the visitor's own mail client opens with the subject
 * and body filled in. The address is one click to copy for anyone who'd
 * rather write from scratch.
 */
const ContactPanel = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>(TOPICS[0]);
  const [copied, setCopied] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const wasOpen = useRef(false);
  const isOpenRef = useRef(false);

  const titleId = useId();

  const open = useCallback(() => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  const dots = useRef<DotSurfaceHandle>(null);
  const lastPointer = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  // The content's entrance: items rise in, the heading decodes itself.
  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true, defaults: { ease: EASE } })
        .fromTo(
          ".cp-item",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05 },
        );
      gsap.utils.toArray<HTMLElement>(".cp-scramble").forEach((el, i) =>
        tl.current?.to(
          el,
          {
            duration: 0.8,
            ease: "none",
            scrambleText: {
              text: el.dataset.text ?? "",
              chars: "azlhart0123456789#/",
              speed: 0.5,
              revealDelay: 0.2,
            },
          },
          0.1 + i * 0.12,
        ),
      );
    },
    { scope: rootRef },
  );

  const { contextSafe } = useGSAP({ scope: rootRef });

  // Open: the panel is printed as dots growing out from the click that opened
  // it, then the content arrives. Close runs the same steps backwards.
  useEffect(() => {
    const smoother = ScrollSmoother.get();

    const run = contextSafe((opening: boolean) => {
      const point = lastPointer.current;
      const origin =
        point && dots.current
          ? dots.current.originOf({ clientX: point.x, clientY: point.y })
          : "top";

      if (opening) {
        gsap.set(rootRef.current, { visibility: "visible" });
        gsap.to(".cp-backdrop", { autoAlpha: 1, duration: 0.5 });
        gsap.set(".cp-item", { autoAlpha: 0 });
        dots.current?.play(1, { origin, spread: 0.45, cellDuration: 0.28 });
        gsap.delayedCall(0.35, () => tl.current?.play(0));
      } else {
        tl.current?.pause();
        gsap.to(".cp-item", { autoAlpha: 0, duration: 0.2 });
        gsap.to(".cp-backdrop", { autoAlpha: 0, duration: 0.5, delay: 0.2 });
        dots.current
          ?.play(0, { origin, spread: 0.4, cellDuration: 0.25 })
          .then(() => {
            if (!isOpenRef.current)
              gsap.set(rootRef.current, { visibility: "hidden" });
          });
      }
    });

    if (isOpen) {
      run(true);
      smoother?.paused(true);
      document.documentElement.style.overflow = "hidden";
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (wasOpen.current) {
      run(false);
      smoother?.paused(false);
      document.documentElement.style.overflow = "";
      returnFocus.current?.focus?.();
    }
    wasOpen.current = isOpen;
    isOpenRef.current = isOpen;
  }, [isOpen, contextSafe]);

  // Escape closes; Tab stays inside the panel while it's open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        "button, a[href], input, textarea",
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const send = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const subject = `${topic}${name ? ` from ${name}` : ""}`;
    const body =
      `${message}\n\n${name}\n${String(data.get("email") ?? "")}`.trim();
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <ContactContext.Provider value={open}>
      {children}

      <div ref={rootRef} className="invisible fixed inset-0 z-[70]">
        <div
          className="cp-backdrop invisible absolute inset-0 bg-black/60 opacity-0 backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />

        <section
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          inert={!isOpen}
          className="tablet:w-[560px] tablet:top-3 tablet:right-3 tablet:bottom-3 absolute inset-y-0 right-0 flex w-full flex-col text-[#0a0a0a]"
        >
          <DotSurface ref={dots} color="#f1efe9" cell={18} />
          {/* Sized to fit the viewport: the panel never scrolls. */}
          <div className="relative flex flex-1 flex-col overflow-hidden">
            <div className="tablet:p-8 tablet:gap-y-8 flex flex-1 flex-col gap-y-6 p-5">
              <header className="cp-item flex items-center justify-between text-xs">
                <span className="text-black/50">&#91;CONTACT&#93;</span>
                <button
                  type="button"
                  onClick={close}
                  data-autofocus
                  className="flex items-center gap-x-2"
                >
                  <ScrambleText text="close" />
                  <X size={14} strokeWidth={1.5} />
                </button>
              </header>

              <div className="tablet:gap-y-5 flex flex-col gap-y-3">
                <h2
                  id={titleId}
                  className={`cp-item tablet:text-6xl text-4xl !leading-[95%] uppercase ${drukWide.className}`}
                >
                  <span className="cp-scramble block" data-text="Let's">
                    Let&apos;s
                  </span>
                  <span className="cp-scramble block" data-text="talk.">
                    talk.
                  </span>
                </h2>
                <p className="cp-item tablet:text-base max-w-[40ch] text-sm !leading-[155%] text-black/70">
                  Hiring for a frontend role, or building something that has to
                  hold up in production? Tell me a little about it and I&apos;ll
                  get back to you within a couple of days.
                </p>
              </div>

              <form
                onSubmit={send}
                className="tablet:gap-y-7 flex flex-col gap-y-5"
              >
                <fieldset className="cp-item flex flex-col gap-y-3">
                  <legend className="tablet:mb-3 mb-2 text-xs text-black/50">
                    WHAT&apos;S THIS ABOUT?
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={topic === t}
                        onClick={() => setTopic(t)}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-normal transition-colors duration-300",
                          topic === t
                            ? "border-[#0a0a0a] bg-[#0a0a0a] text-white"
                            : "border-black/25 hover:border-black",
                        )}
                      >
                        <ScrambleText text={t} className="font-normal" />
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className="cp-item grid grid-cols-2 gap-5">
                  <Field label="Your name" name="name" autoComplete="name" />
                  <Field
                    label="Your email"
                    name="email"
                    type="email"
                    autoComplete="email"
                  />
                </div>
                <div className="cp-item">
                  <Field label="Message" name="message" multiline required />
                </div>

                <button
                  type="submit"
                  className="cp-item group tablet:py-4 flex items-center justify-between bg-[#0a0a0a] px-5 py-3.5 text-left text-white transition-colors duration-300 hover:bg-black/80"
                >
                  <ScrambleText text="send message" />
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    &rarr;
                  </span>
                </button>
              </form>

              <footer className="cp-item tablet:pt-6 mt-auto grid grid-cols-[1fr_auto] gap-4 border-t border-black/15 pt-4 text-xs">
                <div className="flex flex-col gap-y-2">
                  <span className="text-black/50">OR WRITE DIRECTLY</span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="text-left text-sm"
                    aria-live="polite"
                  >
                    <ScrambleText
                      text={copied ? "copied to clipboard" : EMAIL}
                    />
                  </button>
                </div>
                <div className="flex flex-col items-end gap-y-2 text-right">
                  <span className="text-black/50">KUPANG, GMT+8</span>
                  <span className="flex items-center gap-x-2 text-sm">
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#0a0a0a] opacity-75 motion-reduce:hidden" />
                      <span className="relative inline-flex size-2 rounded-full bg-[#0a0a0a]" />
                    </span>
                    <CurrentTime />
                  </span>
                </div>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </ContactContext.Provider>
  );
};

const Field = ({
  label,
  name,
  type = "text",
  multiline = false,
  required = false,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
}) => {
  const id = useId();
  const className =
    "peer w-full resize-none border-b border-black/25 bg-transparent pt-6 pb-2 text-base outline-none transition-colors focus:border-black placeholder-shown:border-black/25";
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={2}
          required={required}
          placeholder=" "
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          placeholder=" "
          className={className}
        />
      )}
      {/* Floats up out of the way once the field has focus or content. */}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-6 left-0 origin-left text-base text-black/50 transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  );
};

export default ContactPanel;
