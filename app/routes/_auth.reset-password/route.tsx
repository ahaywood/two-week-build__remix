import { MouseEvent, useEffect, useRef, useState } from "react";
import {
  ActionFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useNavigate } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import { constants } from "~/lib/constants";
import { createSupabaseBrowserClient } from "~/supabase.client";
import { createSupabaseServerClient } from "~/supabase.server";

export async function action({ request }: ActionFunctionArgs) {
  // get the form data
  const formData = await request.formData();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // validate the form data
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match", ok: false });
  }

  // update the password
  const supabase = createSupabaseServerClient(request);
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return json({ error: error.message, ok: false });
  }

  return redirect("/me");
}

/** -------------------------------------------------
*  Meta Data
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Reset Password` },
    {
      name: "description",
      content:
        "Let's reset your password and get you back to building amazing things in no time. We know that bumps in the road can happen, especially when you're racing towards your next big project deadline. Follow the steps below for a quick password reset, and you'll be on your way to your two-week challenge. A strong password is like a solid foundation for your digital space—secure and reliable.",
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function ResetPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const inputForm = useRef<HTMLFormElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstField.current?.focus();
  }, []);

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // get the form data
    const formData = new FormData(inputForm.current!);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return setErrorMessage("Passwords do not match");
    }

    // update the password
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setErrorMessage(error.message);
      return;
    }

    navigate("/me");
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {errorMessage && <div className="alert bg-error">{errorMessage}</div>}
      <Form method="post" className="pt-3" ref={inputForm}>
        <div className="field">
          <label htmlFor="email">New Password</label>
          <input
            ref={firstField}
            type="password"
            name="password"
            id="password"
            placeholder=""
          />
        </div>
        <div className="field">
          <label htmlFor="email">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder=""
          />
        </div>
        <button
          type="submit"
          className="auth-button"
          onClick={(e) => handleSubmit(e)}
        >
          Update Password
          <Icon name="arrow" size="xxl" />
        </button>
      </Form>
    </div>
  );
}
