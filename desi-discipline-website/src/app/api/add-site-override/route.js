import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    const { domain, override_type } = await req.json();

    if (!token || !domain || !override_type) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const userId = userData.user.id;

    // Upsert into sites
    const { data: existingSite, error: fetchError } = await supabaseAdmin
    .from('sites')
    .select('site_id')
    .eq('domain', domain)
    .single();

  if (fetchError || !existingSite?.site_id) {
    return NextResponse.json({
      success: false,
      error: `Site '${domain}' is not in the global list. Cannot override.`
    }, { status: 404 });
  }

  const siteId = existingSite.site_id;

  // ✅ STEP 2: Upsert user-specific override
  const { error: overrideError } = await supabaseAdmin
    .from('user_site_settings')
    .upsert([{ user_id: userId, site_id: siteId, override_type }]);

  if (overrideError) {
    return NextResponse.json({ success: false, error: overrideError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} catch (err) {
  console.error("💥 Unexpected error:", err);
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
}
}
