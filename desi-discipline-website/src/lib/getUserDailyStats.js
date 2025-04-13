import { createSupabaseClient } from "@/utils/supabase/clients/server";
import { getLoggedInUser } from "./user.actions";

export async function getUserDailyStats() {
    const supabase = await createSupabaseClient();
    const loggedIn = await getLoggedInUser();
    const userId = loggedIn?.id;
    
    const { data, error } = await supabase
    .from("daily_stats")
    .select("date, total_study_time")
    .eq("user_id", userId)
    .order("date", { ascending: true });
    
    if (error) {
    console.error("❌ Error fetching daily stats:", error.message);
    return [];
    }

  return data ?? [];
}
