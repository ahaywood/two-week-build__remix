// TODO:
// - Add pagination
// - Handle empty return
// - Too much empty space around the date in responsive view

import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { UpdateHeader } from "~/components/UpdateHeader";
import { Update } from "~/components/Update";
import { useLoaderData } from "@remix-run/react";
import { getTheCurrentUserId } from "~/lib/getCurrentUserId.server";
import { constants } from "~/lib/constants";

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const currentUserId = await getTheCurrentUserId(request);

  // get all the updates
  const AllUpdatesResults = await supabase
    .from("updates")
    .select("*, projects(*, users(*)), comments(*, users(*)), emojis(*)")
    .order("created_at", { ascending: false });
  if (AllUpdatesResults.error) throw AllUpdatesResults.error;

  // cycle back through all the updates and get the emojis for each update
  const updatesWithEmojis = await Promise.all(
    AllUpdatesResults.data.map(async (update) => {
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
    })
  );

  return { updatesWithEmojis, currentUserId };
}

/** -------------------------------------------------
*  Meta Data
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: All Updates` },
    {
      name: "description",
      content:
        "Stay in the loop with every twist with all the updates, across all projects. Witness the pulse of creativity as it happens, with feeds of breakthroughs, milestones, and, yes, even the thrilling last-minute finishes. From the first line of code to the final touches on a design masterpiece, this is where the heart of the 'Two Week Build' beats the loudest. Dive into the stories behind the projects, celebrate every achievement, and maybe find the spark for your next big idea. The journey of a thousand builds starts with a single update.",
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function AllUpdates() {
  const { updatesWithEmojis, currentUserId } = useLoaderData<typeof loader>();

  return (
    <>
      <UpdateHeader />
      <div className="page-grid gap-y-[140px]">
        {updatesWithEmojis.map((update) => (
          <Update
            key={update.id}
            isBioShowing={true}
            user={update.projects.users}
            id={update.id}
            update={update}
            currentUser={{ id: currentUserId }}
          />
        ))}
      </div>
    </>
  );
}
