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

import {
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Link, useLoaderData, useSearchParams } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
import { UpdateForm } from "~/components/UpdateForm";
import { UpdateHeader } from "~/components/UpdateHeader";
import type { Project, Update as UpdateType, User } from "~/global";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

const handleErrorMessage = (error: string) => {
  console.error(error);
  throw new Error(error);
};

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export async function loader({ request, params }: LoaderFunctionArgs) {
  // get the current update ID out of the URL
  const updateId = params.individual;

  try {
    const supabase = createSupabaseServerClient(request);
    // get the current Supabase user session
    const { data, error } = await supabase.auth.getUser();
    if (error) handleErrorMessage(error.message);

    // get the current user information
    const currentUser = await supabase
      .from("users")
      .select("id, username")
      .eq("auth_id", data?.user?.id)
      .single();
    if (currentUser.error) handleErrorMessage(currentUser.error.message);

    // get the current update
    const currentUpdate = await supabase
      .from("updates")
      .select("*, projects(*, users(*)), comments(*, users(*))")
      .eq("id", updateId)
      .single();
    if (currentUpdate.error) handleErrorMessage(currentUpdate.error.message);

    // get the emojis for the current update
    // since I'm using rpc, I need to handle this call separately
    const updateWithEmojis = await supabase.rpc("get_unique_emojis", {
      update_id_param: updateId,
      user_id_param: currentUser?.data?.id,
    });
    if (updateWithEmojis.error)
      handleErrorMessage(updateWithEmojis.error.message);

    const thisUpdate = {
      ...currentUpdate.data,
      emojis: updateWithEmojis.data,
    };

    // DATA TO RETURN TO THE FRONTEND
    return {
      data: {
        update: { ...thisUpdate },
        currentUser: { ...currentUser.data },
      },
    };
  } catch (error) {
    console.error(error);
    return { data: null };
  }
}

/** -------------------------------------------------
* META DATA
---------------------------------------------------- */
// I can't use typeof loader because it includes a Promise
// It looks like data.data because the MetaFunction accepts a data object and
// then the data I'm getting from my loader is another data object.
// interface MetaFunctionArgs {
//   data: {
//     data: {
//       me: User;
//     };
//     user: {
//       email: string;
//     };
//   };
// }

// export const meta = ({ data }: MetaFunctionArgs) => {
//   return [
//     {
//       title: `${constants.OG_TITLE} :: ${
//         data?.data?.me?.username && data.data.me.username
//       }`,
//     },
//     {
//       name: "description",
//       content: `Take a look at ${data?.data?.me?.name}'s project, ${data?.data?.me?.projects[0]?.name}, their updates and progress.`,
//     },
//   ];
// };

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function IndividualUpdatePage() {
  const { data } = useLoaderData<typeof loader>();
  console.log({ data });

  return (
    <>
      <ProfileHeader user={data?.update.projects.users} />
      <div className="page-grid md:gap-y-4 lg:gap-y-[140px] mb-[100px]">
        <div className="md:col-start-5 md:col-span-7 col-span-12 p-5 md:p-0 relative">
          <ProjectOverview
            project={data?.update.projects}
            user={data?.update.projects.users}
            isAvatarShowing={false}
          />
        </div>

        {data?.update && (
          <Update
            isBioShowing={false}
            user={data?.update.projects.users}
            id={data?.update.id}
            update={data?.update}
            currentUser={data?.currentUser}
          />
        )}
        <div className="col-start-5 col-span-7 mt-5">
          <Link
            to={`/${data?.update.projects.users.username}`}
            className="button uppercase border-1 border-white px-7 py-3 center gap-2 hover:border-springBud"
          >
            View all of {data?.update.projects.users.name}'s Updates
            <Icon name="arrow" size="xl" />
          </Link>
        </div>
      </div>
    </>
  );
}
