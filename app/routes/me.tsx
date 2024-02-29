import { LoaderFunction, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

/**
 * THE PURPOSE OF THIS ROUTE
 * If a logged in user goes to `/me` then they will be redirected to their profile page
 */

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = createSupabaseServerClient(request);

  // get the current user
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if there's no user, redirect to the login page
  if (data.user === null) return redirect("/login");

  // get the current user's username
  const username = await supabase
    .from("users")
    .select("username")
    .eq("auth_id", data?.user?.id)
    .single();

  return redirect(`/${username.data?.username}`);
};
