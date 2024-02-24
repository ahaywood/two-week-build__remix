import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
import { UpdateForm } from "~/components/UpdateForm";
import type { Update as UpdateType } from "~/global";
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

  // send the user data to the component
  return {
    data: {
      me: result.data,
      user: {
        email: data?.user?.email,
      },
    },
  };
}

export default function Me() {
  const { data } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

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
                key={update.id}
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
