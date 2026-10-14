import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { getWork, getWorkSlugs, getWorks } from "@/lib/works";
import { drukWide } from "@/lib/utils";

import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import ScrambleText from "@/components/ScrambleText";
import TransitionLink from "@/components/TransitionLink";

import ArticleMotion from "./ArticleMotion";
import NextWork from "./NextWork";
import ArticleToc from "./ArticleToc";
import WorkIntro from "./WorkIntro";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export const generateStaticParams = () =>
  getWorkSlugs().map((slug) => ({ slug }));

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const result = await getWork((await params).slug);
  if (!result) return {};

  const { title, summary } = result.work;
  return {
    title: `${title} | Mario Daruranto`,
    description: summary,
    openGraph: { type: "article", title, description: summary },
    twitter: { title, description: summary },
  };
};

const WorkPage = async ({ params }: Props) => {
  const result = await getWork((await params).slug);
  if (!result) notFound();

  const { Content, work } = result;

  // Wraps around, so the last work still points somewhere.
  const works = await getWorks();
  const next = works[work.index % works.length];

  return (
    <main className="flex flex-col gap-y-32">
      <ReadingProgress targetId="article-body" />

      <article className="max-w-container px-container mx-auto flex w-full flex-col gap-y-20">
        <WorkIntro work={work} />

        <div className="relative">
          <ArticleToc targetId="article-body" />
          <ArticleMotion targetId="article-body" />
          <div id="article-body" className="article-body">
            <Content />
          </div>
        </div>

        {/* Byline, the way a Codrops article closes. */}
        <aside className="custom-grid">
          <div className="tablet:col-span-6 tablet:col-start-2 desktop:col-span-6 desktop:col-start-4 col-span-full flex items-start gap-x-5 border-y border-white/25 py-8">
            <span
              className={`bg-accent flex size-14 shrink-0 items-center justify-center rounded-full text-lg text-black ${drukWide.className}`}
            >
              M
            </span>
            <div className="flex flex-col gap-y-3">
              <span className="article-label">WRITTEN BY</span>
              <p className="text-lg font-semibold">Mario Daruranto</p>
              <p className="p-responsive !leading-[160%] text-white/60">
                Frontend engineer who loves fluid web motion and interfaces that
                feel the same on every device.
              </p>
              <div className="p-responsive flex gap-x-6">
                <TransitionLink href="/works">
                  <ScrambleText text="More works" />
                </TransitionLink>
                <a href="mailto:mariodaruranto68@gmail.com">
                  <ScrambleText text="Email" />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </article>

      {next.slug !== work.slug && (
        <section className="max-w-container px-container mx-auto w-full">
          <NextWork work={next} />
        </section>
      )}

      <Footer />
    </main>
  );
};

export default WorkPage;
