import type { NextConfig } from "next";

const DAY = 60 * 60 * 24;

const nextConfig: NextConfig = {
  poweredByHeader: false,

  images: {
    // AVIF first — roughly 30% smaller than WebP at equal quality. Next falls
    // back to WebP, then the original, based on the browser's Accept header.
    formats: ["image/avif", "image/webp"],
    // Nothing on this page renders wider than the viewport, so the default
    // 3840px entry only buys oversized variants nobody requests.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [48, 64, 96, 128, 256, 384],
    minimumCacheTTL: DAY,
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
        // not on anything served straight out of /public. These filenames are
        // not content-hashed, so revalidate rather than marking them immutable.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|mp4|woff2|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${DAY}, must-revalidate`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
