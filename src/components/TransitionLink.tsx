"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ComponentProps,
} from "react";

type Navigate = (href: string) => boolean;
const NavigationContext = createContext<Navigate>(() => false);

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const pending = useRef<(() => void) | null>(null);
  const active = useRef(false);
  useEffect(() => {
    pending.current?.();
    pending.current = null;
  }, [pathname]);
  useEffect(
    () => () => {
      pending.current?.();
    },
    [],
  );
  const navigate: Navigate = (href) => {
    if (
      !document.startViewTransition ||
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      href === pathname
    )
      return false;
    if (active.current) return true;
    active.current = true;
    const transition = document.startViewTransition(
      () =>
        new Promise<void>((resolve) => {
          // Resolve after the new route commits. The timeout also releases a failed navigation.
          const timer = window.setTimeout(resolve, 1800);
          pending.current = () => {
            clearTimeout(timer);
            resolve();
          };
          router.push(href);
        }),
    );
    void transition.finished
      .catch(() => {})
      .finally(() => {
        active.current = false;
      });
    return true;
  };
  return (
    <NavigationContext.Provider value={navigate}>
      {children}
    </NavigationContext.Provider>
  );
}

export default function TransitionLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  const navigate = useContext(NavigationContext);
  return (
    <Link
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        )
          return;
        const href = String(props.href);
        if (href.startsWith("/") && !href.includes("#") && navigate(href))
          event.preventDefault();
      }}
    />
  );
}
