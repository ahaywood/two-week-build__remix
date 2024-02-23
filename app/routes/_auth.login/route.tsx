import { type MetaFunction } from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { MouseEvent, RefObject, useRef } from "react";
import { createSupabaseBrowserClient } from "~/supabase.client";

export const meta: MetaFunction = () => {
  return [
    { title: "Two Week Build :: Login" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Login() {
  const inputForm = useRef<HTMLFormElement>();
  const navigate = useNavigate();

  // handle form submission on the client side so that Supabase can set up all the necessary cookies
  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();

    // set up the Supabase client
    const supabase = createSupabaseBrowserClient();

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
