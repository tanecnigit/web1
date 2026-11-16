-- ─────────────────────────────────────────────────────────────
-- Taneční škola Nový Jičín – databáze přihlášek (Supabase)
-- Spusťte celé v Supabase: SQL Editor → New query → vložit → Run.
-- Skript lze spustit opakovaně (nic nesmaže ani nezdvojí).
-- ─────────────────────────────────────────────────────────────

-- 1) Tabulka přihlášek
create table if not exists public.prihlasky (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),

  -- údaje z formuláře
  jmeno            text not null check (char_length(jmeno) between 1 and 100),
  prijmeni         text not null check (char_length(prijmeni) between 1 and 100),
  datum_narozeni   date not null check (datum_narozeni between date '1900-01-01' and current_date),
  skola            text not null check (char_length(skola) between 1 and 200),
  adresa           text not null check (char_length(adresa) between 1 and 300),
  email            text not null check (char_length(email) <= 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  telefon          text not null check (char_length(telefon) between 9 and 30),
  poznamka         text check (char_length(poznamka) <= 2000),
  souhlas          boolean not null check (souhlas = true),

  -- interní údaje pro administraci (návštěvník je nastavit nemůže)
  stav             text not null default 'nova'
                   check (stav in ('nova', 'zaplaceno', 'zarazen', 'odhlasen')),
  interni_poznamka text check (char_length(interni_poznamka) <= 2000)
);

create index if not exists prihlasky_created_at_idx on public.prihlasky (created_at desc);

-- 2) Seznam administrátorů (jen účty uvedené zde vidí přihlášky)
create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Je přihlášený uživatel administrátor? (security definer = obejde RLS tabulky admins)
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- 3) Zabezpečení na úrovni řádků (RLS) – bez pravidla nikdo nic nevidí
alter table public.prihlasky enable row level security;
alter table public.admins enable row level security;

-- 4) Oprávnění: návštěvník smí jen vložit vybrané sloupce, nic číst
revoke all on public.prihlasky from anon, authenticated;
revoke all on public.admins from anon, authenticated;

grant usage on schema public to anon, authenticated;

grant insert (jmeno, prijmeni, datum_narozeni, skola, adresa, email, telefon, poznamka, souhlas)
  on public.prihlasky to anon, authenticated;

grant select, delete on public.prihlasky to authenticated;
grant update (stav, interni_poznamka) on public.prihlasky to authenticated;

-- 5) Pravidla (policies)
drop policy if exists "Kdokoli muze odeslat prihlasku" on public.prihlasky;
create policy "Kdokoli muze odeslat prihlasku"
  on public.prihlasky for insert
  to anon, authenticated
  with check (stav = 'nova' and interni_poznamka is null);

drop policy if exists "Admin vidi prihlasky" on public.prihlasky;
create policy "Admin vidi prihlasky"
  on public.prihlasky for select
  to authenticated
  using ((select public.is_admin()));

drop policy if exists "Admin upravuje prihlasky" on public.prihlasky;
create policy "Admin upravuje prihlasky"
  on public.prihlasky for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

drop policy if exists "Admin maze prihlasky" on public.prihlasky;
create policy "Admin maze prihlasky"
  on public.prihlasky for delete
  to authenticated
  using ((select public.is_admin()));

-- ─────────────────────────────────────────────────────────────
-- 6) Až vytvoříte účet administrátora (Authentication → Users → Add user),
--    spusťte zvlášť tento příkaz s jeho e-mailem:
--
--    insert into public.admins (user_id)
--    select id from auth.users where email = 'SEM-E-MAIL-ADMINA'
--    on conflict do nothing;
-- ─────────────────────────────────────────────────────────────
