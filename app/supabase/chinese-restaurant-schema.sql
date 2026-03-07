-- ============================================================
-- BAAM System F — Chinese Restaurant Premium
-- chinese-restaurant-schema.sql
-- Run AFTER admin-schema.sql
-- ============================================================

-- Seed grand-pavilion site
insert into public.sites (id, name, domain, enabled, default_locale, supported_locales)
values ('grand-pavilion', 'Grand Pavilion', 'grandpavilionny.com', true, 'en', array['en','zh']::text[])
on conflict (id) do nothing;

insert into public.site_domains (site_id, domain, environment, is_primary, enabled)
values
  ('grand-pavilion', 'localhost', 'dev', true, true),
  ('grand-pavilion', 'grandpavilionny.com', 'prod', true, true)
on conflict (site_id, domain, environment) do nothing;

-- ============================================================
-- Menu Categories (Chinese-extended)
-- ============================================================
create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  name text not null,
  name_zh text not null default '',
  slug text not null,
  description text,
  description_zh text,
  menu_type text not null default 'dinner',
  hours_open text,
  hours_close text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug, menu_type)
);

create index if not exists menu_categories_site_id_idx on public.menu_categories (site_id);
create index if not exists menu_categories_menu_type_idx on public.menu_categories (site_id, menu_type);

-- ============================================================
-- Menu Items (Chinese-extended)
-- ============================================================
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  menu_category_id uuid references public.menu_categories(id) on delete set null,
  slug text not null,
  name text not null,
  name_zh text not null default '',       -- Required for Chinese restaurant
  description text,
  description_zh text,
  short_description text,
  short_description_zh text,
  price integer,                          -- In cents. NULL = market price
  price_note text,                        -- e.g. "Market price", "时价"
  image text,
  -- Chinese-specific fields
  origin_region text,                     -- "Cantonese", "Shanghainese", "Sichuan"
  is_dim_sum boolean not null default false,
  dim_sum_category text,                  -- steamed | baked | fried | congee-noodle | dessert
  is_chef_signature boolean not null default false,
  chef_note text,
  chef_note_zh text,
  pairing_note text,                      -- wine/tea pairing suggestion
  -- Dietary flags
  is_halal boolean not null default false,
  is_kosher boolean not null default false,
  is_vegetarian boolean not null default false,
  is_vegan boolean not null default false,
  is_gluten_free boolean not null default false,
  spice_level integer check (spice_level between 0 and 3),
  -- Availability
  is_popular boolean not null default false,
  is_available boolean not null default true,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug)
);

create index if not exists menu_items_site_id_idx on public.menu_items (site_id);
create index if not exists menu_items_category_idx on public.menu_items (menu_category_id);
create index if not exists menu_items_dim_sum_idx on public.menu_items (site_id, is_dim_sum);
create index if not exists menu_items_chef_sig_idx on public.menu_items (site_id, is_chef_signature);

-- ============================================================
-- Menu Daily Specials (weekday assignment)
-- ============================================================
create table if not exists public.menu_daily_specials (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  weekday text not null check (
    weekday in ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
  ),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, weekday)
);

create index if not exists menu_daily_specials_site_id_idx on public.menu_daily_specials (site_id);
create index if not exists menu_daily_specials_item_idx on public.menu_daily_specials (menu_item_id);

-- ============================================================
-- Festivals
-- ============================================================
create table if not exists public.festivals (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  name text not null,
  name_zh text not null,
  slug text not null,
  active_date_start date not null,
  active_date_end date not null,
  year integer not null,
  hero_image text,
  tagline text,
  tagline_zh text,
  description text,
  description_zh text,
  urgency_message text,                   -- e.g. "Only 12 tables remaining"
  urgency_count integer,
  is_active boolean not null default true,
  is_locked boolean not null default false,  -- prevents Pipeline B from overwriting
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug, year)
);

create index if not exists festivals_site_id_idx on public.festivals (site_id);
create index if not exists festivals_active_dates_idx on public.festivals (site_id, active_date_start, active_date_end);

-- ============================================================
-- Festival Prix-Fixe Menu Items
-- ============================================================
create table if not exists public.festival_menu_items (
  id uuid primary key default gen_random_uuid(),
  festival_id uuid not null references public.festivals(id) on delete cascade,
  tier text not null,                     -- "standard" | "premium" | "vip"
  tier_name text not null,
  tier_name_zh text not null,
  price_per_person integer not null,      -- in cents
  min_guests integer not null default 2,
  courses jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists festival_menu_items_festival_idx on public.festival_menu_items (festival_id);

-- ============================================================
-- Banquet Packages
-- ============================================================
create table if not exists public.banquet_packages (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  name text not null,
  name_zh text not null,
  slug text not null,
  tier text not null,                     -- business-lunch | celebration | wedding-banquet | corporate
  description text,
  description_zh text,
  price_per_head integer not null,        -- in cents
  min_guests integer not null,
  max_guests integer not null,
  includes text[] not null default '{}'::text[],
  includes_zh text[] not null default '{}'::text[],
  highlight text,                         -- one-line selling point
  room_image text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug)
);

create index if not exists banquet_packages_site_id_idx on public.banquet_packages (site_id);

-- ============================================================
-- Dim Sum Pre-orders (Intent capture, NOT full checkout)
-- ============================================================
create table if not exists public.dim_sum_orders (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  party_size integer not null,
  preferred_date date not null,
  preferred_time text not null,
  items jsonb not null default '[]'::jsonb,
  total_amount integer,                   -- in cents
  special_requests text,
  status text not null default 'pending', -- pending | confirmed | cancelled
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists dim_sum_orders_site_id_idx on public.dim_sum_orders (site_id);
create index if not exists dim_sum_orders_status_idx on public.dim_sum_orders (site_id, status);

-- ============================================================
-- Catering Inquiries
-- ============================================================
create table if not exists public.catering_inquiries (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  company_name text,
  location text,
  event_type text not null default 'other',  -- corporate | wedding | birthday | holiday | other
  event_date date,
  guest_count integer,
  budget_range text,
  cuisine_preferences text,
  additional_notes text,
  status text not null default 'new',     -- new | contacted | quoted | confirmed | declined
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catering_inquiries_site_id_idx on public.catering_inquiries (site_id);

-- ============================================================
-- Private Dining / Banquet Inquiries (extends existing)
-- ============================================================
create table if not exists public.private_dining_inquiries (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  wechat_id text,
  event_type text not null,               -- birthday | anniversary | wedding-banquet | corporate | other
  event_date date,
  guest_count integer,
  package_id uuid references public.banquet_packages(id) on delete set null,
  package_name text,
  dietary_notes text,
  budget_range text,
  additional_notes text,
  status text not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists private_dining_inquiries_site_id_idx on public.private_dining_inquiries (site_id);

-- ============================================================
-- Team Members
-- ============================================================
create table if not exists public.team_members (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  slug text not null,
  name text not null,
  name_zh text,
  role text not null,
  role_zh text,
  bio text,
  bio_zh text,
  image text,
  chef_origin text,                       -- e.g. "Hong Kong"
  chef_training text,                     -- e.g. "Fook Lam Moon, HK · 25 years"
  credentials text[],
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, slug)
);

create index if not exists team_members_site_id_idx on public.team_members (site_id);

-- ============================================================
-- Gallery Items
-- ============================================================
create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  image text not null,
  caption text,
  caption_zh text,
  category text not null default 'food',  -- food | dining-room | events | festivals | chef
  alt_text text,
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists gallery_items_site_id_idx on public.gallery_items (site_id);
create index if not exists gallery_items_category_idx on public.gallery_items (site_id, category);

-- ============================================================
-- Reservations
-- ============================================================
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  party_size integer not null,
  reservation_date date not null,
  reservation_time text not null,
  occasion text,
  special_requests text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists reservations_site_id_idx on public.reservations (site_id);
create index if not exists reservations_date_idx on public.reservations (site_id, reservation_date);

-- ============================================================
-- Contact Submissions
-- ============================================================
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  site_id text not null references public.sites(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  wechat_id text,
  subject text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_submissions_site_id_idx on public.contact_submissions (site_id);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.menu_daily_specials enable row level security;
alter table public.festivals enable row level security;
alter table public.festival_menu_items enable row level security;
alter table public.banquet_packages enable row level security;
alter table public.dim_sum_orders enable row level security;
alter table public.catering_inquiries enable row level security;
alter table public.private_dining_inquiries enable row level security;
alter table public.team_members enable row level security;
alter table public.gallery_items enable row level security;
alter table public.reservations enable row level security;
alter table public.contact_submissions enable row level security;

-- Public read access (menu, gallery, team are public)
drop policy if exists "Public read menu_categories" on public.menu_categories;
create policy "Public read menu_categories" on public.menu_categories
  for select using (is_active = true);

drop policy if exists "Public read menu_items" on public.menu_items;
create policy "Public read menu_items" on public.menu_items
  for select using (is_available = true);

drop policy if exists "Public read menu_daily_specials" on public.menu_daily_specials;
create policy "Public read menu_daily_specials" on public.menu_daily_specials
  for select using (true);

drop policy if exists "Public read festivals" on public.festivals;
create policy "Public read festivals" on public.festivals
  for select using (is_active = true);

drop policy if exists "Public read festival_menu_items" on public.festival_menu_items;
create policy "Public read festival_menu_items" on public.festival_menu_items
  for select using (true);

drop policy if exists "Public read banquet_packages" on public.banquet_packages;
create policy "Public read banquet_packages" on public.banquet_packages
  for select using (is_active = true);

drop policy if exists "Public read team_members" on public.team_members;
create policy "Public read team_members" on public.team_members
  for select using (is_active = true);

drop policy if exists "Public read gallery_items" on public.gallery_items;
create policy "Public read gallery_items" on public.gallery_items
  for select using (true);

-- Service role has full access (bypasses RLS)
-- Admin operations use service role key
