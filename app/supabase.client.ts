import { createBrowserClient } from '@supabase/ssr'

export type CreateSupabaseBrowserClientType = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
};

export const createSupabaseBrowserClient = (env: CreateSupabaseBrowserClientType) => {
  return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
}