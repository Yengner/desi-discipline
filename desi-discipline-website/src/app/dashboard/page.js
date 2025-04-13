"use server";

import DashboardPage from '@/components/dashboard/DashboardPage';
import LogoutButton from '@/components/LogoutButton';
import { getLoggedInUser } from '@/lib/user.actions';
import { createSupabaseClient } from '@/utils/supabase/clients/server';

// const supabase = await createSupabaseClient();

// const loggedIn = await getLoggedInUser();
// const userId = loggedIn?.id;

// console.log(userId || "No user logged in");

// const { data, error } = await supabase
//   .from("users")
//   .select("email")
//   .eq("id", userId)
//   .single();

// console.log(data);

export default async function Dashboard() {
  return (
    <div className="p-28">
        <DashboardPage />
    </div>
  );
}
