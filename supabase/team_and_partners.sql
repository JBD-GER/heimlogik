-- Staff members, professional partners and project assignments.

do $$
begin
  if not exists (select 1 from pg_type where typname = 'staff_title') then
    create type public.staff_title as enum (
      'geschaeftsfuehrer',
      'projektleiter',
      'smart_home_planer',
      'systemintegrator',
      'knx_spezialist',
      'techniker',
      'programmierer',
      'vertrieb',
      'buchhaltung',
      'assistenz'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'professional_partner_area') then
    create type public.professional_partner_area as enum (
      'elektrobetrieb',
      'knx_gebaeudeautomation',
      'heizung_sanitaer',
      'energieberatung',
      'pv_speicher_wallbox',
      'netzwerk_it',
      'sicherheitstechnik',
      'audio_video',
      'beschattung_sonnenschutz',
      'architektur_planung',
      'trockenbau_innenausbau',
      'bauunternehmen_gu',
      'hersteller_lieferant',
      'sonstiges'
    );
  end if;
end $$;

create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  email text,
  phone text,
  title public.staff_title not null default 'techniker',
  image_storage_bucket text,
  image_storage_path text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.professional_partners (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  area public.professional_partner_area not null default 'sonstiges',
  street text,
  house_number text,
  postal_code text,
  city text,
  country text not null default 'Deutschland',
  phone text,
  email text,
  website text,
  logo_storage_bucket text,
  logo_storage_path text,
  is_active boolean not null default true,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.professional_partners
  add column if not exists area public.professional_partner_area not null default 'sonstiges';

create table if not exists public.project_staff_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  staff_member_id uuid not null references public.staff_members(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (project_id, staff_member_id)
);

create table if not exists public.project_professional_partners (
  project_id uuid not null references public.projects(id) on delete cascade,
  professional_partner_id uuid not null references public.professional_partners(id) on delete cascade,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  primary key (project_id, professional_partner_id)
);

create index if not exists idx_staff_members_active_title on public.staff_members(is_active, title);
create index if not exists idx_staff_members_email on public.staff_members(email);
create index if not exists idx_professional_partners_active on public.professional_partners(is_active);
create index if not exists idx_professional_partners_active_area on public.professional_partners(is_active, area);
create index if not exists idx_professional_partners_company on public.professional_partners(company_name);
create index if not exists idx_project_staff_members_staff on public.project_staff_members(staff_member_id);
create index if not exists idx_project_professional_partners_partner on public.project_professional_partners(professional_partner_id);

drop trigger if exists set_staff_members_updated_at on public.staff_members;
create trigger set_staff_members_updated_at
  before update on public.staff_members
  for each row execute function public.set_updated_at();

drop trigger if exists set_professional_partners_updated_at on public.professional_partners;
create trigger set_professional_partners_updated_at
  before update on public.professional_partners
  for each row execute function public.set_updated_at();

alter table public.staff_members enable row level security;
alter table public.professional_partners enable row level security;
alter table public.project_staff_members enable row level security;
alter table public.project_professional_partners enable row level security;

drop policy if exists staff_members_select_active_staff on public.staff_members;
create policy staff_members_select_active_staff
on public.staff_members
for select to authenticated
using (public.is_active_staff());

drop policy if exists staff_members_insert_admin on public.staff_members;
create policy staff_members_insert_admin
on public.staff_members
for insert to authenticated
with check (public.is_admin());

drop policy if exists staff_members_update_admin on public.staff_members;
create policy staff_members_update_admin
on public.staff_members
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists staff_members_delete_admin on public.staff_members;
create policy staff_members_delete_admin
on public.staff_members
for delete to authenticated
using (public.is_admin());

drop policy if exists professional_partners_select_active_staff on public.professional_partners;
create policy professional_partners_select_active_staff
on public.professional_partners
for select to authenticated
using (public.is_active_staff());

drop policy if exists professional_partners_insert_admin on public.professional_partners;
create policy professional_partners_insert_admin
on public.professional_partners
for insert to authenticated
with check (public.is_admin());

drop policy if exists professional_partners_update_admin on public.professional_partners;
create policy professional_partners_update_admin
on public.professional_partners
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists professional_partners_delete_admin on public.professional_partners;
create policy professional_partners_delete_admin
on public.professional_partners
for delete to authenticated
using (public.is_admin());

drop policy if exists project_staff_members_select_active_staff on public.project_staff_members;
create policy project_staff_members_select_active_staff
on public.project_staff_members
for select to authenticated
using (public.is_active_staff());

drop policy if exists project_staff_members_write_active_staff on public.project_staff_members;
create policy project_staff_members_write_active_staff
on public.project_staff_members
for all to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists project_professional_partners_select_active_staff on public.project_professional_partners;
create policy project_professional_partners_select_active_staff
on public.project_professional_partners
for select to authenticated
using (public.is_active_staff());

drop policy if exists project_professional_partners_write_active_staff on public.project_professional_partners;
create policy project_professional_partners_write_active_staff
on public.project_professional_partners
for all to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());
