import type { MetadataRoute } from "next";

import { getWorkSlugs } from "@/lib/works";

const BASE = "https://azlhart.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/works`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/about`, changeFrequency: "yearly", priority: 0.7 },
    ...getWorkSlugs().map((slug) => ({
      url: `${BASE}/works/${slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
  ];
}
