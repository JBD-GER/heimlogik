-- Project-level remote access checklist and documentation.
create table if not exists public.project_remote_access_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  item_key text not null,
  title text not null,
  is_completed boolean not null default false,
  fields jsonb not null default '{}'::jsonb,
  notes text,
  completed_at timestamptz,
  updated_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint project_remote_access_items_unique unique (project_id, item_key)
);

create index if not exists idx_project_remote_access_items_project on public.project_remote_access_items(project_id);
create index if not exists idx_project_remote_access_items_completed on public.project_remote_access_items(project_id, is_completed);

drop trigger if exists set_project_remote_access_items_updated_at on public.project_remote_access_items;
create trigger set_project_remote_access_items_updated_at
  before update on public.project_remote_access_items
  for each row execute function public.set_updated_at();

alter table public.project_remote_access_items enable row level security;

drop policy if exists project_remote_access_items_select_active_staff on public.project_remote_access_items;
create policy project_remote_access_items_select_active_staff
on public.project_remote_access_items
for select to authenticated
using (public.is_active_staff());

drop policy if exists project_remote_access_items_insert_active_staff on public.project_remote_access_items;
create policy project_remote_access_items_insert_active_staff
on public.project_remote_access_items
for insert to authenticated
with check (public.is_active_staff());

drop policy if exists project_remote_access_items_update_active_staff on public.project_remote_access_items;
create policy project_remote_access_items_update_active_staff
on public.project_remote_access_items
for update to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists project_remote_access_items_delete_admin on public.project_remote_access_items;
create policy project_remote_access_items_delete_admin
on public.project_remote_access_items
for delete to authenticated
using (public.is_admin());
