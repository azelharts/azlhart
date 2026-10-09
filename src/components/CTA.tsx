import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
interface CTAProps {
  text: string;
  href?: string;
  className?: string;
  ctaIcon?: boolean;
}
export default function CTA({
  text,
  href = "/contact",
  className,
  ctaIcon = false,
}: CTAProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-end gap-2 underline-offset-8 hover:underline",
        className,
      )}
    >
      <span>{text}</span>
      <ArrowUpRight aria-hidden="true" size={ctaIcon ? 24 : 16} />
    </Link>
  );
}
