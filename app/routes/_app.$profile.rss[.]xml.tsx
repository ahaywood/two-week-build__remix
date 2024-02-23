// Reference: https://camchenry.com/blog/how-to-add-a-rss-feed-to-a-remix-app

import { LoaderFunction } from "@remix-run/node";

export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
};

export const loader: LoaderFunction = async () => {
  const feed = generateRss();

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};

export function generateRss(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Two Week Build</title>
  </channel>
</rss>`;
}
