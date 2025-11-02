import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface CurrentTimeProps {
  className?: string;
}

const CurrentTime = ({ className }: CurrentTimeProps) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const timeString = now.toLocaleTimeString("en-US", {
        timeZone: "Asia/Makassar",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      setTime(timeString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return <div className={cn("", className)}>{time || "00:00:00"}</div>;
};

export default CurrentTime;
