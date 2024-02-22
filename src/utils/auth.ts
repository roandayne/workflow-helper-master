import { SupabaseClient } from "@supabase/supabase-js";

export const logout = async (supabase: SupabaseClient) => {
  await supabase.auth.signOut();
};
