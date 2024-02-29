import Banner from "~/components/Banner";
import { LeaderboardListItem } from "./LeaderboardListItem";
import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { useLoaderData } from "@remix-run/react";

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Need to load data for the current project only
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.rpc("project_update_count");
  if (error) console.error(error);
  return { data };
}

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  console.log({ data });
  return (
    <>
      <Banner>
        <div className="page-grid">
          <div className="wrapper">
            <h1>Leaderboard</h1>
          </div>
        </div>
      </Banner>
      <div className="page-grid">
        <div className="col-start-3 col-span-6">
          <p className="text-battleshipGray font-sans text-lg leading-normal font-normal mb-10">
            The only requirement to get on the leaderboard is to post a daily
            update. The point is not <em>what</em> you build, but getting in a
            habit of shipping daily. Small wins add up!
          </p>
          <div className="flex flex-col gap-12 mb-10">
            <LeaderboardListItem
              avatar={{ alt: "Amy Dutton" }}
              name="Amy Dutton"
              slug="selfteachme"
              updates={[]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
