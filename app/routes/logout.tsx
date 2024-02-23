import { LoaderFunction, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const loader: LoaderFunction = async ({ request }) => {
  const supabase = createSupabaseServerClient(request);
  await supabase.auth.signOut();
  return redirect("/login");
};
