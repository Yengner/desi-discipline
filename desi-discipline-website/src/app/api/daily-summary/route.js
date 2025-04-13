import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET(req) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const today = new Date().toISOString().split("T")[0];

  const { data: userData, error: authError } = await client.auth.getUser(); // ✅ fix here
  if (authError || !userData?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = userData.user.id;

  const { data, error } = await client
    .from("daily_stats")
    .select("total_study_time")
    .eq("user_id", userId)
    .eq("date", today)
    .limit(1);

    
  return NextResponse.json({
    productive: data?.[0]?.total_study_time ?? 0,
  });
}