import { LoaderFunctionArgs } from "@remix-run/node";
// import { createSupabaseServerClient } from "~/supabase.server";

export async function loader({ params }: LoaderFunctionArgs) {
  // get the profile slug out of the URL
  const profile = params.profile;
  const cohort = params.cohort;
  console.log({ profile, cohort });

  // get the current Supabase user session
  // const supabase = createSupabaseServerClient(request);

  // send the user data to the component
  return {};
}

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile and Cohort</h1>
    </div>
  );
}
