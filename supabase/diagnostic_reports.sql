-- Modular diagnostic reports, optional signatures and generated PDF reports.

alter table public.diagnostics
  add column if not exists diagnostic_number text,
  add column if not exists ai_analysis text,
  add column if not exists ai_model text,
  add column if not exists ai_generated_at timestamptz,
  add column if not exists report_file_id uuid references public.files(id) on delete set null,
  add column if not exists report_generated_at timestamptz,
  add column if not exists report_status text not null default 'draft';

create unique index if not exists idx_diagnostics_diagnostic_number_unique
  on public.diagnostics(diagnostic_number)
  where diagnostic_number is not null;

create table if not exists public.diagnostic_modules (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  module_type text not null default 'custom',
  title text not null,
  affected_area text,
  affected_systems text[] not null default '{}',
  floor_id uuid references public.floors(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  observation text,
  expected_state text,
  actual_state text,
  evidence text,
  recommendation text,
  severity public.priority_level not null default 'normal',
  notes text,
  sort_order integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.diagnostic_modules
  add column if not exists photo_file_id uuid references public.files(id) on delete set null;

alter table public.files
  add column if not exists diagnostic_module_id uuid references public.diagnostic_modules(id) on delete cascade;

create table if not exists public.diagnostic_signatures (
  id uuid primary key default gen_random_uuid(),
  diagnostic_id uuid not null references public.diagnostics(id) on delete cascade,
  signer_type text not null check (signer_type in ('heimlogik', 'customer')),
  signer_name text not null,
  signature_data_url text not null,
  signed_at timestamptz not null default now(),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint diagnostic_signatures_unique_signer unique (diagnostic_id, signer_type)
);

create index if not exists idx_diagnostic_modules_diagnostic on public.diagnostic_modules(diagnostic_id);
create index if not exists idx_diagnostic_modules_type on public.diagnostic_modules(module_type);
create index if not exists idx_diagnostic_modules_room on public.diagnostic_modules(room_id);
create index if not exists idx_diagnostic_modules_photo_file on public.diagnostic_modules(photo_file_id);
create index if not exists idx_files_diagnostic_module on public.files(diagnostic_module_id);
create index if not exists idx_diagnostic_signatures_diagnostic on public.diagnostic_signatures(diagnostic_id);

drop trigger if exists set_diagnostic_modules_updated_at on public.diagnostic_modules;
create trigger set_diagnostic_modules_updated_at
  before update on public.diagnostic_modules
  for each row execute function public.set_updated_at();

drop trigger if exists set_diagnostic_signatures_updated_at on public.diagnostic_signatures;
create trigger set_diagnostic_signatures_updated_at
  before update on public.diagnostic_signatures
  for each row execute function public.set_updated_at();

alter table public.diagnostic_modules enable row level security;
alter table public.diagnostic_signatures enable row level security;

drop policy if exists diagnostic_modules_select_active_staff on public.diagnostic_modules;
create policy diagnostic_modules_select_active_staff
on public.diagnostic_modules
for select to authenticated
using (public.is_active_staff());

drop policy if exists diagnostic_modules_insert_active_staff on public.diagnostic_modules;
create policy diagnostic_modules_insert_active_staff
on public.diagnostic_modules
for insert to authenticated
with check (public.is_active_staff());

drop policy if exists diagnostic_modules_update_active_staff on public.diagnostic_modules;
create policy diagnostic_modules_update_active_staff
on public.diagnostic_modules
for update to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists diagnostic_modules_delete_admin on public.diagnostic_modules;
create policy diagnostic_modules_delete_admin
on public.diagnostic_modules
for delete to authenticated
using (public.is_admin());

drop policy if exists diagnostic_signatures_select_active_staff on public.diagnostic_signatures;
create policy diagnostic_signatures_select_active_staff
on public.diagnostic_signatures
for select to authenticated
using (public.is_active_staff());

drop policy if exists diagnostic_signatures_insert_active_staff on public.diagnostic_signatures;
create policy diagnostic_signatures_insert_active_staff
on public.diagnostic_signatures
for insert to authenticated
with check (public.is_active_staff());

drop policy if exists diagnostic_signatures_update_active_staff on public.diagnostic_signatures;
create policy diagnostic_signatures_update_active_staff
on public.diagnostic_signatures
for update to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists diagnostic_signatures_delete_admin on public.diagnostic_signatures;
create policy diagnostic_signatures_delete_admin
on public.diagnostic_signatures
for delete to authenticated
using (public.is_admin());
