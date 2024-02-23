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
    console.log("create a reaction");
  }

  if (_action === "delete") {
    console.log("delete a reaction");
  }

  return json({ error: null, ok: true });
};
