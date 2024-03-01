import { useRef, RefObject, useState, MouseEvent } from "react";
import { Form, Link, MetaFunction } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import { constants } from "~/lib/constants";

/** -------------------------------------------------
* META DATA
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Register` },
    {
      name: "description",
      content:
        "Join our community of passionate builders and turn your ideas into reality, one two-week sprint at a time. We can't wait to see what you'll build.",
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function RegisterPage() {
  const inputForm = useRef(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: MouseEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <h1>Register</h1>
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
