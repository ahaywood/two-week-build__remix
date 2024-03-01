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

  // get the current user id
  const;

  // get all the updates
  const AllUpdatesResults = await supabase
    .from("updates")
    .select("*, projects(*, users(*)), comments(*, users(*)), emojis(*)");
  if (AllUpdatesResults.error) throw AllUpdatesResults.error;

  // cycle back through all the updates and get the emojis for each update
  const updatesWithEmojis = AllUpdatesResults.data.map(async (update) => {
    const emojiResults = await supabase.rpc("get_unique_emojis", {
      update_id_param: update.id,
      user_id_param: currentUserId,
    });
    if (emojiResults.error) throw new Error("Error getting emojis");
    // return the update with the emojis attached
    return {
      ...update,
      emojis: emojiResults.data,
    };
  });

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
