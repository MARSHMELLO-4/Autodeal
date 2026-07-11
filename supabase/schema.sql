create table if not exists categories (
  id bigserial primary key,
  name varchar(120) not null unique,
  slug varchar(140) not null unique,
  description varchar(500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicles (
  id bigserial primary key,
  title varchar(180) not null,
  registration_number varchar(30) unique,
  brand varchar(80) not null,
  model_name varchar(100) not null,
  variant_name varchar(120),
  manufacture_year integer not null,
  registration_year integer,
  kilometers_driven integer not null,
  fuel_type varchar(20) not null default 'PETROL',
  owner_serial integer,
  color varchar(60),
  price numeric(12, 2) not null,
  description varchar(2500),
  status varchar(20) not null default 'AVAILABLE',
  category_id bigint not null references categories(id),
  thumbnail_url varchar(1200),
  location varchar(120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists vehicle_images (
  id bigserial primary key,
  vehicle_id bigint not null references vehicles(id) on delete cascade,
  image_url varchar(1400) not null,
  alt_text varchar(180),
  display_order integer not null default 0
);

create table if not exists vehicle_documents (
  id bigserial primary key,
  vehicle_id bigint not null references vehicles(id) on delete cascade,
  type varchar(30) not null default 'OTHER',
  title varchar(160) not null,
  file_url varchar(1400) not null,
  storage_path varchar(700) not null,
  content_type varchar(120),
  file_size bigint,
  uploaded_at timestamptz not null default now()
);

create table if not exists sale_records (
  id bigserial primary key,
  vehicle_id bigint not null references vehicles(id) on delete cascade,
  sale_price numeric(12, 2) not null,
  sale_date date not null,
  buyer_name varchar(140),
  buyer_phone varchar(30),
  notes varchar(1000),
  created_at timestamptz not null default now()
);

create index if not exists idx_vehicles_status on vehicles(status);
create index if not exists idx_vehicles_category on vehicles(category_id);
create index if not exists idx_vehicles_brand_model on vehicles(brand, model_name);
create index if not exists idx_sale_records_sale_date on sale_records(sale_date);
