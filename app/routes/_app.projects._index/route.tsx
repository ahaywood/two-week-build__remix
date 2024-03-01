// TODO
// - [ ] Pagination

import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Banner from "~/components/Banner";
import { ProjectOverview } from "../../components/ProjectOverview";
import { createSupabaseServerClient } from "~/supabase.server";
import { constants } from "~/lib/constants";

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, name, description, cohorts(id), users(id, name, avatar, username)"
    );
  if (error) throw error;

  return { data };
}

export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: All Projects` },
    {
      name: "description",
      content:
        "Take a look at all the projects being built within the Two Week Build Challenge. Each project is a testament to what can be achieved when creativity is bound by time but not by imagination.",
    },
  ];
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  console.log({ data });

  return (
    <>
      <Banner>
        <div className="page-grid">
          <div className="wrapper">
            <h1>All Projects</h1>
          </div>
        </div>
      </Banner>
      <div className="page-grid">
        <div className="col-start-3 col-span-8">
          <div className="flex flex-col gap-10 mb-20">
            {data.map((project) => (
              <ProjectOverview
                key={project.id}
                project={project}
                user={project.users}
                isAvatarShowing={true}
                isProfileDetailsShowing={true}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
