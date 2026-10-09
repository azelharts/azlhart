export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://azlhart.vercel.app";
// The owner confirmed this is a planned domain, not an active inbox.
export const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "hello@azlhart.com";
export const contactEnabled = Boolean(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
