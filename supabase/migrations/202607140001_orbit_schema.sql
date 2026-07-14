create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  external_order_id text,
  store text not null,
  product_name text not null,
  product_image_url text,
  category text,
  price numeric(12,2),
  currency text not null default 'INR',
  status text not null default 'unknown',
  original_status text,
  source text not null default 'manual',
  source_message_id text,
  ordered_at timestamptz,
  estimated_delivery_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  courier text,
  courier_slug text,
  tracking_number text not null,
  tracking_provider text not null default 'aftership',
  provider_tracking_id text,
  tracking_url text,
  last_checkpoint text,
  last_synced_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tracking_events (
  id uuid primary key default gen_random_uuid(),
  shipment_id uuid not null references public.shipments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_event_id text not null,
  status text not null default 'unknown',
  original_status text,
  title text not null,
  description text,
  location text,
  occurred_at timestamptz not null,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.gmail_tokens (
  user_id uuid primary key references auth.users(id) on delete cascade,
  encrypted_access_token text not null,
  encrypted_refresh_token text not null,
  token_expiry timestamptz not null,
  provider_scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gmail_sync_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null,
  emails_scanned integer not null default 0,
  orders_added integer not null default 0,
  orders_updated integer not null default 0,
  error_count integer not null default 0,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.gmail_sync_logs (
  id uuid primary key default gen_random_uuid(),
  sync_run_id uuid references public.gmail_sync_runs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  stage text not null,
  level text not null,
  message text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  title text not null,
  message text not null,
  notification_type text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.returns (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'return_requested',
  requested_at timestamptz,
  picked_up_at timestamptz,
  returned_at timestamptz,
  refund_amount numeric(12,2),
  refund_status text,
  refunded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists orders_user_source_message_unique on public.orders(user_id, source_message_id) where source_message_id is not null;
create unique index if not exists orders_user_external_unique on public.orders(user_id, store, external_order_id) where external_order_id is not null;
create unique index if not exists shipments_user_tracking_unique on public.shipments(user_id, tracking_number);
create unique index if not exists tracking_events_unique on public.tracking_events(shipment_id, provider_event_id);
create unique index if not exists notifications_idempotent_unique on public.notifications(user_id, order_id, notification_type, message);

create index if not exists orders_user_status_idx on public.orders(user_id, status);
create index if not exists orders_user_updated_idx on public.orders(user_id, updated_at desc);
create index if not exists shipments_provider_tracking_idx on public.shipments(provider_tracking_id);
create index if not exists tracking_events_user_time_idx on public.tracking_events(user_id, occurred_at desc);
create index if not exists notifications_user_unread_idx on public.notifications(user_id, read_at, created_at desc);

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.shipments enable row level security;
alter table public.tracking_events enable row level security;
alter table public.gmail_tokens enable row level security;
alter table public.gmail_sync_runs enable row level security;
alter table public.gmail_sync_logs enable row level security;
alter table public.notifications enable row level security;
alter table public.returns enable row level security;

create policy "profiles own rows" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "orders own rows" on public.orders for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "shipments own rows" on public.shipments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "tracking events own rows" on public.tracking_events for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "sync runs own rows" on public.gmail_sync_runs for select using (auth.uid() = user_id);
create policy "sync logs own rows" on public.gmail_sync_logs for select using (auth.uid() = user_id);
create policy "notifications own rows" on public.notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "returns own rows" on public.returns for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

revoke all on public.gmail_tokens from anon, authenticated;

alter publication supabase_realtime add table public.orders;
alter publication supabase_realtime add table public.tracking_events;
alter publication supabase_realtime add table public.notifications;
