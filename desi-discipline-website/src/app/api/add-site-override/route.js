import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '');
  const { domain, override_type } = await req.json();

  if (!token || !domain || !override_type) {
    return { success: false, error: 'Missing fields' }, { status: 400 }
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user?.id) {
    return { success: false, error: 'Unauthorized' }
  }

  const userId = userData.user.id;

  // Upsert into sites
  const { data: siteRecord, error: siteError } = await supabaseAdmin
    .from("sites")
    .upsert([{ domain, category: override_type }], { onConflict: "domain" })
    .select()
    .single();

  if (siteError) {
    return { success: false, error: siteError.message };
  }

  const siteId = siteRecord.site_id;

  // Insert user-specific override
  const { error: overrideError } = await supabaseAdmin
    .from("user_site_settings")
    .upsert([{ user_id: userId, site_id: siteId, override_type }]);

  if (overrideError) {
    return { success: false, error: overrideError.message }
  }

  return { success: true };
}
