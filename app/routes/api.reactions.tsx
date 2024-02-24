import { ActionFunctionArgs, json } from "@remix-run/node";
import { createSupabaseServerClient } from "~/supabase.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // get the form data
  const formData = await request.formData();
  const { _action, ...values } = Object.fromEntries(formData);

  console.log({ _action, values });

  const supabase = createSupabaseServerClient(request);

  // handle the actions
  if (_action === "add") {
    console.log("create a reaction");
    console.log(values.emoji);

    const { error } = await supabase.from("emojis").insert([
      {
        emoji: values.emoji,
        user_id: values.user_id,
        update_id: values.update_id,
      },
    ]);
    if (error) {
      console.error(error);
      return json(
        { error: "There was an error adding the reaction", ok: false },
        500
      );
    }
  }

  if (_action === "delete") {
    console.log("delete a reaction");
  }

  return json({ error: null, ok: true });
};
