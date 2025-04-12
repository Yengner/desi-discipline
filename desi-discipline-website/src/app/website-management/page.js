import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

const supabase = createClient(supabaseUrl, supabaseKey)
const userId = "test"

const { data, error } = await supabase
  .from("users")
  .select("email")
  .eq("id", userId)
  .single();

console.log(data);

export default async function Home() {
  return (
    <div className="p-28">
        <h1>Website Management</h1>
    </div>
  );
}
