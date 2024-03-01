/**
 * TODO
 * - [ ] Hide users that don't have _any_ updates
 * - [ ] Fix TypeScript Error below
 */

import Banner from "~/components/Banner";
import { LeaderboardListItem } from "./LeaderboardListItem";
import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { useLoaderData } from "@remix-run/react";
import { constants } from "~/lib/constants";

/**
 * TODO: Add additional information to the comments / documentation
 * Here's the custom query that I set up within Supabase
 */

interface ProjectUpdateCountTypes {
  id: string;
  name: string; // project name
  count: number;
  updateDates: string[]; // formatted as "2022-01-01"
}

export async function loader({ request }: LoaderFunctionArgs) {
  // TODO: Need to load data for the current cohort only - update rpc to accept a custom parameter
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.rpc("project_update_count");
  if (error) console.error(error);

  // TODO: Need to paginate >> might be able to push to later
  // get all the projects out of the database and merge the content
  const projectResults = await supabase
    .from("projects")
    .select("id, users(id, name, avatar, username)");
  if (projectResults.error) console.error(projectResults.error);

  const mergedProjects = projectResults?.data?.map((project) => {
    const updates = data.find(
      (update: ProjectUpdateCountTypes) => update.id === project.id
    );
    return {
      ...project,
      updates,
    };
  });

  return { data: mergedProjects };
}

export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Leaderboard` },
    {
      name: "description",
      content:
        "Our leaderboard is where ambition meets inspiration. See where participants stand with live updates showcasing every leap and bound.",
    },
  ];
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  console.log({ data });
  return (
    <>
      <Banner>
        <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-11">
          <h1>Leaderboard</h1>
        </div>
      </Banner>
      <div className="page-grid">
        <div className="col-span-12 px-5 md:px-0 md:col-start-2 md:col-span-8 xl:col-start-3 xl:col-span-6">
          <p className="text-battleshipGray font-sans text-lg leading-normal font-normal mb-10">
            The only requirement to get on the leaderboard is to post a daily
            update. The point is not <em>what</em> you build, but getting in a
            habit of shipping daily. Small wins add up!
          </p>
          <div className="flex flex-col gap-12 mb-10">
            {data?.map((project) => (
              <LeaderboardListItem
                key={project.id}
                avatar={{ alt: project.users.name, src: project.users.avatar }}
                name={project.users.name}
                username={project.users.username}
                updates={project.updates}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
