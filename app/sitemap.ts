import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gulgo.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/solutions",
    "/score-pass",
    "/methode",
    "/entreprises",
    "/a-propos",
    "/actualites",
    "/login",
    "/register",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
