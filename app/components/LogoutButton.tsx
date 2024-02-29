import { createSupabaseBrowserClient } from "~/supabase.client";
import { Icon } from "./Icon";
import { useNavigate } from "@remix-run/react";

const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = async () => {
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signOut();
    if (error) console.error(error);
    else navigate("/login");
  };

  return (
    <button type="submit" className="menu-item" onClick={logout}>
      <Icon name="logout">Logout</Icon>
    </button>
  );
};

export { LogoutButton };
