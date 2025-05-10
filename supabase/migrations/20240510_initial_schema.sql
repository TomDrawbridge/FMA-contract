-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  address TEXT NOT NULL,
  post_code TEXT NOT NULL,
  home_phone TEXT,
  mobile_phone TEXT NOT NULL,
  work_phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  package TEXT NOT NULL,
  sport TEXT NOT NULL,
  day TEXT NOT NULL,
  time TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  sibling_attends BOOLEAN NOT NULL DEFAULT FALSE,
  has_medical_conditions BOOLEAN NOT NULL DEFAULT FALSE,
  medical_conditions_details TEXT,
  has_allergies BOOLEAN NOT NULL DEFAULT FALSE,
  allergies_details TEXT,
  has_injury BOOLEAN NOT NULL DEFAULT FALSE,
  injury_details TEXT,
  photo_consent BOOLEAN NOT NULL DEFAULT TRUE,
  first_aid_consent BOOLEAN NOT NULL DEFAULT TRUE,
  membership_option TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Emergency contacts table
CREATE TABLE IF NOT EXISTS emergency_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  post_code TEXT NOT NULL,
  home_phone TEXT,
  mobile_phone TEXT NOT NULL,
  work_phone TEXT,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Signatures table
CREATE TABLE IF NOT EXISTS signatures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  signature_data TEXT NOT NULL,
  ip_address TEXT NOT NULL,
  user_agent TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contract acceptances table
CREATE TABLE IF NOT EXISTS contract_acceptances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  accepted_at TIMESTAMPTZ NOT NULL,
  contract_version TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for form submission without authentication)
CREATE POLICY "Allow public insert to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to members" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to emergency_contacts" ON emergency_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to signatures" ON signatures FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to contract_acceptances" ON contract_acceptances FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert to email_logs" ON email_logs FOR INSERT WITH CHECK (true);

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to view their own data" ON users 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to view their own members" ON members 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view their own emergency contacts" ON emergency_contacts 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view their own signatures" ON signatures 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Allow authenticated users to view their own contract acceptances" ON contract_acceptances 
  FOR SELECT USING (auth.uid() = user_id);

-- Create policies for admin access (you would need to set up admin roles)
CREATE POLICY "Allow admins to view all data" ON users 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all members" ON members 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all emergency contacts" ON emergency_contacts 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all signatures" ON signatures 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all contract acceptances" ON contract_acceptances 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all email logs" ON email_logs 
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
