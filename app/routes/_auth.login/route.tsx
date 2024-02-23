import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
  LoaderFunctionArgs,
  createCookie,
} from "@remix-run/node";
import { Form } from "@remix-run/react";
import { createSupabaseServerClient } from "~/supabase.server";
import { supabaseAuth } from "~/utils/cookies";

export const meta: MetaFunction = () => {
  return [
    { title: "Two Week Build :: Login" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  // use the form data
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // connect to Supabase
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // check for errors
  if (error) return json({ errors: error });

  console.log({ data });

  // set cookies
  const { access_token, refresh_token } = data.session;

  // return redirect("/me");
  return redirect("/me", {
    headers: {
      "Set-Cookie": await supabaseAuth.serialize({
        "sb-access-token": access_token,
        "sb-refresh-token": refresh_token,
      }),
    },
  });
}

export default function Login() {
  return (
    <Form method="post">
      <input type="email" name="email" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button>LOGIN</button>
    </Form>
  );
}
