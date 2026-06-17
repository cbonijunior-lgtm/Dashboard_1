// Substitua pelos valores do seu projeto em: Dashboard → Project Settings → API
// Schema da tabela: supabase-schema.js | SQL: supabase/setup.sql

const SUPABASE_URL = 'https://abjoifjfrtdaxtjtmeqk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiam9pZmpmcnRkYXh0anRtZXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNDI2MzUsImV4cCI6MjA5NjkxODYzNX0.oHl1G23YOCqapKMNgnD855wNrOvvLVtopbNWaLlugvo';

// URL publicada na Vercel (deve bater com Authentication → URL Configuration no Supabase)
const APP_BASE_URL = 'https://dashboard-1-phi-eight.vercel.app/';

function isSupabaseConfigured() {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_ANON_KEY &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_URL.includes('.supabase.co') &&
    !SUPABASE_URL.includes('/rest/v1') &&
    !SUPABASE_URL.includes('SEU_PROJETO') &&
    !SUPABASE_ANON_KEY.includes('SUA_ANON_KEY') &&
    SUPABASE_ANON_KEY.length > 20
  );
}

function getSupabaseConfigError() {
  if (isSupabaseConfigured()) return null;

  if (!SUPABASE_URL || SUPABASE_URL.includes('SEU_PROJETO')) {
    return 'Configure SUPABASE_URL em supabase-config.js (Project Settings → API → Project URL) e publique de novo.';
  }
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('SUA_ANON_KEY')) {
    return 'Configure SUPABASE_ANON_KEY em supabase-config.js (Project Settings → API → anon public) e publique de novo.';
  }
  return 'supabase-config.js parece inválido. Revise URL e anon key do Supabase.';
}

// URL base do app (Vercel, GitHub Pages ou detectado automaticamente)
function getAppBaseUrl() {
  if (typeof APP_BASE_URL === 'string' && APP_BASE_URL.startsWith('http')) {
    return APP_BASE_URL.endsWith('/') ? APP_BASE_URL : `${APP_BASE_URL}/`;
  }

  const path = window.location.pathname;
  const dir = path.endsWith('.html')
    ? path.slice(0, path.lastIndexOf('/') + 1)
    : (path.endsWith('/') ? path : `${path}/`);

  return `${window.location.origin}${dir}`;
}

function getAppUrl(filename) {
  return `${getAppBaseUrl()}${filename}`;
}

function getSupabaseAuthRedirectUrls() {
  const base = getAppBaseUrl().replace(/\/$/, '');
  return [base, `${base}/`, `${base}/index.html`, `${base}/login.html`];
}
