// TODO:
// - Update UI to make it optimistic - https://remix.run/docs/en/main/start/tutorial#optimistic-ui
// - Consider popping the update out into a modal
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

import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
import { UpdateForm } from "~/components/UpdateForm";
import type { Project, Update as UpdateType, User } from "~/global";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";
import { Icon } from "~/components/Icon";

// Get the auth information for the current user
export async function loader({ request, params }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  // get the current Supabase user session
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if the user is logged in, get their details
  let currentUserResults;
  if (data?.user) {
    currentUserResults = await supabase
      .from("users")
      .select("id, username")
      .eq("auth_id", data.user?.id)
      .single();
    if (currentUserResults.error) console.error(currentUserResults.error);
  }

  // get all of the data for the user with this slug
  const username = params.profile as string;
  const result = await supabase
    .from("users")
    .select(
      "*, projects(*, updates(*, comments(*, users(id, name, username))))"
    )
    // ! TODO: Need to make sure this works if I introduce pagination
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
    .single();
  if (result.error) throw error;

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
        ...currentUserResults?.data,
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
      content: `Take a look at ${data?.data?.me?.name}'s project, their updates and progress.`,
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function Me() {
  const { data } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  return (
    <>
      <ProfileHeader user={data.me} />
      {/* The gap here controls the spacing between each of the updates */}
      <div className="page-grid gap-y-[200px] lg:gap-y-[80px] mb-[100px] md:mb-10">
        {data.me.projects[0] && data.user.email && (
          <div className="md:col-start-5 md:col-span-7 col-span-12 p-5 md:p-0 relative">
            {/* TODO: Make sure it is only returning the most recent project */}
            {/* TODO: Add navigation at the top for all the cohorts that someone has participated in */}
            <ProjectOverview
              project={data.me.projects[0]}
              user={data.me}
              isAvatarShowing={false}
            />

            {/* if this is the logged in user's profile page, then give them buttons to edit their project */}
            {`/${data?.user?.username}` === location.pathname && (
              <div className="absolute right-0 bottom-0 flex gap-2">
                <button className="square-button">
                  <Link
                    to={`/projects/edit/${data.me.projects[0].id}`}
                    className="bg-chicago size-8 hover:bg-springBud hover:text-black"
                  >
                    <Icon name="edit" aria-label="Edit Project" />
                  </Link>
                </button>
                {/* MARK - I DON'T THINK I WANT TO GIVE USER'S THE ABILITY TO DELETE THEIR PROJECT */}
              </div>
            )}
          </div>
        )}

        {/* UPDATES */}
        {/* SHOW NEW UPDATE FORM */}
        {searchParams.get("new") && (
          <div className="relative col-span-7 col-start-5 mb-10" id="new">
            <UpdateForm projectId={data.me.projects[0].id} />
          </div>
        )}

        {/* LIST UPDATES */}
        {data.me.projects[0] && data.me.projects[0].updates.length > 0 ? (
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
        ) : // TODO: refactor this code ... it's confusing
        // IF THE USER HAS CREATED A PROJECT AND THERE ARE NO UPDATES
        // the user must be logged in, in order to see the add button
        // this must be this user's project
        // TODO: THIS MUST BE THE USER"S ACCOUNT TO SEE THE BUTTON
        data.me.projects.length > 0 &&
          `/${data.user.username}` === location.pathname ? (
          <div className="col-span-12 grid grid-cols-subgrid relative -top-[150px] lg:-top-[30px]">
            <div className="hidden md:block col-start-2 col-span-3 mr-10 pr-10 border-r-3 border-r-codGray" />
            <div className="col-span-12 px-5 md:px-0 md:col-span-5">
              {!searchParams.get("new") && (
                <Link
                  to={`?new=true#new`}
                  className="with-icon bg-springBud text-black center whitespace-nowrap text-sm w-full py-1 uppercase px-4 hover:bg-white mb-5 py-4"
                >
                  <Icon name="plus-circle" className="size-4" />
                  Add your First Update
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="col-span-12 grid grid-cols-subgrid relative">
            <div className="col-span-12 px-5 md:px-0 md:col-start-5 md:col-span-5">
              {/* IF THIS PROFILE PAGE IS THE LOGGED IN USER'S PROFILE PAGE,
              THEN SHOW AN ADD AN UPDATE BUTTON */}
              {!searchParams.get("new") &&
                `/${data.user.username}` === location.pathname && (
                  <Link
                    to="/projects/new"
                    className="with-icon bg-springBud text-black center whitespace-nowrap text-sm w-full uppercase px-4 hover:bg-white mb-5 py-4"
                  >
                    <Icon name="plus-circle" className="size-4" />
                    Add a Project
                  </Link>
                )}
              <p className="font-sans">
                There are not any updates available yet.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
