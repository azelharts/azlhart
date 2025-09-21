import { cn } from "@/lib/utils";
import Image from "next/image";

interface TestimonialCardProps {
  review: string;
  profileUrl: string;
  username: string;
  role: string;
  companyProfileUrl: string;
  className?: string;
}

const TestimonialCard = ({
  review,
  profileUrl,
  username,
  role,
  companyProfileUrl,
  className,
}: TestimonialCardProps) => {
  return (
    <div
      className={cn(
        "rounded-sm border border-foreground/15 p-6 w-full flex flex-col gap-y-6 bg-white",
        className
      )}
    >
      <span className="text-lg">{review}</span>

      <div className="h-[1px] w-full border-t border-foreground/15" />

      <div className="flex gap-x-4 items-center">
        <Image
          src={profileUrl}
          width={800}
          height={800}
          alt=""
          className="w-[50px] h-[50px]"
        />
        <div className="flex flex-col gap-y-1">
          <span className="text-lg font-[BricolageGrotesqueBold]">
            {username}
          </span>
          <span className="text-sm">{role}</span>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
