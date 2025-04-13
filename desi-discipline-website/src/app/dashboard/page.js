"use server";

import LogoutButton from '@/components/LogoutButton';
import { getLoggedInUser } from '@/lib/user.actions';
import { createSupabaseClient } from '@/utils/supabase/clients/server';

const supabase = await createSupabaseClient();

const loggedIn = await getLoggedInUser();
const userId = loggedIn?.id;

console.log(userId || "No user logged in");

// const { data, error } = await supabase
//   .from("users")
//   .select("email")
//   .eq("id", userId)
//   .single();

// console.log(data);

export default async function WE() {
  return (
    <div className="p-28">
        <h1>Dashboard</h1>
        <LogoutButton />
    </div>
  );
}
