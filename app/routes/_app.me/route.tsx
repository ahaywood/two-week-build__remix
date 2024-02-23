import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Logout from "~/components/Logout";
import { createSupabaseServerClient } from "~/supabase.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // get the current Supabase user session
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);
  // if (data.user === null) return redirect("/login");
  console.log({ data });
  return { data };
}

export default function Me() {
  const { data } = useLoaderData();

  return (
    <div>
      Hey {data.user?.email}
      <p>
        <Logout />
      </p>
    </div>
  );
}
