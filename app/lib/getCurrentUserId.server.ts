import { createSupabaseServerClient } from "../supabase.server";

export const getTheCurrentUserId = async (request: Request) => {
  const supabase = createSupabaseServerClient(request);

  // get the current user logged in user
  const { data, error } = await supabase.auth.getUser();
  if (error) console.error(error);

  // get the logged in users id
  if (data?.user?.id) {
    const result = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", data.user.id)
      .single();
    if (result.error) {
      console.error(result.error);
      return null;
    }
    if (result?.data?.id) return result.data.id
  }

  return null
}