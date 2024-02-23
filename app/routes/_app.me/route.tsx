import { LoaderFunctionArgs, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";
import { supabaseAuth } from "~/utils/cookies";

export async function loader({ request }: LoaderFunctionArgs) {
  // check for Supabase Cookies
  const cookieHeader = request.headers.get("Cookie");
  const auth = await supabaseAuth.parse(cookieHeader);
  console.log({ auth });
  // const accessToken = cookies.get("sb-access-token");
  // const refreshToken = cookies.get("sb-refresh-token");

  // get the current Supabase user session
  // const supabase = createSupabaseServerClient(request);
  // const userResponse = await supabase.auth.getUser();

  console.log({ auth });

  // if (userResponse?.data?.user) {
  //   return {
  //     user: userResponse?.data?.user,
  //     env: {
  //       SUPABASE_URL: process.env.SUPABASE_URL!,
  //       SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  //     },
  //   };
  // }
  return {};
}

export default function Me() {
  return <div>Me</div>;
}
