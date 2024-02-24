import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";
import { ProgressBar } from "./components/ProgressBar";
import { GlobalLoading } from "./components/GlobalLoading";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader() {
  // * If you had add any environment variables to your .env file, you can expose them here
  // * You'll also need to add the val
  return json({
    ENV: {
      SUPABASE_URL: process.env.SUPABASE_URL!,
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
      BASE_URL: process.env.BASE_URL!,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ProgressBar />
        <GlobalLoading />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <script src="https://kwesforms.com/v2/kwes-script.js" defer></script>
        <script
          src="https://cdn.usefathom.com/script.js"
          data-site="WKLTSOED"
          defer
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
      </body>
    </html>
  );
}
