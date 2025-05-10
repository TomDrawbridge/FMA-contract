-- Enable RLS on all tables (if not already enabled)
ALTER TABLE IF EXISTS users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS contract_acceptances ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_logs ENABLE ROW LEVEL SECURITY;

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
DROP POLICY IF EXISTS "Allow users to view own data" ON users;
CREATE POLICY "Allow users to view own data" 
ON users FOR SELECT 
TO authenticated
USING (auth.uid()::text = id);

DROP POLICY IF EXISTS "Allow users to view own members" ON members;
CREATE POLICY "Allow users to view own members" 
ON members FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow users to view own emergency contacts" ON emergency_contacts;
CREATE POLICY "Allow users to view own emergency contacts" 
ON emergency_contacts FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow users to view own signatures" ON signatures;
CREATE POLICY "Allow users to view own signatures" 
ON signatures FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

DROP POLICY IF EXISTS "Allow users to view own contract acceptances" ON contract_acceptances;
CREATE POLICY "Allow users to view own contract acceptances" 
ON contract_acceptances FOR SELECT 
TO authenticated
USING (auth.uid()::text = user_id);

-- Create policies for admin access
DROP POLICY IF EXISTS "Allow service role full access to users" ON users;
CREATE POLICY "Allow service role full access to users"
ON users
USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to members" ON members;
CREATE POLICY "Allow service role full access to members"
ON members
USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to emergency_contacts" ON emergency_contacts;
CREATE POLICY "Allow service role full access to emergency_contacts"
ON emergency_contacts
USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to signatures" ON signatures;
CREATE POLICY "Allow service role full access to signatures"
ON signatures
USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to contract_acceptances" ON contract_acceptances;
CREATE POLICY "Allow service role full access to contract_acceptances"
ON contract_acceptances
USING (auth.jwt() ->> 'role' = 'service_role');

DROP POLICY IF EXISTS "Allow service role full access to email_logs" ON email_logs;
CREATE POLICY "Allow service role full access to email_logs"
ON email_logs
USING (auth.jwt() ->> 'role' = 'service_role');
