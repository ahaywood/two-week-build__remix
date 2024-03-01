import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  MetaFunction,
  useActionData,
  useLoaderData,
} from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Banner from "~/components/Banner";
import { Icon } from "~/components/Icon";
import { useAutosizeTextArea } from "~/hooks/useTextareaAutosize";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

/** -------------------------------------------------
*  Action Function
---------------------------------------------------- */
export async function action({ request }: ActionFunctionArgs) {
  // get the form data
  const formData = await request.formData();

  const title = formData.get("name") as string;
  const description = formData.get("description") as string;
  const cohortId = formData.get("cohort_id") as string;
  const userId = formData.get("user_id") as string;

  // validate
  if (!title || !description) {
    return json({
      error: "The title and description are required.",
      ok: false,
    });
  }

  // TODO: move user id over to the server so it doesn't get intercepted or changed
  const supabase = createSupabaseServerClient(request);
  const { error } = await supabase.from("projects").insert({
    name: title,
    description,
    cohort_id: cohortId,
    user_id: userId,
  });
  if (error) {
    console.error(error);
    return json({
      error: "Sorry! There was a problem adding your project.",
      ok: false,
    });
  }

  // const supabase = createSupabaseServerClient(request);
  return redirect("/me");
}

/** -------------------------------------------------
*  Loader Function
---------------------------------------------------- */
export async function loader({ request }: LoaderFunctionArgs) {
  // Check to see if the current user is logged in
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if there's no user, redirect to the login page
  if (data.user === null) return redirect("/login");

  // get the current user Id, also check to see if they already have a project set up
  // TODO - Check for the current cohort. The user may want to participate in more than one cohort
  const currentUserResults = await supabase
    .from("users")
    .select("id, projects(id)")
    .eq("auth_id", data.user.id)
    .single();
  if (currentUserResults.error) console.error(currentUserResults.error);

  // if the user already has a project set up, redirect them to their profile page
  if (currentUserResults?.data && currentUserResults.data.projects.length > 0) {
    return redirect("/me");
  }

  // get the current cohort id
  // TODO: I'm not sure that ascending: false is correct. Will need to confirm when there are more cohorts
  const cohortResults = await supabase
    .from("cohorts")
    .select("id")
    .order("start_date", { ascending: false })
    .single();
  if (cohortResults.error) console.error(cohortResults.error);

  return {
    cohortId: cohortResults?.data?.id,
    currentUser: currentUserResults.data?.id,
  };
}

/** -------------------------------------------------
*  Meta Data
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: New Project` },
    {
      name: "description",
      content:
        "Add your project. Share your idea, set your goals, and start the clock. Our community is here to cheer you on every step of the way. ",
    },
  ];
};

/** -------------------------------------------------
*  Component
---------------------------------------------------- */
export default function Index() {
  const { cohortId, currentUser } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const [markdownText, setMarkdownText] = useState("");
  const textareaRef = useRef(null);
  const pageTop = useRef(null);
  const firstField = useRef<HTMLInputElement>(null);

  useAutosizeTextArea(textareaRef.current, markdownText);

  useEffect(() => {
    firstField?.current?.focus();
  }, [firstField]);

  const handleMarkdownChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdownText(e.target.value);
  };

  return (
    <div>
      <Banner>
        <div className="col-start-3 col-span-8">
          <h1>New Project</h1>
        </div>
      </Banner>

      <div className="page-grid" ref={pageTop}>
        <Form method="post" className="col-start-3 col-span-8">
          {data?.error && !data?.ok && (
            <div className="alert bg-error">
              <p>{data.error}</p>
            </div>
          )}
          <div className="field">
            <p className="font-sans text-mountainMist">
              <strong>Describe your project.</strong> What are you going to
              build during the Two Week Build Challenge?
            </p>
          </div>
          <div className="field">
            <label htmlFor="name">Project Title</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder=""
              ref={firstField}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              ref={textareaRef}
              onChange={handleMarkdownChange}
              className="min-h-[200px]"
              required
            ></textarea>
          </div>

          <div className="field">
            <input type="hidden" name="cohort_id" value={cohortId} />
            <input type="hidden" name="user_id" value={currentUser} />
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
