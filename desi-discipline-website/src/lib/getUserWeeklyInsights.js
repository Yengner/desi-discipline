import { createSupabaseClient } from "@/utils/supabase/clients/server";
import { getLoggedInUser } from "./user.actions";

export async function getUserWeeklyInsights() {
    const supabase = await createSupabaseClient();
    const loggedIn = await getLoggedInUser();
    const userId = loggedIn?.id;
    
    const { data, error } = await supabase
    .from("weekly_stats")
    .select("week_start_date, total_study_time, total_distraction_time, distraction_visits") 
    .eq("user_id", userId)
    .order("week_start_date", { ascending: true });
    
    if (error) {
    console.error("❌ Error fetching daily stats:", error.message);
    return [];
    }

  return data ?? [];
}
