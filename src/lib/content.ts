export const projects = [
  {
    slug: "bpbd-kota-kupang",
    name: "SIncan-KotaKu",
    platform: "Next.js",
    year: "2025",
    category: "Public-information application",
    image: "/images/projects/bpbd-kota-kupang.png",
    imageAlt: "SIncan-KotaKu public information homepage",
    repo: "https://github.com/azelharts/bpbd-kota-kupang",
    demo: "https://bpbd-kota-kupang.vercel.app",
    demoLabel: "Explore public site",
    summary:
      "A disaster-information portal pairing a public-facing website with tools for managing incident records.",
    context:
      "Disaster information needs two clear interfaces: one for the public to find information, and another for staff to maintain structured records.",
    features: [
      "Public information pages and a weather information section",
      "An incident-management interface with filtering and pagination",
      "Incident entry and editing routes, plus a separate sign-in flow",
    ],
    relevance:
      "Relevant to organizations that need a public website connected to an internal content or operations workflow.",
    boundary:
      "Public-source application project. This overview covers the implemented website and management interfaces.",
    stack: "Next.js · TypeScript · TanStack Query",
  },
  {
    slug: "hirestack",
    name: "Hirestack",
    platform: "Next.js",
    year: "2025",
    category: "Recruitment application",
    image: "/images/projects/hirestack.png",
    imageAlt: "Hirestack public sign-in screen",
    repo: "https://github.com/azelharts/hirestack",
    demo: "https://hirestack-gamma.vercel.app/login",
    demoLabel: "View sign-in preview",
    summary:
      "A recruitment application with separate workflows for recruiters and job seekers.",
    context:
      "Recruiters and applicants have different tasks. The application separates publishing and candidate management from job discovery and applications.",
    features: [
      "Role-specific recruiter and job-seeker dashboards",
      "Job-posting management and candidate-management routes",
      "Application forms, Supabase authentication and Zod validation",
    ],
    relevance:
      "Relevant to businesses building multi-role portals, application flows or custom operational products.",
    boundary:
      "Application project. The public preview opens at sign-in; role-specific dashboard workflows require authentication.",
    stack: "Next.js · React · Supabase · TypeScript",
  },
  {
    slug: "aetheria",
    name: "Aetheria",
    platform: "Next.js",
    year: "2024",
    category: "Thesis prototype",
    image: "/images/projects/aetheria.png",
    imageAlt: "Aetheria mobile prototype homepage",
    repo: "https://github.com/azelharts/aetheria",
    demo: "https://aetheria-delta.vercel.app",
    demoLabel: "Explore mobile prototype",
    summary:
      "A mobile-focused thesis prototype exploring journaling, AI-generated summaries and mood visualization.",
    context:
      "The prototype brings journal writing and reviewing entries into one interface, with an emphasis on an approachable mobile experience.",
    features: [
      "Google sign-in and personal journal routes",
      "Journal-entry interface with AI-generated summary and visualization states",
      "Profile, journal history and bilingual usage guidance",
    ],
    relevance:
      "Shows experience connecting interactive interfaces, authenticated user journeys and AI-assisted features in a research prototype.",
    boundary:
      "Mobile-focused thesis prototype, under development. This overview presents the interface and implemented features; research outcomes are not included.",
    stack: "Next.js · TypeScript · NextAuth · Framer Motion",
  },
  {
    slug: "onlytheflames",
    name: "Onlytheflames",
    platform: "Next.js",
    year: "2025",
    category: "Personal portfolio",
    image: "/images/projects/onlytheflames.png",
    imageAlt: "Onlytheflames personal portfolio homepage",
    repo: "https://github.com/azelharts/onlytheflames",
    demo: "https://onlytheflames.vercel.app",
    demoLabel: "Explore portfolio",
    summary:
      "A personal portfolio exploring expressive typography, scroll interactions and motion-driven presentation.",
    context:
      "The site uses movement and a distinctive typographic identity to introduce Mario’s work in frontend and full-stack development.",
    features: [
      "GSAP-driven scrolling typography and animation",
      "Desktop particle treatment with separate mobile and Safari behavior",
      "Project index and reusable presentation components",
    ],
    relevance:
      "Relevant to brands looking for expressive frontend implementation and custom interaction design.",
    boundary:
      "Self-initiated portfolio work. This demonstrates an implementation approach rather than a measured commercial result.",
    stack: "Next.js · TypeScript · GSAP · Lenis",
  },
];
export const services = [
  {
    title: "Website design",
    fit: "For brands that need a clearer, more distinctive digital presence.",
    items: [
      "Page structure and user journeys",
      "Visual direction and responsive layouts",
      "Interaction design and development handoff",
    ],
    image: "/images/service-1.jpg",
  },
  {
    title: "Framer websites",
    fit: "For marketing teams looking for a visual website they can update.",
    items: [
      "Responsive Framer implementation",
      "CMS structure for repeatable content",
      "Launch preparation and editor walkthrough",
    ],
    image: "/images/service-2.jpg",
  },
  {
    title: "Next.js development",
    fit: "For teams whose website needs custom functionality and integrations.",
    items: [
      "Reusable interface components",
      "Agreed integrations and application flows",
      "Performance, accessibility and launch checks",
    ],
    image: "/images/service-3.jpg",
  },
];
export const process = [
  {
    title: "Discover",
    description:
      "Align on your audience, business goals, existing content and technical needs. Define the scope, deliverables, budget and schedule before work begins.",
  },
  {
    title: "Design",
    description:
      "Agree on the page structure and visual direction. Review responsive layouts with a clear point of contact for consolidated feedback.",
  },
  {
    title: "Build & review",
    description:
      "Bring the approved design into Framer or Next.js. Review the real experience across screen sizes, including navigation, forms and content.",
  },
  {
    title: "Launch & handover",
    description:
      "Complete the agreed launch checks and hand over the site. Confirm editing access, documentation and any ongoing support in the project scope.",
  },
];
