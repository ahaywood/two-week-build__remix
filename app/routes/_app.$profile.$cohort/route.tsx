// TODO:
// - Update UI to make it optimistic - https://remix.run/docs/en/main/start/tutorial#optimistic-ui
// Markdown Editor
// - Upload an image to include within the update
// - Embed a YouTube video on an update
// - Embed a Loom video on an update
// - Embed a CodePen video on an update
// - Add Markdown support to comments
// - Embed a YouTube Video on a comment
// - Embed a Loom video on a comment
// - link @ to users
// - link # to tags

import { LoaderFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
import { UpdateForm } from "~/components/UpdateForm";
import type { Project, Update as UpdateType, User } from "~/global";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  // get the current Supabase user session
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // get all of the data for the current user
  const cohort = params.cohort as string;
  console.log({ COHORT: cohort });
  const username = params.profile as string;
  // ! TODO: Need to make sure this works if I introduce pagination
  const result = await supabase
    .from("users")
    .select(
      "*, projects(*, updates(*, comments(*, users(id, name, username)), emojis(*)))"
    )
    .order("created_at", {
      referencedTable: "projects.updates",
      ascending: true, // this actually puts the oldest first because I'm reordering them with CSS
    })
    .order("created_at", {
      referencedTable: "projects",
      ascending: false, // combined with limit, this grabs the most recent project
    })
    .limit(1, { referencedTable: "projects" })
    .eq("username", username)
    .eq("projects.cohort_id", cohort)
    .single();
  if (result.error) throw error;
  console.log({ data: result.data.projects[0] });

  // if there's no user, redirect to the login page
  if (result.data.user === null) return redirect("/user-not-found");

  // Rebuild the Projects Array
  // I need to loop through each project and then their updates individually to
  // get the emoji data since I'm computing a few properties and  using rpc
  let projectsWithEmojis = {};

  try {
    // loop over all the the projects
    // this returns a projects array with the updates and emojis attached
    // it does not include the rest of the user data
    projectsWithEmojis = await Promise.all(
      result.data.projects.map(async (project: Project) => {
        // loop over all the updates inside a project
        const updatesWithEmojis = await Promise.all(
          project.updates.map(async (update: UpdateType) => {
            // get all the emojis associated with a specific update
            // this is a custom function that I set up on Supabase
            /*
              This is the function that I created within Supabase and ran
              through the SQL Editor

              create
              or replace function get_unique_emojis (update_id_param uuid, user_id_param uuid)
              returns table (emoji text, user_submitted boolean, count int)
              as $$
                BEGIN RETURN QUERY
                select distinct
                  emojis.emoji,
                  bool_or(user_id = user_id_param) as user_submitted,
                  count(emojis.emoji)::int as count
              from
                emojis
              where
                emojis.update_id = update_id_param
              group by
                emojis.emoji;
              END; $$ language plpgsql stable;
            */
            const emojiResults = await supabase.rpc("get_unique_emojis", {
              update_id_param: update.id,
              user_id_param: result.data.id,
            });
            if (emojiResults.error) throw new Error("Error getting emojis");
            // return the update with the emojis attached
            return {
              ...update,
              emojis: emojiResults.data,
            };
          }) // close map on all updates
        ); // close Promise.all on updates

        // return the project object with the updates and emojis attached
        return {
          ...project,
          updates: updatesWithEmojis,
        };
      })
    ); // close map on projects
  } catch (error) {
    console.error({ error });
  }

  // send the user data to the component
  return {
    data: {
      me: {
        ...result.data,
        projects: projectsWithEmojis,
      },
      user: {
        email: data?.user?.email,
      },
    },
  };
}

// I can't use typeof loader because it includes a Promise
// It looks like data.data because the MetaFunction accepts a data object and
// then the data I'm getting from my loader is another data object.
interface MetaFunctionArgs {
  data: {
    data: {
      me: User;
    };
    user: {
      email: string;
    };
  };
}

export const meta = ({ data }: MetaFunctionArgs) => {
  return [
    {
      title: `${constants.OG_TITLE} :: ${
        data?.data?.me?.username && data.data.me.username
      }`,
    },
    {
      name: "description",
      content: `Take a look at ${data?.data?.me?.name}'s project, ${data?.data?.me?.projects[0]?.name}, their updates and progress.`,
    },
  ];
};

export default function Me() {
  const { data } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  return (
    <>
      <ProfileHeader user={data.me} />
      {/* The gap here controls the spacing between each of the updates */}
      <div className="page-grid gap-y-[200px] lg:gap-y-[80px] mb-[100px] md:mb-10">
        <div className="md:col-start-5 md:col-span-7 col-span-12 p-5 md:p-0">
          {/* TODO: Make sure it is only returning the most recent project */}
          {/* TODO: Add navigation at the top for all the cohorts that someone has participated in */}
          <ProjectOverview
            project={data.me.projects[0]}
            user={data.me}
            isAvatarShowing={false}
          />
        </div>

        {/* UPDATES */}
        {/* SHOW NEW UPDATE FORM */}
        {searchParams.get("new") && (
          <div className="relative col-span-7 col-start-5 mb-10" id="new">
            <UpdateForm projectId={data.me.projects[0].id} />
          </div>
        )}

        {/* LIST UPDATES */}
        {data.me.projects[0].updates.length > 0 ? (
          data.me.projects[0].updates.map(
            (update: UpdateType, index: number) => (
              <div
                className="col-span-12 grid grid-cols-subgrid"
                key={index}
                // I'm using the order property to reverse the order of the updates
                // so that the emoji picker appears above, it needs to be listed later in the DOM
                style={{ order: data.me.projects[0].updates.length - index }}
              >
                <Update
                  id={update.id}
                  update={update}
                  user={data.me}
                  isStackedDateShowing={
                    data?.me?.projects[0]?.updates[--index]?.created_at !==
                    update.created_at
                  }
                  currentUser={{
                    ...data.me,
                  }}
                />
              </div>
            )
          )
        ) : (
          <>
            {/* TODO: Update the design on the empty state */}
            <div className="col-start-2 col-span-3 mr-10 pr-10 border-r-3 border-r-codGray" />
            <div className="col-span-5 content">
              <p>No Updates, yet</p>
              <button>Add an Update</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
