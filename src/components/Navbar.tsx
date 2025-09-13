import { ArrowRight } from "lucide-react";
import Link from "next/link";
import RollingText from "./RollingText";

const Navbar = () => {
  return (
    <nav className="fixed max-w-[1580px] top-[20px] desktop:top-9 px-[20px] tablet:px-9 left-1/2 -translate-x-1/2 grid grid-cols-4 tablet:grid-cols-8 w-full z-50">
      <div className="flex flex-col items-end gap-y-[6px] tablet:hidden col-end-5">
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
        <div className="w-6 h-[2px] rounded-full bg-black fill-width" />
      </div>
      <div className="hidden tablet:flex justify-end gap-x-11 col-span-3 col-end-7">
        <div className="flex items-center gap-x-6 fade-up-2">
          <span>01</span>
          <RollingText href="/work" className="font-bold">
            work
          </RollingText>
        </div>
        <div className="flex items-center gap-x-6 fade-up-2">
          <span>02</span>
          <RollingText href="/about" className="font-bold">
            about
          </RollingText>
        </div>
      </div>
      <div className="hidden tablet:flex justify-end col-span-2 col-end-9">
        <div className="flex items-center gap-x-6 cursor-pointer fade-up-2">
          <ArrowRight width={20} height={20} strokeWidth={1} />
          <RollingText as="button" className="font-bold">
            get in touch
          </RollingText>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
