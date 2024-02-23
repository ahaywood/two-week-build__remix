import { generateRobotsTxt } from "@nasa-gcn/remix-seo";

export function loader() {
  return generateRobotsTxt([
    { type: "sitemap", value: `${process.env.BASE_URL}/sitemap.xml` },
  ]);
}
