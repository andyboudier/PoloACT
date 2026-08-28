import type { MetadataRoute } from "next";

const base = "https://poloact.co.uk";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/features`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/polo-club-software`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/polo-tournament-software`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/how-polo-team-draws-work`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
