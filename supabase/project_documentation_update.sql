-- Flexible project documentation categories and file notes.
-- Run once in Supabase SQL editor after the base Heimlogik schema.

create table if not exists public.project_document_categories (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  slug text not null,
  is_default boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, slug)
);

alter table public.files
  add column if not exists document_category_id uuid references public.project_document_categories(id) on delete set null,
  add column if not exists notes text;

create index if not exists idx_project_document_categories_project on public.project_document_categories(project_id);
create index if not exists idx_project_document_categories_slug on public.project_document_categories(project_id, slug);
create index if not exists idx_files_document_category on public.files(document_category_id);

drop trigger if exists set_project_document_categories_updated_at on public.project_document_categories;
create trigger set_project_document_categories_updated_at
  before update on public.project_document_categories
  for each row execute function public.set_updated_at();

alter table public.project_document_categories enable row level security;

drop policy if exists project_document_categories_select_active_staff on public.project_document_categories;
create policy project_document_categories_select_active_staff
on public.project_document_categories
for select
to authenticated
using (public.is_active_staff());

drop policy if exists project_document_categories_insert_active_staff on public.project_document_categories;
create policy project_document_categories_insert_active_staff
on public.project_document_categories
for insert
to authenticated
with check (public.is_active_staff());

drop policy if exists project_document_categories_update_active_staff on public.project_document_categories;
create policy project_document_categories_update_active_staff
on public.project_document_categories
for update
to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists project_document_categories_delete_admin on public.project_document_categories;
create policy project_document_categories_delete_admin
on public.project_document_categories
for delete
to authenticated
using (public.is_admin());
