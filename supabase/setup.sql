-- Schema alinhado com cotacoes.csv
-- Execute no SQL Editor do Supabase (Dashboard → SQL → New query)

create table if not exists public.cotacoes (
  id bigint generated always as identity primary key,
  ticker text not null,
  empresa text not null,
  preco numeric(12, 2) not null,
  abertura numeric(12, 2) not null,
  maxima numeric(12, 2) not null,
  minima numeric(12, 2) not null,
  variacao_dia numeric(8, 2) not null,
  volume bigint not null,
  data date not null,
  created_at timestamptz not null default now()
);

create index if not exists cotacoes_ticker_idx on public.cotacoes (ticker);
create index if not exists cotacoes_data_idx on public.cotacoes (data desc);

alter table public.cotacoes enable row level security;

drop policy if exists "Usuarios autenticados podem ler cotacoes" on public.cotacoes;
create policy "Usuarios autenticados podem ler cotacoes"
  on public.cotacoes
  for select
  to authenticated
  using (true);

-- Perfil opcional (full_name também fica em auth.users.raw_user_meta_data no signUp)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Usuario le proprio perfil" on public.profiles;
create policy "Usuario le proprio perfil"
  on public.profiles
  for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Usuario atualiza proprio perfil" on public.profiles;
create policy "Usuario atualiza proprio perfil"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Usuario insere proprio perfil" on public.profiles;
create policy "Usuario insere proprio perfil"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Exemplo de insert (substitua pelos seus dados ou importe o CSV)
-- insert into public.cotacoes (ticker, empresa, preco, abertura, maxima, minima, variacao_dia, volume, data)
-- values ('HGLG11', 'CSHG Logística FII', 158.42, 157.20, 159.85, 156.90, 0.78, 1245800, '2026-06-13');
