import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ProfileHeader } from "~/components/ProfileHeader";
import { ProjectOverview } from "~/components/ProjectOverview";
import { Update } from "~/components/Update";
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

  return (
    <>
      <ProfileHeader user={data.me} />
      <div className="page-grid gap-y-[80px] mb-10">
        <div className="col-start-5 col-span-6">
          {/* TODO: Make sure it is only returning the most recent project */}
          {/* TODO: Add navigation at the top for all the cohorts that someone has participated in */}
          <ProjectOverview
            project={data.me.projects[0]}
            user={data.me}
            isAvatarShowing={false}
          />
        </div>

        {data.me.projects[0].updates.length > 0 ? (
          data.me.projects[0].updates.map((update: UpdateType) => (
            <Update
              key={update.id}
              id={update.id}
              update={update}
              user={data.me}
              currentUser={{
                ...data.me,
              }}
            />
          ))
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
