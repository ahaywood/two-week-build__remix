import { MouseEvent, useRef, RefObject, useState } from "react";
import { Icon } from "~/components/Icon";
import { Form, Link } from "@remix-run/react";
import { createSupabaseBrowserClient } from "~/supabase.client";
import { constants } from "~/lib/constants";

export default function Index() {
  const inputForm = useRef<HTMLFormElement>();
  const [isSuccess, setIsSuccess] = useState(false);

  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const formData = new FormData(inputForm.current);
    const dataFields = Object.fromEntries(formData.entries());

    const { data, error } = await supabase.auth.resetPasswordForEmail(
      dataFields.email as string,
      {
        redirectTo: `${constants.BASE_URL}/reset-password`,
      }
    );
    if (error) {
      console.error(error);
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
      <Form
        method="post"
        className="pt-3"
        ref={inputForm as RefObject<HTMLFormElement>}
      >
        <div className="field">
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" placeholder="" />
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
