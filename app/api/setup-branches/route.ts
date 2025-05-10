import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()

    // Check if branches table already exists
    const { data: existingTables, error: tableCheckError } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .eq("table_name", "branches")

    if (tableCheckError) {
      console.error("Error checking for branches table:", tableCheckError)
      return NextResponse.json({ error: "Failed to check for branches table" }, { status: 500 })
    }

    if (existingTables && existingTables.length > 0) {
      return NextResponse.json({ message: "Branches table already exists", alreadyExists: true })
    }

    // Create branches table
    const { error: createTableError } = await supabase.rpc("exec_sql", {
      sql_string: `
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
      `,
    })

    if (createTableError) {
      console.error("Error creating branches table:", createTableError)
      return NextResponse.json({ error: "Failed to create branches table" }, { status: 500 })
    }

    // Add branch_id to members table
    const { error: alterTableError } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Add branch_id to members table if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'members'
            AND column_name = 'branch_id'
          ) THEN
            ALTER TABLE members ADD COLUMN branch_id TEXT REFERENCES branches(id);
          END IF;
        END
        $$;
      `,
    })

    if (alterTableError) {
      console.error("Error altering members table:", alterTableError)
      return NextResponse.json({ error: "Failed to alter members table" }, { status: 500 })
    }

    // Insert sample branches
    const { error: insertError } = await supabase.from("branches").insert([
      {
        id: "wythall",
        name: "Wythall Branch",
        address: "123 Wythall Road",
        post_code: "B47 6JL",
        phone: "01234 567890",
        email: "wythall@fma.com",
      },
      {
        id: "solihull",
        name: "Solihull Branch",
        address: "456 Solihull Road",
        post_code: "B91 3DE",
        phone: "01234 567891",
        email: "solihull@fma.com",
      },
      {
        id: "birmingham",
        name: "Birmingham Branch",
        address: "789 Birmingham Road",
        post_code: "B1 2CD",
        phone: "01234 567892",
        email: "birmingham@fma.com",
      },
    ])

    if (insertError) {
      console.error("Error inserting sample branches:", insertError)
      return NextResponse.json({ error: "Failed to insert sample branches" }, { status: 500 })
    }

    // Enable RLS on branches table
    const { error: rlsError } = await supabase.rpc("exec_sql", {
      sql_string: `
        -- Enable RLS on branches table
        ALTER TABLE branches ENABLE ROW LEVEL SECURITY;

        -- Create policy for public access to branches
        CREATE POLICY "Allow public select access to branches" 
        ON branches FOR SELECT 
        TO anon
        USING (true);
      `,
    })

    if (rlsError) {
      console.error("Error setting up RLS:", rlsError)
      return NextResponse.json({ error: "Failed to set up RLS" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Branches setup completed successfully" })
  } catch (error) {
    console.error("Error setting up branches:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
