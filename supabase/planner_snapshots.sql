create table if not exists public.planner_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  snapshot jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.planner_snapshots enable row level security;

create or replace function public.set_planner_snapshots_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_planner_snapshots_updated_at on public.planner_snapshots;

create trigger set_planner_snapshots_updated_at
before update on public.planner_snapshots
for each row
execute function public.set_planner_snapshots_updated_at();

drop policy if exists "Users can select their planner snapshot" on public.planner_snapshots;
create policy "Users can select their planner snapshot"
on public.planner_snapshots
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert their planner snapshot" on public.planner_snapshots;
create policy "Users can insert their planner snapshot"
on public.planner_snapshots
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update their planner snapshot" on public.planner_snapshots;
create policy "Users can update their planner snapshot"
on public.planner_snapshots
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

do $$
begin
  alter publication supabase_realtime add table public.planner_snapshots;
exception
  when duplicate_object then null;
end
$$;
