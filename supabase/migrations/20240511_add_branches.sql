-- Create branches table
CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  post_code TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add branch_id to members table
ALTER TABLE members ADD COLUMN branch_id TEXT REFERENCES branches(id);

-- Insert some sample branches
INSERT INTO branches (id, name, address, post_code, phone, email)
VALUES 
  ('wythall', 'Wythall Branch', '123 Wythall Road', 'B47 6JL', '01234 567890', 'wythall@fma.com'),
  ('solihull', 'Solihull Branch', '456 Solihull Road', 'B91 3DE', '01234 567891', 'solihull@fma.com'),
  ('birmingham', 'Birmingham Branch', '789 Birmingham Road', 'B1 2CD', '01234 567892', 'birmingham@fma.com');

-- Enable RLS on branches table
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

-- Create policy for public access to branches
CREATE POLICY "Allow public select access to branches" 
ON branches FOR SELECT 
TO anon
USING (true);
