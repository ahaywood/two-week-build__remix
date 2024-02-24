// TODO:
// - Edit an update
// - Mobile Pass
// - New cohort, new project
// - Deleting an update does not work if there are emojis on the update
// - Deleting an update does not work if there are comments on the update
// - Upload an image to include within the update
// - Embed a YouTube video on an update
// - Embed a Loom video on an update
// - Add Markdown support to comments
// - Embed a YouTube Video on a comment
// - Embed a Loom video on a comment
// - Add Toast

import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
import { UpdateForm } from "~/components/UpdateForm";
import type { Project, Update as UpdateType } from "~/global";
import { createSupabaseServerClient } from "~/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // get the current Supabase user session
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if there's no user, redirect to the login page
  if (data.user === null) return redirect("/login");

  // get all of the data for the current user
  const result = await supabase
    .from("users")
    .select(
      "*, projects(*, updates(*, comments(*, users(id, name, username)), emojis(*)))"
    )
    .order("created_at", {
      referencedTable: "projects.updates",
      ascending: true, // this actually puts the oldest first because I'm reordering them with CSS
    })
    .eq("auth_id", data.user.id)
    .single();
  if (result.error) throw error;

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

export default function Me() {
  const { data } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  console.log({ data });

  return (
    <>
      <ProfileHeader user={data.me} />
      <div className="page-grid gap-y-[80px] mb-10">
        <div className="col-start-5 col-span-7">
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
        {/* TODO: Only displayed the stacked date once if there are multiple updates for a single day */}
        {/* TODO: Add an update and delete button if these are updates that the logged in user made */}
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

      <div className="w-full overflow-scroll bg-yellow-400 text-black p-10">
        {JSON.stringify(data)}
      </div>
    </>
  );
}
