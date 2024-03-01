/* eslint-disable jsx-a11y/tabindex-no-positive */
// TODO
// - Responsive Pass
// - SEO Pass

import { type MetaFunction } from "@remix-run/node";
import { Form, Link, useNavigate } from "@remix-run/react";
import { AnimatePresence, motion } from "framer-motion";
import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";
import { Icon } from "~/components/Icon/Icon";
import { constants } from "~/lib/constants";
import { createSupabaseBrowserClient } from "~/supabase.client";

export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Login` },
    {
      name: "description",
      content:
        "Log in to the Two Week Build Challenge, where the deadlines are tight and the coffee is hot!",
    },
  ];
};

export default function Login() {
  const inputForm = useRef<HTMLFormElement>();
  const firstField = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  // focus on the first field in the form on page load
  useEffect(() => {
    firstField.current?.focus();
  }, []);

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
      setErrorMessage(error.message);
      return;
    }

    // redirect to the user's page
    if (data.session) {
      navigate("/me");
    }
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  return (
    <>
      <h1>Login</h1>
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="alert bg-error">{errorMessage}</div>
          </motion.div>
        )}
      </AnimatePresence>
      <Form
        method="post"
        ref={inputForm as RefObject<HTMLFormElement>}
        className="pt-3"
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder=""
            onChange={clearErrorMessage}
            ref={firstField}
            tabIndex={1}
          />
        </div>
        <div className="field">
          <Link
            to="/forgot"
            className="hover:text-springBud right-6 absolute -top-7"
          >
            Forgot?
          </Link>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            onChange={clearErrorMessage}
            tabIndex={2}
          />
        </div>
        <button
          tabIndex={3}
          onClick={(e) => handleSubmit(e)}
          className="auth-button"
        >
          submit
          <Icon name="arrow" />
        </button>
        <p className="text-center">
          <span className="block md:inline">NEED AN ACCOUNT? </span>
          <strong className="block md:inline">
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
