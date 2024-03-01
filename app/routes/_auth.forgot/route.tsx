// TODO
// - Responsive Pass
// - SEO Pass

import { MouseEvent, useRef, RefObject, useState, useEffect } from "react";
import { Icon } from "~/components/Icon";
import { Form, Link, MetaFunction } from "@remix-run/react";
import { createSupabaseBrowserClient } from "~/supabase.client";
import { constants } from "~/lib/constants";

export const meta: MetaFunction = () => {
  return [
    { title: "Two Week Build :: Forgot Password" },
    {
      name: "description",
      content:
        "Oops! Forgot your password? Happens to the best of us. Don't worry, just a few clicks and you'll be back to building amazing things in no time. Let's reset and roll!",
    },
  ];
};

export default function Index() {
  const inputForm = useRef<HTMLFormElement>();
  const firstField = useRef<HTMLInputElement>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    firstField.current?.focus();
  }, []);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData(inputForm.current);
    const dataFields = Object.fromEntries(formData.entries());

    const { error } = await supabase.auth.resetPasswordForEmail(
      dataFields.email as string,
      {
        redirectTo: `${constants.BASE_URL}/reset-password`,
      }
    );
    if (error) {
      console.error(error);
      setErrorMessage(error.message);
      return;
    }
    setIsSuccess(true);
  };

  return (
    <>
      <h1>Forgot Password?</h1>
      {isSuccess && (
        <div className="alert bg-success text-white">
          We emailed you a link to reset your password. Please check your inbox.
        </div>
      )}
      {errorMessage && <div className="alert bg-error">{errorMessage}</div>}
      <Form
        method="post"
        className="pt-3"
        ref={inputForm as RefObject<HTMLFormElement>}
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            ref={firstField}
            type="email"
            name="email"
            id="email"
            placeholder=""
          />
        </div>
        <button onClick={(e) => handleSubmit(e)} className="auth-button">
          Email me a Reset
          <Icon name="arrow" size="xxl" />
        </button>
        <p className="text-center">
          <strong>
            <Link
              to="/login"
              className="border-b-battleshipGray border-b-2 hover:text-springBud"
            >
              Ready to Login?
            </Link>
          </strong>
        </p>
      </Form>
    </>
  );
}
