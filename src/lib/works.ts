import type { ComponentType } from "react";

export interface WorkMeta {
  title: string;
  /** One or two sentences shown on the index and as the meta description. */
  summary: string;
  /** The product, anonymised: never a client or employer name. */
  context: string;
  role: string;
  stack: string[];
  year: string;
  readingTime: string;
  /** "In short": three one-line takeaways shown above the article. */
  highlights?: string[];
}

export interface Work extends WorkMeta {
  slug: string;
  index: number;
}

/**
 * Display order of the works. Each slug maps to src/content/works/<slug>.mdx,
 * which exports `metadata: WorkMeta` alongside its default component.
 */
const SLUGS: readonly string[] = [
  "crash-safe-recorder",
  "mediarecorder-in-the-wild",
  "webm-remuxer",
  "hardening-a-shared-recorder",
  "guided-tour-engine",
  "candidate-blacklist",
  "recording-lease",
  "honest-ai-progress",
  "calendar-webhooks",
  "xss-hardening",
  "registration-windows",
  "translations-admin",
];

type WorkModule = { default: ComponentType; metadata: WorkMeta };

const load = (slug: string) =>
  import(`@/content/works/${slug}.mdx`) as Promise<WorkModule>;

export const getWorkSlugs = (): readonly string[] => SLUGS;

export const getWorks = async (): Promise<Work[]> =>
  Promise.all(
    SLUGS.map(async (slug, index) => ({
      ...(await load(slug)).metadata,
      slug,
      index: index + 1,
    })),
  );

export const getWork = async (slug: string) => {
  const index = SLUGS.indexOf(slug);
  if (index === -1) return null;

  const { default: Content, metadata } = await load(slug);
  return { Content, work: { ...metadata, slug, index: index + 1 } as Work };
};

/** Zero-padded position, as shown in every list: 1 -> "01". */
export const pad = (n: number) => String(n).padStart(2, "0");
