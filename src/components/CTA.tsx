import { cn } from "@/lib/utils";
import ScrambleText from "./ScrambleText";

import { ArrowRight } from "lucide-react";

interface CTAProps {
  text: string;
  className?: string;
  ctaIcon?: boolean;
}

const CTA = ({ text, className, ctaIcon = false }: CTAProps) => {
  return (
    <div className={cn("flex items-center justify-end gap-x-2", className)}>
      <ArrowRight
        width={14}
        height={14}
        strokeWidth={1}
        className={ctaIcon ? "cta-icon-responsive" : "icon-responsive"}
      />
      <button>
        <ScrambleText text={text} />
      </button>
    </div>
  );
};

export default CTA;
