import { siteUrl } from "@/lib/site";
import type { MetadataRoute } from "next";
import { projects } from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about",
    "/services",
    "/works",
    "/archive",
    "/contact",
    "/privacy",
    ...projects.map((p) => `/works/${p.slug}`),
  ].map((path) => ({ url: `${siteUrl}${path}` }));
}
