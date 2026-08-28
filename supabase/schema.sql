create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  locale text not null default 'es' check (locale in ('es','en')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('free','trial','premium')),
  status text not null default 'active' check (status in ('active','canceled','past_due')),
  trial_ends_at timestamptz,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decision_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in ('prompt','challenge','diagnosis')),
  template text check (template in ('contenido','estrategia','producto','linkedin')),
  raw_input text,
  generated_output text,
  coherence_score int check (coherence_score between 0 and 100),
  was_blocked boolean not null default false,
  archetype text check (archetype in ('lineal','divergente','tactico','exploracion')),
  biases jsonb default '[]'::jsonb,
  vector_before jsonb,
  vector_after jsonb,
  challenge_id text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  was_correct boolean,
  created_at timestamptz not null default now()
);

create table public.cognitive_vectors (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  clarity numeric not null default 0,
  coherence numeric not null default 0,
  depth numeric not null default 0,
  structure numeric not null default 0,
  second_order numeric not null default 0,
  bias_control numeric not null default 0,
  maturity_state text not null default 'reactive_operator',
  updated_at timestamptz not null default now()
);

create or replace function public.is_admin(uid uuid)
returns boolean language sql security definer set search_path = public as $$
  select coalesce((select is_admin from public.profiles where id = uid), false);
$$;

alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.decision_points enable row level security;
alter table public.cognitive_vectors enable row level security;

create policy "own profile" on public.profiles for all using (auth.uid() = id or public.is_admin(auth.uid()));
create policy "own subscription" on public.subscriptions for select using (auth.uid() = user_id or public.is_admin(auth.uid()));
create policy "own decisions" on public.decision_points for all using (auth.uid() = user_id or public.is_admin(auth.uid())) with check (auth.uid() = user_id);
create policy "own vector" on public.cognitive_vectors for select using (auth.uid() = user_id or public.is_admin(auth.uid()));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  insert into public.subscriptions (user_id, plan, status, trial_ends_at)
  values (new.id, 'trial', 'active', now() + interval '15 days');
  insert into public.cognitive_vectors (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();