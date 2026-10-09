import { drukWide } from "@/lib/utils";
export default function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{label}</p>
      <h1 className={drukWide.className}>{title}</h1>
      <div className="intro-copy">{children}</div>
    </header>
  );
}
