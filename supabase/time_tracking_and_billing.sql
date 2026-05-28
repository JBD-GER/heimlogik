-- Project time tracking and invoice sequencing.
-- Run after the base schema and team_and_partners.sql.

create table if not exists public.invoice_sequences (
  invoice_year integer primary key,
  last_number integer not null default 0,
  updated_at timestamptz not null default now()
);

create or replace function public.next_invoice_number(invoice_year integer default extract(year from now())::integer)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  next_value integer;
begin
  insert into public.invoice_sequences(invoice_year, last_number, updated_at)
  values (invoice_year, 1, now())
  on conflict (invoice_year)
  do update set
    last_number = public.invoice_sequences.last_number + 1,
    updated_at = now()
  returning last_number into next_value;

  return 'HL-' || invoice_year::text || '-' || lpad(next_value::text, 4, '0');
end;
$$;

grant execute on function public.next_invoice_number(integer) to authenticated;

create table if not exists public.time_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  staff_member_id uuid references public.staff_members(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  invoice_item_id uuid references public.invoice_items(id) on delete set null,
  title text not null,
  description text,
  started_at timestamptz not null default now(),
  stopped_at timestamptz,
  hourly_rate_net numeric(12,2) not null default 190,
  billable boolean not null default true,
  billed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint time_entries_time_check check (stopped_at is null or stopped_at > started_at),
  constraint time_entries_billing_check check (
    (billed_at is null and invoice_id is null)
    or
    (billed_at is not null and invoice_id is not null)
  )
);

alter table if exists public.time_entries
  alter column hourly_rate_net set default 190;

create index if not exists idx_time_entries_project_started on public.time_entries(project_id, started_at desc);
create index if not exists idx_time_entries_project_open on public.time_entries(project_id, stopped_at) where stopped_at is null;
create index if not exists idx_time_entries_project_unbilled on public.time_entries(project_id, billed_at, invoice_id) where stopped_at is not null and billable = true;
create index if not exists idx_time_entries_staff on public.time_entries(staff_member_id);
create index if not exists idx_time_entries_invoice on public.time_entries(invoice_id);

drop trigger if exists set_time_entries_updated_at on public.time_entries;
create trigger set_time_entries_updated_at
  before update on public.time_entries
  for each row execute function public.set_updated_at();

create table if not exists public.expense_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  staff_member_id uuid references public.staff_members(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  invoice_item_id uuid references public.invoice_items(id) on delete set null,
  title text not null,
  description text,
  expense_at timestamptz not null default now(),
  amount_net numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 19,
  billable boolean not null default true,
  billed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expense_entries_billing_check check (
    (billed_at is null and invoice_id is null)
    or
    (billed_at is not null and invoice_id is not null)
  )
);

create table if not exists public.accommodation_entries (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  staff_member_id uuid references public.staff_members(id) on delete set null,
  invoice_id uuid references public.invoices(id) on delete set null,
  invoice_item_id uuid references public.invoice_items(id) on delete set null,
  provider text not null,
  location text,
  notes text,
  check_in_at timestamptz not null,
  check_out_at timestamptz,
  nights numeric(8,2) not null default 1,
  amount_net numeric(12,2) not null default 0,
  tax_rate numeric(5,2) not null default 19,
  billable boolean not null default true,
  billed_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint accommodation_entries_date_check check (check_out_at is null or check_out_at >= check_in_at),
  constraint accommodation_entries_billing_check check (
    (billed_at is null and invoice_id is null)
    or
    (billed_at is not null and invoice_id is not null)
  )
);

create index if not exists idx_expense_entries_project_expense_at on public.expense_entries(project_id, expense_at desc);
create index if not exists idx_expense_entries_project_unbilled on public.expense_entries(project_id, billed_at, invoice_id) where billable = true;
create index if not exists idx_expense_entries_staff on public.expense_entries(staff_member_id);
create index if not exists idx_expense_entries_invoice on public.expense_entries(invoice_id);

create index if not exists idx_accommodation_entries_project_check_in on public.accommodation_entries(project_id, check_in_at desc);
create index if not exists idx_accommodation_entries_project_unbilled on public.accommodation_entries(project_id, billed_at, invoice_id) where billable = true;
create index if not exists idx_accommodation_entries_staff on public.accommodation_entries(staff_member_id);
create index if not exists idx_accommodation_entries_invoice on public.accommodation_entries(invoice_id);

drop trigger if exists set_expense_entries_updated_at on public.expense_entries;
create trigger set_expense_entries_updated_at
  before update on public.expense_entries
  for each row execute function public.set_updated_at();

drop trigger if exists set_accommodation_entries_updated_at on public.accommodation_entries;
create trigger set_accommodation_entries_updated_at
  before update on public.accommodation_entries
  for each row execute function public.set_updated_at();

alter table public.invoice_sequences enable row level security;
alter table public.time_entries enable row level security;
alter table public.expense_entries enable row level security;
alter table public.accommodation_entries enable row level security;

drop policy if exists invoice_sequences_select_admin on public.invoice_sequences;
create policy invoice_sequences_select_admin
on public.invoice_sequences
for select to authenticated
using (public.is_admin());

drop policy if exists time_entries_select_active_staff on public.time_entries;
create policy time_entries_select_active_staff
on public.time_entries
for select to authenticated
using (public.is_active_staff());

drop policy if exists time_entries_write_active_staff on public.time_entries;
create policy time_entries_write_active_staff
on public.time_entries
for all to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists expense_entries_select_active_staff on public.expense_entries;
create policy expense_entries_select_active_staff
on public.expense_entries
for select to authenticated
using (public.is_active_staff());

drop policy if exists expense_entries_write_active_staff on public.expense_entries;
create policy expense_entries_write_active_staff
on public.expense_entries
for all to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());

drop policy if exists accommodation_entries_select_active_staff on public.accommodation_entries;
create policy accommodation_entries_select_active_staff
on public.accommodation_entries
for select to authenticated
using (public.is_active_staff());

drop policy if exists accommodation_entries_write_active_staff on public.accommodation_entries;
create policy accommodation_entries_write_active_staff
on public.accommodation_entries
for all to authenticated
using (public.is_active_staff())
with check (public.is_active_staff());
