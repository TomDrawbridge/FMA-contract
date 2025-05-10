-- This file is for reference only and would be used to set up your Supabase schema

-- Users table
create table users (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null unique,
  address text not null,
  post_code text not null,
  home_phone text,
  mobile_phone text not null,
  work_phone text,
  created_at timestamp with time zone default now() not null
);

-- Members table
create table members (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  name text not null,
  package text not null,
  sport text not null,
  day text not null,
  time text not null,
  date_of_birth date not null,
  gender text not null,
  sibling_attends boolean default false not null,
  has_medical_conditions boolean default false not null,
  medical_conditions_details text,
  has_allergies boolean default false not null,
  allergies_details text,
  has_injury boolean default false not null,
  injury_details text,
  photo_consent boolean default true not null,
  first_aid_consent boolean default true not null,
  membership_option text not null,
  created_at timestamp with time zone default now() not null
);

-- Emergency contacts table
create table emergency_contacts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  name text not null,
  address text not null,
  post_code text not null,
  home_phone text,
  mobile_phone text not null,
  work_phone text,
  relationship text not null,
  created_at timestamp with time zone default now() not null
);

-- Signatures table
create table signatures (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  signature_data text not null,
  ip_address text not null,
  user_agent text not null,
  created_at timestamp with time zone default now() not null
);

-- Contract acceptances table
create table contract_acceptances (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users(id) not null,
  accepted_at timestamp with time zone not null,
  contract_version text not null,
  created_at timestamp with time zone default now() not null
);

-- RLS Policies
alter table users enable row level security;
alter table members enable row level security;
alter table emergency_contacts enable row level security;
alter table signatures enable row level security;
alter table contract_acceptances enable row level security;

-- Create a policy that allows authenticated users to view their own data
create policy "Users can view own data" on users
  for select using (auth.uid() = id);

create policy "Users can view own members" on members
  for select using (auth.uid() = user_id);

create policy "Users can view own emergency contacts" on emergency_contacts
  for select using (auth.uid() = user_id);

-- Create a policy that allows insertion of data
create policy "Anyone can insert users" on users
  for insert with check (true);

create policy "Anyone can insert members" on members
  for insert with check (true);

create policy "Anyone can insert emergency contacts" on emergency_contacts
  for insert with check (true);

create policy "Anyone can insert signatures" on signatures
  for insert with check (true);

create policy "Anyone can insert contract acceptances" on contract_acceptances
  for insert with check (true);
