import { createCookie } from "@remix-run/node"; // or "@remix-run/cloudflare"

export const supabaseAuth = createCookie("supabaseAuth", {
  sameSite: "strict",
});
