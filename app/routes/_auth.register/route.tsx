import { useRef } from "react";
import { Form, MetaFunction } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import { constants } from "~/lib/constants";
import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

/** -------------------------------------------------
* ACTION
---------------------------------------------------- */
export async function action({ request }: ActionFunctionArgs) {
  // get the form data
  const formData = await request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  // passwords must match
  if (password !== confirmPassword) {
    return json({ error: "Passwords do not match", ok: false });
  }

  // required fields: email, password, username, name
  if (!email || !password || !username || !name) {
    return json({ error: "Missing required fields", ok: false });
  }

  // create a new user
  const supabase = createSupabaseServerClient(request);
  const authResults = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
  });
  if (authResults.error) {
    console.error(authResults.error);
    return json({ error: authResults.error.message, ok: false });
  }
  console.log({ user: authResults.data.user });

  // create a user profile
  const userProfileResults = await supabase
    .from("users")
    .insert([{ username, name, auth_id: authResults.data.user?.id }])
    .single();
  // check for errors
  if (userProfileResults.error) {
    console.error(userProfileResults.error);
    // since there was an error within Supabase, delete the user on the auth table
    // we don't need a user without a profile
    if (authResults.data.user?.id) {
      const userAuthDeleteResults = await supabase.auth.admin.deleteUser(
        authResults.data.user.id
      );
      if (userAuthDeleteResults.error)
        console.error("Error deleting user", userAuthDeleteResults.error);
    }
    return json({ error: userProfileResults.error.message, ok: false });
  }

  // TODO: User will need to confirm their account via email

  // redirect the user to create their project
  return redirect(`/thank-you`);
}

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
  const inputForm = useRef<HTMLFormElement>(null);
  const firstField = useRef<HTMLInputElement>(null);

  return (
    <>
      <h1>Register</h1>
      <p className="text-lg font-sans leading-normal mb-10 text-battleshipGray">
        We’re sending a confirmation email your way. In the meantime, register
        for an account below. This will set up your profile page for posting
        updates.
      </p>

      <Form method="post" className="mb-20" ref={inputForm}>
        <div className="field">
          <label htmlFor="email">Your Name*</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder=""
            required
            ref={firstField}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Your Email*</label>
          <input type="email" name="email" id="email" placeholder="" required />
        </div>
        <div className="field">
          <label htmlFor="text">Username*</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder=""
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Your Password*</label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder=""
            required
          />
        </div>
        <div className="field">
          <label htmlFor="password">Confirm Password*</label>
          <input
            type="password"
            name="confirmPassword"
            id="confirmPassword"
            placeholder=""
            required
          />
        </div>
        <div className="field">
          <label htmlFor="location">Your Location</label>
          <input type="text" name="location" id="location" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="website">Your Website</label>
          <input type="url" name="website" id="website" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="github">GitHub</label>
          <input type="url" name="github" id="github" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="twitter">Twitter</label>
          <input type="url" name="twitter" id="twitter" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="discord">Discord</label>
          <input type="url" name="discord" id="discord" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="youtube">Youtube</label>
          <input type="url" name="youtube" id="youtube" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="tiktok">TikTok</label>
          <input type="url" name="tiktok" id="tiktok" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="linkedin">LinkedIn</label>
          <input type="url" name="linkedin" id="linkedin" placeholder="" />
        </div>
        <div className="field">
          <label htmlFor="avatar">Your Avatar</label>
          <input
            type="file"
            name="avatar"
            defaultValue=""
            className="border-2 border-dashed border-white px-4 py-6 rounded-full w-full"
          />
        </div>
        <button type="submit" className="auth-button">
          SUBMIT
          <Icon name="arrow" />
        </button>
        <p className="text-center">
          Already have an account?{" "}
          <a
            href="/login"
            className="border-b-2 border-white hover:text-springBud"
          >
            LOGIN
          </a>
        </p>
      </Form>
    </>
  );
}
