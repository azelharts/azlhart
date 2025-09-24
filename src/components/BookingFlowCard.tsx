import { cn } from "@/lib/utils";
import Image from "next/image";

interface BookingFlowCardProps {
  number: number;
  title: string;
  icon: string;
  className?: string;
}

const BookingFlowCard = ({
  number,
  title,
  icon,
  className,
}: BookingFlowCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-sm border border-foreground/15 h-[540px] tablet:640px w-full p-6 font-[DrukWide] relative overflow-clip",
        className
      )}
    >
      <span className="text-2xl self-end">0{number}</span>
      <p className="text-[2.5rem] uppercase mt-12 leading-[120%]">{title}</p>
      <Image
        src={icon}
        alt=""
        width={200}
        height={200}
        className="absolute -right-2 -bottom-4 tablet:-right-6 tablet:-bottom-10 tablet:w-[256px] tablet:h-[256px]"
      />
    </div>
  );
};

export default BookingFlowCard;
