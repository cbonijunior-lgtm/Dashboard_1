const configError = typeof getSupabaseConfigError === 'function' ? getSupabaseConfigError() : null;

const supabase = configError
  ? null
  : window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    });

function requireSupabaseClient() {
  if (supabase) return supabase;
  throw new Error(configError || 'Supabase não configurado.');
}
