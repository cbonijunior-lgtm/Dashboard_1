// Substitua pelos valores do seu projeto em: Dashboard → Project Settings → API
// Schema da tabela: supabase-schema.js | SQL: supabase/setup.sql

const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_ANON_KEY_AQUI';

// Opcional: fixe a URL publicada (ex.: GitHub Pages). Deixe null para detectar automaticamente.
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
    return 'Configure SUPABASE_URL em supabase-config.js (Project Settings → API → Project URL) e publique de novo.';
  }
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('SUA_ANON_KEY')) {
    return 'Configure SUPABASE_ANON_KEY em supabase-config.js (Project Settings → API → anon public) e publique de novo.';
  }
  return 'supabase-config.js parece inválido. Revise URL e anon key do Supabase.';
}

// URL base do app (funciona local e no GitHub Pages /Dashboard_1/)
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
