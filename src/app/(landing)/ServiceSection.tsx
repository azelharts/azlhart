"use client";

import ServiceCard from "@/components/ServiceCard";
import {
  Activity,
  ArrowUpRight,
  CodeXml,
  PaintbrushVertical,
} from "lucide-react";

const services = [
  {
    type: "design",
    services: ["UI", "UX", "Design System", "Prototype"],
    icon: ArrowUpRight,
  },
  {
    type: "develop",
    services: ["Website", "WebApp", "API", "CMS"],
    icon: ArrowUpRight,
  },
  {
    type: "go-live",
    services: ["Hosting", "SEO", "Analytics", "CI/CD"],
    icon: ArrowUpRight,
  },
];

const ServiceSection = () => {
  return (
    <section className="h-fit hidden flex-col sub-sections">
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid gap-y-8">
          {/* Header */}
          <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-end font-[DrukWide] col-span-full gap-y-8">
            <h2 className="section-sub-heading self-start desktop:self-auto desktop:max-w-[75%]">
              Move Your <br />
              Brand <br className="desktop:hidden" />
              Forward
            </h2>
            <span className="section-quote self-end desktop:self-auto">
              &quot;CREATIVE SYSTEM&quot;
            </span>
          </div>

          {/* Service Cards */}
          <div className="flex flex-col desktop:flex-row col-span-full mt-16">
            {services.map((service) => (
              <ServiceCard
                key={service.type}
                type={service.type}
                services={service.services}
                icon={service.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
