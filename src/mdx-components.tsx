import type { MDXComponents } from "mdx/types";

import { drukWide } from "@/lib/utils";

import Flow from "@/components/Flow";

/**
 * Element mapping for every note. Layout lives on `.article-body` in globals.css
 * (children are placed on the 12-column grid there); these only carry type.
 */

const Callout = ({
  label = "note",
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => (
  <aside className="article-callout">
    <span className="article-label">&#91;{label.toUpperCase()}&#93;</span>
    <div>{children}</div>
  </aside>
);

/** Two to four headline numbers, e.g. before/after of an optimisation. */
const Stats = ({ items }: { items: { value: string; label: string }[] }) => (
  <dl className="article-stats">
    {items.map((item) => (
      <div key={item.label}>
        <dt className="article-label">{item.label.toUpperCase()}</dt>
        <dd className={drukWide.className}>{item.value}</dd>
      </div>
    ))}
  </dl>
);

/** A plain-text diagram: flows and state machines read fine in monospace. */
const Diagram = ({
  caption,
  children,
}: {
  caption?: string;
  children: string;
}) => (
  <figure className="article-diagram">
    <pre>{children.trim()}</pre>
    {caption && <figcaption className="article-label">{caption}</figcaption>}
  </figure>
);

const components: MDXComponents = {
  h2: ({ children, ...props }) => (
    <h2 className={drukWide.className} {...props}>
      {children}
    </h2>
  ),
  a: ({ href = "", ...props }) => {
    const external = /^https?:\/\//.test(href);
    return (
      <a
        href={href}
        {...(external && { target: "_blank", rel: "noreferrer" })}
        {...props}
      />
    );
  },
  Callout,
  Stats,
  Diagram,
  Flow,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
