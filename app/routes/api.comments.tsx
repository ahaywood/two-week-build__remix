import { ActionFunctionArgs, json } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // get the form data
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  console.log({ _action, values });

  const supabase = createSupabaseServerClient(request);

  // handle the actions
  if (_action === "create") {
    // TODO: Validate the content coming from the form

    // connect to supabase and add the comment
    const result = await supabase.from("comments").insert(values);
    if (result.error) {
      console.error(result.error);
      return json({
        error: "There was an error creating the comment",
        ok: false,
      });
    }
  }

  if (_action === "update") {
    console.log("update a comment");
    const result = await supabase
      .from("comments")
      .update({ comment: values.comment })
      .eq("id", values.comment_id);
    if (result.error) {
      console.error(result.error);
      return json({
        error: "There was an error updating the comment",
        ok: false,
      });
    }
  }

  if (_action === "delete") {
    const result = await supabase
      .from("comments")
      .delete()
      .eq("id", values.comment_id);
    if (result.error) {
      console.error(result.error);
      return json({
        error: "There was an error deleting the comment",
        ok: false,
      });
    }
  }

  return json({ error: null, ok: true });
};
