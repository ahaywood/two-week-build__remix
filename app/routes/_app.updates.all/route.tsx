// TODO:
// - Add pagination
// - Handle empty return

import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { UpdateHeader } from "~/components/UpdateHeader";
import { Update } from "~/components/Update";
import { useLoaderData } from "@remix-run/react";
import { getTheCurrentUserId } from "~/lib/getCurrentUserId.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const currentUserId = await getTheCurrentUserId(request);

  // get all the updates
  const AllUpdatesResults = await supabase
    .from("updates")
    .select("*, projects(*, users(*)), comments(*, users(*)), emojis(*)");
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

  return { data: updatesWithEmojis, currentUserId };
}

export default function AllUpdates() {
  const { data, currentUserId } = useLoaderData<typeof loader>();

  return (
    <>
      <UpdateHeader />
      <div className="page-grid gap-y-[140px]">
        {data.map((update) => (
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
