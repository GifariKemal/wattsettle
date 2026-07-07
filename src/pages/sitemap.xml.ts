import type { APIRoute } from "astro";
import { pages, href } from "../content/nav";

export const GET: APIRoute = ({ site }) => {
  const urls = pages
    .map((page) => {
      const loc = new URL(href(page.slug), site).href;
      return `<url><loc>${loc}</loc><changefreq>weekly</changefreq><priority>${page.slug ? "0.8" : "1.0"}</priority></url>`;
    })
    .join("");

  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
