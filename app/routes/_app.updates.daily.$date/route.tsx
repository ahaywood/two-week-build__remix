// TODO:
// - Add pagination
// - Handle empty return
// - Too much empty space around the date in responsive view
// - Banner component doesn't have consistent left padding

import { LoaderFunctionArgs } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { UpdateHeader } from "~/components/UpdateHeader";
import { Update } from "~/components/Update";
import { useLoaderData } from "@remix-run/react";
import { getTheCurrentUserId } from "~/lib/getCurrentUserId.server";
import Banner from "~/components/Banner";
import { getLongDate } from "~/lib/dateHelpers";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const supabase = createSupabaseServerClient(request);
  const currentUserId = await getTheCurrentUserId(request);

  const date = params.date as string;
  const [year, month, numericalDate] = date.split("-");

  // get all the updates
  const AllUpdatesResults = await supabase
    .from("updates")
    .select("*, projects(*, users(*)), comments(*, users(*)), emojis(*)")
    .eq(
      "date",
      `${year}-${month.padStart(2, "0")}-${numericalDate.padStart(2, "0")}`
    );
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

  return { data: updatesWithEmojis, currentUserId, date };
}

export default function DailyUpdates() {
  const { data, currentUserId, date } = useLoaderData<typeof loader>();

  return (
    <>
      <Banner>
        <div className="col-start-2 col-span-11">
          <h1 className="mb-4">Updates</h1>
          <h3 className="text-black text-5xl">{getLongDate(date)}</h3>
        </div>
      </Banner>
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
