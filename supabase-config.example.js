// Copie este arquivo para supabase-config.js e preencha com os dados do seu projeto Supabase.
// Dashboard → Project Settings → API
//
// IMPORTANTE para site publicado (GitHub Pages):
// 1. supabase-config.js PRECISA ir pro repositório (a anon key pode ser pública).
// 2. No Supabase → Authentication → URL Configuration:
//    Site URL: https://SEU_USUARIO.github.io/Dashboard_1/
//    Redirect URLs: https://SEU_USUARIO.github.io/Dashboard_1/**
// 3. Faça commit de login.html, auth.js, supabase-*.js e supabase-config.js.

const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

// Opcional: fixe a URL publicada. Deixe null para detectar automaticamente.
const APP_BASE_URL = 'https://cbonijunior-lgtm.github.io/Dashboard_1/';

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_URL.includes('.supabase.co') &&
    !SUPABASE_URL.includes('SEU_PROJETO') &&
    !SUPABASE_ANON_KEY.includes('SUA_ANON_KEY') &&
    SUPABASE_ANON_KEY.length > 20
  );
}

function getSupabaseConfigError() {
  if (isSupabaseConfigured()) return null;

  if (!SUPABASE_URL || SUPABASE_URL.includes('SEU_PROJETO')) {
    return 'Configure SUPABASE_URL em supabase-config.js (Project Settings → API → Project URL).';
  }
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('SUA_ANON_KEY')) {
    return 'Configure SUPABASE_ANON_KEY em supabase-config.js (Project Settings → API → anon public).';
  }
  return 'supabase-config.js parece inválido. Revise URL e anon key do Supabase.';
}
