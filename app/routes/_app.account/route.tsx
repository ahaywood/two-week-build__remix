// TODO
// - Responsive view
// - Connect Avatar upload

import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useRef } from "react";
import Banner from "~/components/Banner";
import { Icon } from "~/components/Icon/Icon";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  // get the data for the current user
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if there's no user, redirect to the login page
  if (data.user === null) return redirect("/login");

  // get all of the data for the current user
  const result = await supabase
    .from("users")
    .select(
      "id, discord, youtube, github, location, name, twitter, username, website, linkedin, tiktok, avatar"
    )
    .eq("auth_id", data.user.id)
    .single();
  if (result.error) {
    console.error(result.error);
    throw error;
  }

  return {
    user: {
      email: data.user.email,
      ...result.data,
    },
  };
}

/** -------------------------------------------------
* ACTION
---------------------------------------------------- */
export async function action({ request }: ActionFunctionArgs) {
  // get all the data from the form submission
  const formData = await request.formData();
  const currentUserId = formData.get("id");

  // if there is no username
  if (formData.get("username") === "") {
    console.error("You have to have a username.");
    return json({ error: "The username is required.", ok: false });
  }

  // if there's no email address
  if (formData.get("email") === "") {
    console.error("You have to have an email.");
    return json({ error: "The email is required.", ok: false });
  }

  // if the user tried to update their password, make sure they entered it twice
  if (formData.get("password") !== formData.get("confirmPassword")) {
    console.error("Passwords do not match.");
    return json({ error: "Passwords do not match.", ok: false });
  }

  const supabase = createSupabaseServerClient(request);

  // if the user tried to change their username, make sure it's unique
  // if there aren't any problems, the username gets updated below
  if (formData.get("username") !== formData.get("oldUsername")) {
    const { data, error } = await supabase
      .from("users")
      .select("username")
      .eq("id", formData.get("id") as string)
      .single();
    if (error) {
      console.error(error);
      return json({ error: error.message, ok: false });
    }
    if (data) {
      console.error("Username already in use.");
      return json({ error: "Username already in use.", ok: false });
    }
  }

  // if the user tried to change their password, make sure the password and confirm password match
  if (formData.get("password") !== formData.get("confirmPassword")) {
    return json({ error: "Passwords do not match.", ok: false });
  } else if (formData.get("password")) {
    const resetPasswordResults = await supabase.auth.updateUser({
      password: formData.get("password") as string,
    });
    if (resetPasswordResults.error) {
      console.error(resetPasswordResults.error);
      return json({ error: resetPasswordResults.error.message, ok: false });
    }
  }

  // if the user tried to update their email address
  let message = "";
  if (formData.get("email") !== formData.get("oldEmail")) {
    const emailResults = await supabase.auth.updateUser({
      email: formData.get("email") as string,
    });
    if (emailResults.error) {
      console.error(emailResults.error);
      return json({ error: emailResults.error.message, ok: false });
    }
    message = "Please check your email to confirm the change.";
  }

  const avatar = formData.get("avatar") as File | null;

  // IF THE USER TRIED TO CHANGE THEIR AVATAR, UPLOAD IT TO SUPABASE
  let avatarUrl = "";
  if (avatar) {
    const bytes = await avatar.arrayBuffer();
    const bucket = supabase.storage.from("avatars");
    const extension = avatar.name.split(".").pop();
    const fileName = `${currentUserId}.${extension}`;

    const avatarResults = await bucket.upload(fileName, bytes, {
      upsert: true,
    });
    if (avatarResults.error) {
      console.error(avatarResults.error);
      return json({ error: avatarResults.error.message, ok: false });
    }
    avatarUrl = bucket.getPublicUrl(fileName).data.publicUrl;
  } else {
    avatarUrl = formData.get("oldAvatar") as string;
  }

  // update supabase with the new user data
  // TODO: Make code smart enough to determine if a URL or a handle was entered
  const user = await supabase
    .from("users")
    .update({
      discord: formData.get("discord") as string,
      youtube: formData.get("youtube") as string,
      github: formData.get("github") as string,
      location: formData.get("location") as string,
      twitter: formData.get("twitter") as string,
      username: formData.get("username") as string,
      website: formData.get("website") as string,
      tiktok: formData.get("tiktok") as string,
      linkedin: formData.get("linkedin") as string,
      avatar: avatarUrl,
    })
    .eq("id", currentUserId as string);
  if (user.error) {
    console.error(user.error);
    json({ error: user.error?.message, ok: false });
  }
  return json({ error: message, ok: true });
}

/** -------------------------------------------------
* META DATA
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Edit My Account` },
    {
      name: "description",
      content:
        "Update your account information, tweak your settings, and customize your experience to match your building journey.",
    },
  ];
};

/** -------------------------------------------------
* COMPONENT
---------------------------------------------------- */
export default function AccountPage() {
  const pageTop = useRef<HTMLDivElement>(null);
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Banner>
        <h1 className="pl-0 lg:pl-[15%]">My Account</h1>
      </Banner>

      <div className="page-grid" ref={pageTop}>
        {actionData?.ok && (
          <div className="alert bg-success col-start-3 col-span-7">
            Your account has been updated.
          </div>
        )}
        {actionData?.error && (
          <div className="alert bg-error col-start-3 col-span-7">
            {actionData.error}
          </div>
        )}

        <Form
          key={data.user.id}
          method="post"
          className="col-span-12 px-5 md:px-0 md:col-start-3 md:col-span-7"
          encType="multipart/form-data"
        >
          <input type="hidden" name="id" value={data.user.id} />
          <fieldset>
            <legend>Account</legend>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input type="hidden" name="oldEmail" value={data.user.email} />
              <input
                type="email"
                name="email"
                defaultValue={data.user.email}
                placeholder=""
                required
              />
            </div>
            <div className="field">
              <label htmlFor="username">Username</label>
              <input
                type="hidden"
                name="oldUsername"
                value={data.user.username}
              />
              <input
                type="text"
                name="username"
                defaultValue={data.user.username}
                placeholder=""
                required
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                defaultValue=""
                placeholder=""
              />
            </div>
            <div className="field">
              <label htmlFor="password">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                defaultValue=""
                placeholder=""
              />
            </div>
          </fieldset>
          <fieldset>
            <legend>Profile Details</legend>
            <div className="field">
              <label htmlFor="location">Your Location</label>
              <input
                type="text"
                name="location"
                id="location"
                placeholder=""
                defaultValue={data.user.location}
              />
            </div>
            <div className="field">
              <label htmlFor="website">Your Website</label>
              <input
                type="url"
                name="website"
                id="website"
                placeholder=""
                defaultValue={data.user.website}
              />
            </div>
            <div className="field">
              <label htmlFor="github">GitHub Handle</label>
              <input
                type="text"
                name="github"
                id="github"
                placeholder=""
                defaultValue={data.user.github}
              />
              <div className="icon">
                <Icon name="github" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="twitter">Twitter Handle</label>
              <input
                type="text"
                name="twitter"
                id="twitter"
                placeholder=""
                defaultValue={data.user.twitter}
              />
              <div className="icon">
                <Icon name="x" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="discord">Discord ID</label>
              <input
                type="text"
                name="discord"
                id="discord"
                placeholder=""
                defaultValue={data.user.discord}
              />
              <div className="icon">
                <Icon name="discord" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="youtube">YouTube URL</label>
              <input
                type="url"
                name="youtube"
                id="youtube"
                placeholder=""
                defaultValue={data.user.youtube}
              />
              <div className="icon">
                <Icon name="youtube" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="tiktok">Tiktok Handle</label>
              <input
                type="text"
                name="tiktok"
                id="tiktok"
                placeholder=""
                defaultValue={data.user.tiktok}
              />
              <div className="icon">
                <Icon name="tiktok" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="linkedin">Linkedin Handle</label>
              <input
                type="text"
                name="linkedin"
                id="linkedin"
                placeholder=""
                defaultValue={data.user.linkedin}
              />
              <div className="icon">
                <Icon name="linkedin" size="xl" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="avatar">Your Avatar</label>
              <input type="hidden" name="oldAvatar" />
              <input
                type="file"
                name="avatar"
                defaultValue={data.user.avatar}
                className="border-2 border-dashed border-white px-4 py-6 rounded-full w-full"
              />
            </div>
          </fieldset>
          <div className="field">
            <button
              className="auth-button"
              type="submit"
              onClick={() => {
                pageTop?.current?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Submit
              <Icon name="arrow" />
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
