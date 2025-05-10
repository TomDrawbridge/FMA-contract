import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const supabase = createServerClient()

    // Enable RLS on all tables
    await supabase.rpc("alter_table_enable_rls", { table_name: "users" })
    await supabase.rpc("alter_table_enable_rls", { table_name: "members" })
    await supabase.rpc("alter_table_enable_rls", { table_name: "emergency_contacts" })
    await supabase.rpc("alter_table_enable_rls", { table_name: "signatures" })
    await supabase.rpc("alter_table_enable_rls", { table_name: "contract_acceptances" })
    await supabase.rpc("alter_table_enable_rls", { table_name: "email_logs" })

    // Create policy for public insert to users
    await supabase.rpc("create_policy", {
      table_name: "users",
      policy_name: "Allow public insert to users",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    // Create policy for public insert to members
    await supabase.rpc("create_policy", {
      table_name: "members",
      policy_name: "Allow public insert to members",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    // Create policy for public insert to emergency_contacts
    await supabase.rpc("create_policy", {
      table_name: "emergency_contacts",
      policy_name: "Allow public insert to emergency_contacts",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    // Create policy for public insert to signatures
    await supabase.rpc("create_policy", {
      table_name: "signatures",
      policy_name: "Allow public insert to signatures",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    // Create policy for public insert to contract_acceptances
    await supabase.rpc("create_policy", {
      table_name: "contract_acceptances",
      policy_name: "Allow public insert to contract_acceptances",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    // Create policy for public insert to email_logs
    await supabase.rpc("create_policy", {
      table_name: "email_logs",
      policy_name: "Allow public insert to email_logs",
      definition: "true",
      policy_action: "INSERT",
      policy_role: "anon",
    })

    return NextResponse.json({ success: true, message: "Database setup completed successfully" })
  } catch (error) {
    console.error("Error setting up database:", error)
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 })
  }
}
