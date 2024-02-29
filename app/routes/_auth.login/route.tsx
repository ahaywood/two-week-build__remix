import { type MetaFunction } from "@remix-run/node";
import { Form, Link, useNavigate } from "@remix-run/react";
import { MouseEvent, RefObject, useRef } from "react";
import { Icon } from "~/components/Icon/Icon";
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
    <>
      <h1>Login</h1>
      <Form
        method="post"
        ref={inputForm as RefObject<HTMLFormElement>}
        className="pt-3"
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="" />
        </div>
        <div className="field">
          <Link
            to="/forgot"
            className="hover:text-springBud right-6 absolute -top-7"
          >
            Forgot?
          </Link>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" id="password" placeholder="" />
        </div>
        <button onClick={(e) => handleSubmit(e)} className="auth-button">
          submit
          <Icon name="arrow" />
        </button>
        <p className="text-center">
          NEED AN ACCOUNT?{" "}
          <strong>
            <Link
              to="/register"
              className="border-b-battleshipGray border-b-2 hover:text-springBud"
            >
              Sign Up for FREE
            </Link>
          </strong>
        </p>
      </Form>
    </>
  );
}
