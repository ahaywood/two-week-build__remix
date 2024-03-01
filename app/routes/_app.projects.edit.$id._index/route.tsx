import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Banner from "~/components/Banner";
import { Icon } from "~/components/Icon";
import { useAutosizeTextArea } from "~/hooks/useTextareaAutosize";
import { constants } from "~/lib/constants";
import { createSupabaseServerClient } from "~/supabase.server";

/** -------------------------------------------------
* LOADER
---------------------------------------------------- */
export async function loader({ request, params }: LoaderFunctionArgs) {
  console.log({ request });
  console.log({ projectId: params.id });

  // make sure that the user is logged in
  const supabase = createSupabaseServerClient(request);
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // if there's no user, redirect to the login page
  if (data.user === null) return redirect("/login");

  // get the current user's information
  const currentUserResults = await supabase
    .from("users")
    .select("id, projects(id)")
    .eq("auth_id", data.user.id)
    .single();
  if (currentUserResults.error) console.error(currentUserResults.error);
  const currentUserId = currentUserResults.data?.id;
  const currentUserUsername = currentUserResults.data?.username;

  // get the project information
  const projectResults = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();
  if (projectResults.error) console.error(projectResults.error);

  // check to make sure that the current user owns this project
  // TODO: Create a dedicated project page and redirect the user there
  if (projectResults.data?.user_id !== currentUserId) {
    redirect("/me");
  }

  console.log({ projectResults: projectResults.data });

  return {
    data: {
      project: projectResults.data,
      user: {
        id: currentUserId,
        username: currentUserUsername,
      },
    },
  };
}

/** -------------------------------------------------
* ACTION
---------------------------------------------------- */
export async function action({ request }: ActionFunctionArgs) {
  // get the form data
  const formData = await request.formData();

  const title = formData.get("name") as string;
  const description = formData.get("description") as string;
  const projectId = formData.get("project_id") as string;

  // validate
  if (!title || !description) {
    return json({
      error: "The title and description are required.",
      ok: false,
    });
  }

  const supabase = createSupabaseServerClient(request);
  const { error } = await supabase
    .from("projects")
    .update({
      name: title,
      description,
    })
    .eq("id", projectId);
  if (error) {
    console.error(error);
    return json({
      error: "Sorry! There was a problem adding your project.",
      ok: false,
    });
  }

  return redirect("/me");
}

/** -------------------------------------------------
*  Meta Data
---------------------------------------------------- */
export const meta: MetaFunction = () => {
  return [
    { title: `${constants.OG_TITLE} :: Edit Project` },
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
export default function EditProjectsPage() {
  const { data } = useLoaderData<typeof loader>();
  const formData = useActionData<typeof action>();
  console.log({ data });

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
          <h1>Edit Project</h1>
        </div>
      </Banner>

      <div className="page-grid" ref={pageTop}>
        <Form method="post" className="col-start-3 col-span-8">
          {formData?.error && !formData?.ok && (
            <div className="alert bg-error">
              <p>{formData.error}</p>
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
              defaultValue={data.project?.name}
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
              defaultValue={data.project?.description}
            ></textarea>
          </div>

          <div className="field">
            <input type="hidden" name="project_id" value={data.project?.id} />
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
