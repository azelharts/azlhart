import Image from "next/image";
import Link from "next/link";
import { projects } from "@/lib/content";
export default function ProjectGrid() {
  return (
    <div className="project-grid">
      {projects.map((project) => (
        <Link
          className="project-card"
          key={project.slug}
          href={`/works/${project.slug}`}
        >
          <div className="project-image">
            <Image
              src={project.image}
              alt={`${project.name} project cover`}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
            />
          </div>
          <div className="project-caption">
            <h2>{project.name}</h2>
            <span>
              {project.platform} · {project.year} ↗
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
