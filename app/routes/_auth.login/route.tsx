import {
  ActionFunctionArgs,
  json,
  redirect,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { RefObject, useRef } from "react";
import {
  CreateSupabaseBrowserClientType,
  createSupabaseBrowserClient,
} from "~/supabase.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Two Week Build :: Login" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Login() {
  const inputForm = useRef<HTMLFormElement>();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // set up the Supabase client
    const supabase = createSupabaseBrowserClient({
      SUPABASE_URL: window.ENV.SUPABASE_URL,
      SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY,
    });

    // get the form data
    const formData = new FormData(inputForm.current);
    const dataFields = Object.fromEntries(formData.entries());
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dataFields.email as string,
      password: dataFields.password as string,
    });

    console.log({ data });

    // check for errors
    if (error) {
      console.error(error);
      return;
    }

    // redirect to the user's page
    if (data.session) {
      navigate("/me");
    }
  };

  return (
    <Form method="post" ref={inputForm as RefObject<HTMLFormElement>}>
      <input type="email" name="email" placeholder="username" />
      <input type="password" name="password" placeholder="password" />
      <button onClick={(e) => handleSubmit(e)}>LOGIN</button>
    </Form>
  );
}
