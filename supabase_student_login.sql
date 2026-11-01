-- TB Quest — Student login with name + phone + 4-digit key (no OTP, no email)
-- ============================================================================
-- RUN THIS ONCE in Supabase: Dashboard -> SQL Editor -> New query -> paste
-- this whole file -> Run. The app code alone cannot create this table.
-- Project: https://ulhpwvoehhuecddbjohs.supabase.co (same project the app
-- already uses; no new Supabase project, no key change).
--
-- WHAT IT CREATES
--   public.student_accounts — one row per student:
--     id, name, phone (unique, digits only), college, level/xp/accuracy/
--     streak/completed_cases, created_at, last_login_at.
--   All student account data is visible in Supabase (Table Editor) after
--   running this. The 4-digit key itself is NEVER stored: only a salted
--   SHA-256 hash (pin_hash) + a random per-student salt (pin_salt) are
--   stored, and the hash is computed inside Postgres, never in the browser.
--
-- SECURITY — READ THIS
--   * Row Level Security is ON and there is deliberately NO policy that lets
--     the anon/public key read or insert this table directly. If there were,
--     anyone with the publishable key could download every pin_hash and
--     brute-force a 4-digit key offline (only 10,000 combinations).
--   * The app only talks to this table through the three SECURITY DEFINER
--     functions below, which return student rows WITHOUT pin_hash/pin_salt.
--     The plain key travels only over HTTPS to Supabase and is never stored
--     or returned.
--   * A 4-digit key is classroom convenience, not strong security. It is
--     only for students. Faculty/Admin stay on Supabase email + password
--     (see authService.ts). There is no lockout in this version, so a
--     determined attacker could try keys through the login function —
--     that is inherent to any 4-digit code and why it must not be used
--     for faculty/admin accounts.
--   * FORGOT KEY: there is no self-service reset (no OTP, by design).
--     The owner deletes the student's row in Table Editor and the student
--     registers again with the same phone number and a new key.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.student_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null unique,
  college text not null default '',
  pin_hash text not null,
  pin_salt text not null,
  level integer not null default 1,
  xp integer not null default 0,
  accuracy numeric not null default 0,
  streak integer not null default 0,
  completed_cases integer not null default 0,
  created_at timestamptz not null default now(),
  last_login_at timestamptz
);

alter table public.student_accounts enable row level security;
-- Intentionally no SELECT/INSERT/UPDATE/DELETE policies: direct table access
-- from the anon/authenticated keys is denied. Only the functions below
-- (SECURITY DEFINER) may read/write it, and they never return the hash.

-- Register: creates one student row. Phone must be new, key exactly 4 digits.
create or replace function public.register_student_account(
  p_name text, p_phone text, p_college text, p_pin text
)
returns table (
  id uuid, name text, phone text, college text,
  level integer, xp integer, accuracy numeric, streak integer,
  completed_cases integer, created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_salt text := encode(gen_random_bytes(16), 'hex');
  v_hash text;
  v_id uuid; v_name text; v_phone text; v_college text;
  v_level integer; v_xp integer; v_accuracy numeric; v_streak integer;
  v_completed integer; v_created timestamptz;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'Name is required';
  end if;
  if p_pin is null or p_pin !~ '^[0-9]{4}$' then
    raise exception 'Key must be exactly 4 digits';
  end if;
  if p_phone is null or btrim(p_phone) = '' then
    raise exception 'Phone number is required';
  end if;
  if exists (select 1 from public.student_accounts s where s.phone = p_phone) then
    raise exception 'phone already registered';
  end if;

  v_hash := encode(digest(v_salt || p_pin, 'sha256'), 'hex');

  insert into public.student_accounts (name, phone, college, pin_hash, pin_salt)
  values (btrim(p_name), p_phone, coalesce(nullif(btrim(p_college), ''), ''), v_hash, v_salt)
  returning student_accounts.id, student_accounts.name, student_accounts.phone,
            student_accounts.college, student_accounts.level, student_accounts.xp,
            student_accounts.accuracy, student_accounts.streak,
            student_accounts.completed_cases, student_accounts.created_at
  into v_id, v_name, v_phone, v_college, v_level, v_xp, v_accuracy, v_streak,
       v_completed, v_created;

  return query select v_id, v_name, v_phone, v_college, v_level, v_xp,
                      v_accuracy, v_streak, v_completed, v_created;
end;
$$;

-- Login: name + phone + key must all match. Returns the student row
-- (no hash) and stamps last_login_at. Returns zero rows on any mismatch,
-- so the app cannot tell which field was wrong.
create or replace function public.verify_student_login(
  p_name text, p_phone text, p_pin text
)
returns table (
  id uuid, name text, phone text, college text,
  level integer, xp integer, accuracy numeric, streak integer,
  completed_cases integer, created_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid; v_name text; v_phone text; v_college text;
  v_level integer; v_xp integer; v_accuracy numeric; v_streak integer;
  v_completed integer; v_created timestamptz;
begin
  select s.id, s.name, s.phone, s.college, s.level, s.xp, s.accuracy,
         s.streak, s.completed_cases, s.created_at
  into v_id, v_name, v_phone, v_college, v_level, v_xp, v_accuracy,
       v_streak, v_completed, v_created
  from public.student_accounts s
  where s.phone = p_phone
    and lower(btrim(s.name)) = lower(btrim(p_name))
    and s.pin_hash = encode(digest(s.pin_salt || p_pin, 'sha256'), 'hex');

  if not found then
    return;
  end if;

  update public.student_accounts
  set last_login_at = now()
  where student_accounts.id = v_id;

  return query select v_id, v_name, v_phone, v_college, v_level, v_xp,
                      v_accuracy, v_streak, v_completed, v_created;
end;
$$;

-- Session restore: look a student up by id (used on page refresh).
-- Returns the student row without the hash, or zero rows if deleted.
create or replace function public.get_student_account(p_id uuid)
returns table (
  id uuid, name text, phone text, college text,
  level integer, xp integer, accuracy numeric, streak integer,
  completed_cases integer, created_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select s.id, s.name, s.phone, s.college, s.level, s.xp, s.accuracy,
         s.streak, s.completed_cases, s.created_at
  from public.student_accounts s
  where s.id = p_id;
$$;

grant execute on function public.register_student_account(text, text, text, text) to anon, authenticated;
grant execute on function public.verify_student_login(text, text, text) to anon, authenticated;
grant execute on function public.get_student_account(uuid) to anon, authenticated;
