import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // get the form data
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  console.log({ _action, values });

  const supabase = createSupabaseServerClient(request);

  // handle the actions
  if (_action === "create") {
    console.log("create an update");
    const results = await supabase.from("updates").insert(values);
    if (results.error) {
      console.error(results.error);
      return json(
        { error: "Sorry! There was a problem adding your update.", ok: false },
        { status: 500 }
      );
      // TODO: Add frontend error handling if there was a problem adding the update
    }
    return redirect("/me");
  }

  if (_action === "update") {
    console.log("update an update");
    const results = await supabase
      .from("updates")
      .update(values)
      .eq("id", values.id);
    if (results.error) {
      console.error(results.error);
      return json(
        {
          error: "Sorry! There was a problem updating your update.",
          ok: false,
        },
        { status: 500 }
      );
    }
  }

  if (_action === "delete") {
    console.log("delete an update");
    const results = await supabase.from("updates").delete().eq("id", values.id);
    if (results.error) {
      console.error(results.error);
      return json(
        {
          error: "Sorry! There was a problem deleting your update.",
          ok: false,
        },
        { status: 500 }
      );
    }
  }

  return json({ error: null, ok: true });
};
