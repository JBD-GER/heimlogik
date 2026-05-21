-- Heimlogik CRM / Project Management schema for Supabase
-- Run this in the Supabase SQL editor after creating the project.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_role') then
    create type public.profile_role as enum ('admin', 'project_lead', 'technician', 'sales', 'accounting', 'external');
  end if;

  if not exists (select 1 from pg_type where typname = 'customer_type') then
    create type public.customer_type as enum ('private', 'business');
  end if;

  if not exists (select 1 from pg_type where typname = 'address_type') then
    create type public.address_type as enum ('primary', 'billing', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'lead_source') then
    create type public.lead_source as enum ('google_ads', 'referral', 'website', 'partner', 'electrician', 'existing_customer', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'customer_status') then
    create type public.customer_status as enum ('lead', 'first_contact', 'qualified', 'active', 'completed', 'care', 'inactive');
  end if;

  if not exists (select 1 from pg_type where typname = 'building_type') then
    create type public.building_type as enum ('single_family_house', 'multi_family_house', 'apartment', 'commercial', 'office', 'medical_practice', 'new_build', 'existing_build', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'construction_phase') then
    create type public.construction_phase as enum ('existing', 'shell_construction', 'renovation', 'new_build_planning', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'project_status') then
    create type public.project_status as enum ('new', 'initial_consultation', 'planning', 'onsite_appointment', 'diagnostics', 'offer', 'commissioned', 'electrical_work', 'programming', 'installation', 'acceptance', 'documentation', 'care', 'error', 'paused', 'completed', 'lost');
  end if;

  if not exists (select 1 from pg_type where typname = 'priority_level') then
    create type public.priority_level as enum ('low', 'normal', 'high', 'critical');
  end if;

  if not exists (select 1 from pg_type where typname = 'system_type') then
    create type public.system_type as enum ('knx', 'dali', 'busch_jaeger_free_at_home', 'home_assistant', 'loxone', 'shelly', 'matter', 'zigbee', 'sonos', 'bose', 'network', 'wifi', 'cameras', 'alarm_system', 'door_communication', 'shading', 'heating', 'lighting', 'audio', 'energy_management', 'wallbox', 'pv_system', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'system_status') then
    create type public.system_status as enum ('planned', 'existing', 'checked', 'faulty', 'replaced', 'removed');
  end if;

  if not exists (select 1 from pg_type where typname = 'diagnostic_status') then
    create type public.diagnostic_status as enum ('new', 'in_review', 'error_found', 'customer_question_open', 'solution_suggested', 'resolved', 'not_solvable', 'completed');
  end if;

  if not exists (select 1 from pg_type where typname = 'error_category') then
    create type public.error_category as enum ('bus_problem', 'network', 'programming', 'wiring', 'dali', 'knx', 'visualization', 'app', 'wifi', 'hardware_defect', 'user_error', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'room_type') then
    create type public.room_type as enum ('living_room', 'kitchen', 'bathroom', 'bedroom', 'office', 'technical_room', 'hallway', 'outdoor', 'children_room', 'dining_room', 'utility_room', 'garage', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'room_feature_type') then
    create type public.room_feature_type as enum ('lighting', 'shading', 'heating', 'presence_detector', 'switch', 'audio', 'network', 'camera', 'door_communication', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'planning_area') then
    create type public.planning_area as enum ('lighting', 'shading', 'heating', 'network', 'audio', 'security', 'visualization', 'automation', 'energy', 'documentation', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'planning_status') then
    create type public.planning_status as enum ('idea', 'planned', 'in_progress', 'done', 'discarded');
  end if;

  if not exists (select 1 from pg_type where typname = 'offer_status') then
    create type public.offer_status as enum ('draft', 'sent', 'accepted', 'rejected', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'offer_item_category') then
    create type public.offer_item_category as enum ('planning', 'programming', 'installation', 'hardware', 'documentation', 'care', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'invoice_status') then
    create type public.invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'documentation_category') then
    create type public.documentation_category as enum ('knx_group_addresses', 'dali_documentation', 'network_topology', 'credential_notes', 'device_overview', 'visualization', 'automations', 'user_manual', 'acceptance_protocol', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'documentation_status') then
    create type public.documentation_status as enum ('draft', 'internal_reviewed', 'delivered_to_customer', 'archived');
  end if;

  if not exists (select 1 from pg_type where typname = 'sla_level') then
    create type public.sla_level as enum ('basic', 'standard', 'premium');
  end if;

  if not exists (select 1 from pg_type where typname = 'support_case_status') then
    create type public.support_case_status as enum ('new', 'open', 'in_progress', 'waiting_for_customer', 'waiting_for_third_party', 'resolved', 'closed');
  end if;

  if not exists (select 1 from pg_type where typname = 'task_type') then
    create type public.task_type as enum ('task', 'appointment', 'callback', 'onsite_appointment', 'programming', 'electrician_coordination', 'acceptance', 'maintenance');
  end if;

  if not exists (select 1 from pg_type where typname = 'task_status') then
    create type public.task_status as enum ('open', 'in_progress', 'done', 'postponed', 'cancelled');
  end if;

  if not exists (select 1 from pg_type where typname = 'file_category') then
    create type public.file_category as enum ('floor_plan', 'photo', 'offer_pdf', 'invoice_pdf', 'documentation', 'diagnostic_image', 'acceptance_protocol', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'activity_type') then
    create type public.activity_type as enum ('note', 'status_change', 'file_uploaded', 'diagnostic_started', 'offer_created', 'invoice_created', 'task_created', 'care_activated', 'error_reported');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.profile_role not null default 'external',
  phone text,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),
  customer_type public.customer_type not null default 'private',
  first_name text,
  last_name text,
  company_name text,
  contact_person text,
  email citext,
  phone text,
  mobile text,
  notes text,
  lead_source public.lead_source not null default 'website',
  customer_status public.customer_status not null default 'lead',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint customers_private_name_check check (
    customer_type <> 'private' or first_name is not null or last_name is not null
  ),
  constraint customers_business_name_check check (
    customer_type <> 'business' or company_name is not null
  )
);

create table if not exists public.customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  address_type public.address_type not null default 'primary',
  street text not null,
  house_number text,
  postal_code text not null,
  city text not null,
  country text not null default 'Deutschland',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  property_name text not null,
  street text,
  house_number text,
  postal_code text,
  city text,
  country text not null default 'Deutschland',
  building_type public.building_type not null default 'single_family_house',
  construction_phase public.construction_phase not null default 'existing',
  living_area_sqm numeric(10,2),
  floors_count integer,
  rooms_count integer,
  has_technical_room boolean not null default false,
  has_network boolean not null default false,
  has_knx boolean not null default false,
  has_dali boolean not null default false,
  has_free_at_home boolean not null default false,
  has_home_assistant boolean not null default false,
  wifi_coverage_known boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_name text not null,
  description text,
  priority public.priority_level not null default 'normal',
  desired_start_at timestamptz,
  planned_start_at timestamptz,
  planned_end_at timestamptz,
  actual_start_at timestamptz,
  actual_end_at timestamptz,
  responsible_profile_id uuid references public.profiles(id) on delete set null,
  project_status public.project_status not null default 'new',
  rough_budget numeric(12,2),
  offer_value numeric(12,2),
  internal_notes text,
  customer_requests text,
  risks text,
  next_step text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_systems (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  system_type public.system_type not null,
  manufacturer text,
  model text,
  serial_number text,
  ip_address inet,
  credential_note text,
  status public.system_status not null default 'planned',
  description text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.diagnostics (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  problem_description text,
  affected_systems public.system_type[] not null default '{}',
  customer_report text,
  internal_assessment text,
  error_category public.error_category not null default 'other',
  priority public.priority_level not null default 'normal',
  status public.diagnostic_status not null default 'new',
  checked_at timestamptz,
  result text,
  recommended_action text,
  effort_estimate text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.floors (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  floor_name text not null,
  level_number integer not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  floor_id uuid references public.floors(id) on delete set null,
  room_name text not null,
  room_type public.room_type not null default 'other',
  area_sqm numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.room_features (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  system_id uuid references public.project_systems(id) on delete set null,
  feature_type public.room_feature_type not null,
  status public.system_status not null default 'planned',
  quantity numeric(10,2),
  description text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.planning_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete set null,
  system_id uuid references public.project_systems(id) on delete set null,
  title text not null,
  description text,
  area public.planning_area not null default 'other',
  status public.planning_status not null default 'idea',
  priority public.priority_level not null default 'normal',
  responsible_profile_id uuid references public.profiles(id) on delete set null,
  due_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  offer_number text not null unique,
  status public.offer_status not null default 'draft',
  title text not null,
  description text,
  net_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  gross_amount numeric(12,2) not null default 0,
  valid_until timestamptz,
  sent_at timestamptz,
  accepted_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offer_items (
  id uuid primary key default gen_random_uuid(),
  offer_id uuid not null references public.offers(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit text not null default 'Stk.',
  unit_price_net numeric(12,2) not null default 0,
  total_price_net numeric(12,2) generated always as ((quantity * unit_price_net)::numeric(12,2)) stored,
  category public.offer_item_category not null default 'other',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  offer_id uuid references public.offers(id) on delete set null,
  invoice_number text not null unique,
  status public.invoice_status not null default 'draft',
  title text,
  net_amount numeric(12,2) not null default 0,
  tax_amount numeric(12,2) not null default 0,
  gross_amount numeric(12,2) not null default 0,
  invoice_at timestamptz,
  due_at timestamptz,
  paid_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.invoice_items (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices(id) on delete cascade,
  description text not null,
  quantity numeric(12,2) not null default 1,
  unit text not null default 'Stk.',
  unit_price_net numeric(12,2) not null default 0,
  total_price_net numeric(12,2) generated always as ((quantity * unit_price_net)::numeric(12,2)) stored,
  category public.offer_item_category not null default 'other',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  category public.documentation_category not null default 'other',
  version text not null default '1.0',
  status public.documentation_status not null default 'draft',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.care_contracts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  is_active boolean not null default false,
  contract_start_at timestamptz,
  contract_end_at timestamptz,
  sla_level public.sla_level not null default 'basic',
  monthly_fee numeric(12,2),
  response_time text,
  maintenance_interval text,
  next_maintenance_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_cases (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  care_contract_id uuid references public.care_contracts(id) on delete set null,
  system_id uuid references public.project_systems(id) on delete set null,
  room_id uuid references public.rooms(id) on delete set null,
  diagnostic_id uuid references public.diagnostics(id) on delete set null,
  title text not null,
  description text,
  priority public.priority_level not null default 'normal',
  status public.support_case_status not null default 'new',
  error_category public.error_category not null default 'other',
  resolution text,
  time_spent_hours numeric(8,2),
  assigned_to uuid references public.profiles(id) on delete set null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  title text not null,
  description text,
  task_type public.task_type not null default 'task',
  status public.task_status not null default 'open',
  priority public.priority_level not null default 'normal',
  due_at timestamptz,
  start_at timestamptz,
  end_at timestamptz,
  responsible_profile_id uuid references public.profiles(id) on delete set null,
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_context_check check (project_id is not null or customer_id is not null)
);

create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  diagnostic_id uuid references public.diagnostics(id) on delete cascade,
  offer_id uuid references public.offers(id) on delete cascade,
  invoice_id uuid references public.invoices(id) on delete cascade,
  documentation_id uuid references public.documentations(id) on delete cascade,
  room_id uuid references public.rooms(id) on delete cascade,
  file_name text not null,
  mime_type text,
  file_size_bytes bigint,
  category public.file_category not null default 'other',
  storage_bucket text not null default 'project-files',
  storage_path text not null unique,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint files_context_check check (
    customer_id is not null or property_id is not null or project_id is not null or diagnostic_id is not null or
    offer_id is not null or invoice_id is not null or documentation_id is not null or room_id is not null
  )
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  activity_type public.activity_type not null default 'note',
  title text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role_active on public.profiles(role, is_active);
create index if not exists idx_customers_status on public.customers(customer_status);
create index if not exists idx_customers_type on public.customers(customer_type);
create index if not exists idx_customers_email on public.customers(email);
create index if not exists idx_customers_lead_source on public.customers(lead_source);
create index if not exists idx_customer_addresses_customer on public.customer_addresses(customer_id);
create unique index if not exists idx_customer_addresses_one_primary on public.customer_addresses(customer_id) where address_type = 'primary';
create unique index if not exists idx_customer_addresses_one_billing on public.customer_addresses(customer_id) where address_type = 'billing';
create index if not exists idx_properties_customer on public.properties(customer_id);
create index if not exists idx_projects_property on public.projects(property_id);
create index if not exists idx_projects_status on public.projects(project_status);
create index if not exists idx_projects_responsible on public.projects(responsible_profile_id);
create index if not exists idx_project_systems_project on public.project_systems(project_id);
create index if not exists idx_project_systems_type on public.project_systems(system_type);
create index if not exists idx_project_systems_status on public.project_systems(status);
create index if not exists idx_diagnostics_project on public.diagnostics(project_id);
create index if not exists idx_diagnostics_status on public.diagnostics(status);
create index if not exists idx_diagnostics_priority on public.diagnostics(priority);
create index if not exists idx_diagnostics_affected_systems on public.diagnostics using gin(affected_systems);
create index if not exists idx_floors_property on public.floors(property_id);
create index if not exists idx_rooms_property on public.rooms(property_id);
create index if not exists idx_rooms_floor on public.rooms(floor_id);
create index if not exists idx_room_features_room on public.room_features(room_id);
create index if not exists idx_room_features_project on public.room_features(project_id);
create index if not exists idx_planning_items_project on public.planning_items(project_id);
create index if not exists idx_planning_items_status on public.planning_items(status);
create index if not exists idx_planning_items_due on public.planning_items(due_at);
create index if not exists idx_offers_project on public.offers(project_id);
create index if not exists idx_offers_status on public.offers(status);
create index if not exists idx_offer_items_offer on public.offer_items(offer_id);
create index if not exists idx_invoices_project on public.invoices(project_id);
create index if not exists idx_invoices_offer on public.invoices(offer_id);
create index if not exists idx_invoices_status on public.invoices(status);
create index if not exists idx_invoices_due on public.invoices(due_at);
create index if not exists idx_invoice_items_invoice on public.invoice_items(invoice_id);
create index if not exists idx_documentations_project on public.documentations(project_id);
create index if not exists idx_documentations_category on public.documentations(category);
create index if not exists idx_care_contracts_project on public.care_contracts(project_id);
create index if not exists idx_care_contracts_active on public.care_contracts(is_active);
create index if not exists idx_support_cases_project on public.support_cases(project_id);
create index if not exists idx_support_cases_status on public.support_cases(status);
create index if not exists idx_support_cases_assigned on public.support_cases(assigned_to);
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_customer on public.tasks(customer_id);
create index if not exists idx_tasks_status on public.tasks(status);
create index if not exists idx_tasks_due on public.tasks(due_at);
create index if not exists idx_tasks_responsible on public.tasks(responsible_profile_id);
create index if not exists idx_files_customer on public.files(customer_id);
create index if not exists idx_files_property on public.files(property_id);
create index if not exists idx_files_project on public.files(project_id);
create index if not exists idx_files_category on public.files(category);
create index if not exists idx_activity_logs_customer on public.activity_logs(customer_id);
create index if not exists idx_activity_logs_project on public.activity_logs(project_id);
create index if not exists idx_activity_logs_type on public.activity_logs(activity_type);

do $$
declare
  table_name text;
  trigger_name text;
begin
  foreach table_name in array array[
    'profiles',
    'customers',
    'customer_addresses',
    'properties',
    'projects',
    'project_systems',
    'diagnostics',
    'floors',
    'rooms',
    'room_features',
    'planning_items',
    'offers',
    'offer_items',
    'invoices',
    'invoice_items',
    'documentations',
    'care_contracts',
    'support_cases',
    'tasks',
    'files'
  ]
  loop
    trigger_name := 'set_' || table_name || '_updated_at';
    execute format('drop trigger if exists %I on public.%I', trigger_name, table_name);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', trigger_name, table_name);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role, is_active)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email, ''),
    'external',
    false
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and is_active = true
  );
$$;

create or replace function public.is_active_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('admin', 'project_lead', 'technician', 'sales', 'accounting')
      and is_active = true
  );
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'profiles',
    'customers',
    'customer_addresses',
    'properties',
    'projects',
    'project_systems',
    'diagnostics',
    'floors',
    'rooms',
    'room_features',
    'planning_items',
    'offers',
    'offer_items',
    'invoices',
    'invoice_items',
    'documentations',
    'care_contracts',
    'support_cases',
    'tasks',
    'files',
    'activity_logs'
  ]
  loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
on public.profiles
for select
to authenticated
using (id = (select auth.uid()) or public.is_admin());

drop policy if exists "profiles_admin_insert" on public.profiles;
create policy "profiles_admin_insert"
on public.profiles
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "profiles_admin_update" on public.profiles;
create policy "profiles_admin_update"
on public.profiles
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "profiles_admin_delete" on public.profiles;
create policy "profiles_admin_delete"
on public.profiles
for delete
to authenticated
using (public.is_admin());

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'customers',
    'customer_addresses',
    'properties',
    'projects',
    'project_systems',
    'diagnostics',
    'floors',
    'rooms',
    'room_features',
    'planning_items',
    'offers',
    'offer_items',
    'invoices',
    'invoice_items',
    'documentations',
    'care_contracts',
    'support_cases',
    'tasks',
    'files',
    'activity_logs'
  ]
  loop
    execute format('drop policy if exists %I on public.%I', table_name || '_select_active_staff', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_insert_active_staff', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_update_active_staff', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_delete_admin', table_name);

    execute format('create policy %I on public.%I for select to authenticated using (public.is_active_staff())', table_name || '_select_active_staff', table_name);
    execute format('create policy %I on public.%I for insert to authenticated with check (public.is_active_staff())', table_name || '_insert_active_staff', table_name);
    execute format('create policy %I on public.%I for update to authenticated using (public.is_active_staff()) with check (public.is_active_staff())', table_name || '_update_active_staff', table_name);
    execute format('create policy %I on public.%I for delete to authenticated using (public.is_admin())', table_name || '_delete_admin', table_name);
  end loop;
end $$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-files',
  'project-files',
  false,
  52428800,
  array[
    'application/pdf',
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/heic',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "project_files_select_active_staff" on storage.objects;
create policy "project_files_select_active_staff"
on storage.objects
for select
to authenticated
using (bucket_id = 'project-files' and public.is_active_staff());

drop policy if exists "project_files_insert_active_staff" on storage.objects;
create policy "project_files_insert_active_staff"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-files' and public.is_active_staff());

drop policy if exists "project_files_update_active_staff" on storage.objects;
create policy "project_files_update_active_staff"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-files' and public.is_active_staff())
with check (bucket_id = 'project-files' and public.is_active_staff());

drop policy if exists "project_files_delete_admin" on storage.objects;
create policy "project_files_delete_admin"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-files' and public.is_admin());

-- Bootstrap your first admin after the user has registered and confirmed email:
-- update public.profiles
-- set role = 'admin', is_active = true, full_name = 'Dein Name'
-- where id = (
--   select id from auth.users where email = 'deine-admin-mail@example.de' limit 1
-- );
