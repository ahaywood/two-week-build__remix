import { createBrowserClient } from '@supabase/ssr'

export const createSupabaseBrowserClient = () => {
  return createBrowserClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
}