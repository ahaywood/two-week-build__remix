// Reference: https://camchenry.com/blog/how-to-add-a-rss-feed-to-a-remix-app

import { LoaderFunction } from "@remix-run/node";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

export type RssEntry = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  author?: string;
  guid?: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = createSupabaseServerClient(request);
  const updateResults = await supabase
    .from("updates")
    .select("*, projects(*, users(*))")
    .order("created_at", { ascending: false });
  console.log({ updateResults });

  function generateRss({ entries }: { entries: RssEntry[] }): string {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>${constants.OG_TITLE}</title>
      <link>${constants.OG_DOMAIN}</link>
      <description>${constants.OG_DESCRIPTION}</description>
      <language>en-us</language>
      <ttl>60</ttl>
      <atom:link href="${
        constants.OG_DOMAIN
      }/rss.xml" rel="self" type="application/rss+xml" />
      ${entries
        .map(
          (entry) => `
        <item>
          <title><![CDATA[${entry.title}]]></title>
          <description><![CDATA[${entry.description}]]></description>
          <pubDate>${entry.pubDate}</pubDate>
          <link>${entry.link}</link>
          ${entry.guid ? `<guid isPermaLink="false">${entry.guid}</guid>` : ""}
        </item>`
        )
        .join("")}
    </channel>
  </rss>`;
  }

  const entries = updateResults?.data?.map((update) => {
    console.log({ update });
    return {
      title: `${update.projects.name} Update by ${update.projects.users.name}`,
      link: `${constants.OG_DOMAIN}/updates/${update.id}`,
      description: update.content,
      pubDate: new Date(update.created_at).toUTCString(),
      guid: `${constants.OG_DOMAIN}/updates/${update.id}`,
    };
  });
  console.log({ entries });

  const feed = generateRss({
    entries: [...entries],
  });

  return new Response(feed, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=2419200",
    },
  });
};
