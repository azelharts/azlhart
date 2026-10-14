import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";

const YEAR = 60 * 60 * 24 * 365;

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Notes are authored as .mdx files under src/content and imported as pages.
  pageExtensions: ["ts", "tsx", "md", "mdx"],

  images: {
    // AVIF first — roughly 30% smaller than WebP at equal quality. Next falls
    // back to WebP, then the original, based on the browser's Accept header.
    formats: ["image/avif", "image/webp"],
    // Nothing on this page renders wider than the viewport, so the default
    // 3840px entry only buys oversized variants nobody requests.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [48, 64, 96, 128, 256, 384],
    minimumCacheTTL: YEAR,
    remotePatterns: [
      { protocol: "https", hostname: "framerusercontent.com" },
      { protocol: "https", hostname: "thumbs.dreamstime.com" },
    ],
  },

  experimental: {
    // Rewrites barrel imports to deep paths so a single icon doesn't pull the
    // whole library into the client bundle.
    optimizePackageImports: ["lucide-react"],
  },

  async headers() {
    return [
      {
        // Without this, Lighthouse flags "Serve static assets with an efficient
        // cache policy" — Next only sets long-lived caching on /_next/static,
        // not on anything served straight out of /public.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp4|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${YEAR}, immutable`,
          },
        ],
      },
    ];
  },
};

// Highlighting happens at build time, so an article ships as static HTML with
// no highlighter in the client bundle.
const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      // Heading ids feed the article's table of contents.
      rehypeSlug,
      [
        rehypePrettyCode,
        { theme: "vesper", keepBackground: false, defaultLang: "ts" },
      ],
    ],
  },
});

export default withMDX(nextConfig);
