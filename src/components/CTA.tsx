import ScrambleText from "./ScrambleText";

import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <div className="flex items-center justify-end gap-x-2">
      <ArrowRight
        width={14}
        height={14}
        strokeWidth={1}
        className="icon-responsive"
      />
      <button>
        <ScrambleText text="let's talk" />
      </button>
    </div>
  );
};

export default CTA;
