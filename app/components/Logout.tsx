import { useNavigate } from "@remix-run/react";
import { createSupabaseBrowserClient } from "~/supabase.client";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient({
      SUPABASE_URL: window.ENV.SUPABASE_URL,
      SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY,
    });
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
      return;
    }
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
