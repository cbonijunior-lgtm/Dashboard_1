const AUTH_ERROR_MESSAGES = {
  'Invalid login credentials': 'E-mail ou senha incorretos.',
  'Email not confirmed': 'E-mail ainda não confirmado. Abra o link enviado para sua caixa de entrada.',
  'User already registered': 'Este e-mail já está cadastrado. Use a aba Entrar.',
  'Password should be at least 6 characters': 'A senha deve ter no mínimo 6 caracteres.',
  'Unable to validate email address: invalid format': 'Formato de e-mail inválido.',
  'Signup requires a valid password': 'Informe uma senha válida com no mínimo 6 caracteres.'
};

function translateAuthError(error) {
  if (!error) return 'Erro desconhecido.';
  if (error.message?.includes('Failed to fetch')) {
    return 'Não foi possível conectar ao Supabase. Verifique supabase-config.js, internet e se está usando um servidor local (não abra o HTML direto pelo Finder).';
  }
  return AUTH_ERROR_MESSAGES[error.message] || error.message;
}

function getInitials(user) {
  const name = user?.user_metadata?.full_name || user?.email || '';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return '??';
}

function updateUserUI(user) {
  const avatar = document.getElementById('userAvatar');
  const greeting = document.getElementById('userGreeting');
  const fullName = user?.user_metadata?.full_name;

  if (avatar) avatar.textContent = getInitials(user);
  if (greeting && fullName) greeting.textContent = `Olá, ${fullName.split(' ')[0]}`;
}

function showAuthMessage(element, message, type) {
  element.textContent = message;
  element.className = `auth-message ${type}`;
  element.hidden = !message;
}

function setFormLoading(form, loading) {
  form.querySelector('button[type="submit"]').disabled = loading;
  form.classList.toggle('is-loading', loading);
}

function showConfigError() {
  const messageEl = document.getElementById('authMessage');
  const configError = getSupabaseConfigError();
  if (!messageEl || !configError) return false;

  const urls = getSupabaseAuthRedirectUrls().join('\n');
  showAuthMessage(
    messageEl,
    `${configError}\n\nNo Supabase (Authentication → URL Configuration), adicione:\nSite URL: ${getAppBaseUrl()}\nRedirect URLs:\n${urls}`,
    'error'
  );
  document.querySelectorAll('.auth-form button[type="submit"]').forEach(btn => {
    btn.disabled = true;
  });
  return true;
}

async function initAuthGuard(onAuthenticated) {
  if (!isSupabaseConfigured()) {
    window.location.replace('login.html');
    return;
  }

  const client = requireSupabaseClient();
  const { data: { session } } = await client.auth.getSession();

  if (!session) {
    window.location.replace('login.html');
    return;
  }

  updateUserUI(session.user);
  onAuthenticated?.(session.user);

  client.auth.onAuthStateChange((_event, newSession) => {
    if (!newSession) window.location.replace('login.html');
  });
}

async function handleLogout(event) {
  event.preventDefault();
  const client = requireSupabaseClient();
  await client.auth.signOut();
  window.location.replace('login.html');
}

async function redirectIfAuthenticated() {
  if (!isSupabaseConfigured()) return;

  const client = requireSupabaseClient();
  const { data: { session } } = await client.auth.getSession();
  if (session) window.location.replace('index.html');
}

async function handleSignIn(event) {
  event.preventDefault();
  if (!isSupabaseConfigured()) {
    showConfigError();
    return;
  }

  const form = event.target;
  const messageEl = document.getElementById('authMessage');
  const email = form.email.value.trim();
  const password = form.password.value;

  showAuthMessage(messageEl, '', '');
  setFormLoading(form, true);

  try {
    const client = requireSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      showAuthMessage(messageEl, translateAuthError(error), 'error');
      return;
    }

    if (!data.session) {
      showAuthMessage(messageEl, 'Sessão não foi criada. Tente novamente.', 'error');
      return;
    }

    window.location.replace('index.html');
  } catch (err) {
    showAuthMessage(messageEl, err.message, 'error');
  } finally {
    setFormLoading(form, false);
  }
}

async function handleSignUp(event) {
  event.preventDefault();
  if (!isSupabaseConfigured()) {
    showConfigError();
    return;
  }

  const form = event.target;
  const messageEl = document.getElementById('authMessage');
  const full_name = form.full_name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;

  showAuthMessage(messageEl, '', '');
  setFormLoading(form, true);

  try {
    const client = requireSupabaseClient();
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
        emailRedirectTo: getAppUrl('index.html')
      }
    });

    if (error) {
      showAuthMessage(messageEl, translateAuthError(error), 'error');
      return;
    }

    if (data.session) {
      window.location.replace('index.html');
      return;
    }

    showAuthMessage(
      messageEl,
      'Conta criada! Verifique seu e-mail e clique no link de confirmação. Depois volte na aba Entrar. (Ou desative "Confirm email" em Authentication → Providers no Supabase.)',
      'success'
    );
    form.reset();
  } catch (err) {
    showAuthMessage(messageEl, err.message, 'error');
  } finally {
    setFormLoading(form, false);
  }
}

function initLoginPage() {
  if (showConfigError()) return;

  redirectIfAuthenticated();

  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === target));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      showAuthMessage(document.getElementById('authMessage'), '', '');
    });
  });

  loginForm.addEventListener('submit', handleSignIn);
  signupForm.addEventListener('submit', handleSignUp);
}

function bindLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
}
