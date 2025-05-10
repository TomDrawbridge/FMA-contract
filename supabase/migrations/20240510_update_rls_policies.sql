-- First, make sure RLS is enabled on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public insert to users" ON users;
DROP POLICY IF EXISTS "Allow public insert to members" ON members;
DROP POLICY IF EXISTS "Allow public insert to emergency_contacts" ON emergency_contacts;
DROP POLICY IF EXISTS "Allow public insert to signatures" ON signatures;
DROP POLICY IF EXISTS "Allow public insert to contract_acceptances" ON contract_acceptances;
DROP POLICY IF EXISTS "Allow public insert to email_logs" ON email_logs;

-- Create policies for public form submission (anonymous access)
CREATE POLICY "Allow public insert to users" 
ON users FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert to members" 
ON members FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert to emergency_contacts" 
ON emergency_contacts FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert to signatures" 
ON signatures FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert to contract_acceptances" 
ON contract_acceptances FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Allow public insert to email_logs" 
ON email_logs FOR INSERT 
TO anon
WITH CHECK (true);

-- Create policies for authenticated users to view their own data
CREATE POLICY "Allow users to view own data" 
ON users FOR SELECT 
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Allow users to view own members" 
ON members FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view own emergency contacts" 
ON emergency_contacts FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view own signatures" 
ON signatures FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow users to view own contract acceptances" 
ON contract_acceptances FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for admin access (you would need to set up admin roles)
CREATE POLICY "Allow admins to view all data" 
ON users FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all members" 
ON members FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all emergency contacts" 
ON emergency_contacts FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all signatures" 
ON signatures FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all contract acceptances" 
ON contract_acceptances FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Allow admins to view all email logs" 
ON email_logs FOR SELECT 
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
