import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Check if environment variables are available
// Only use NEXT_PUBLIC_ prefixed variables on the client side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (typeof window !== "undefined") {
  // Client-side code
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables:", {
      url: supabaseUrl ? "Set" : "Missing",
      key: supabaseAnonKey ? "Set" : "Missing",
    })
  }
}

// Create a singleton instance of the Supabase client
let supabase: any

// Only initialize if URL and key are available
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false, // We don't need auth for this form
    },
  })
} else {
  console.error("Supabase client not initialized due to missing environment variables")
}

export { supabase }

// Add a debug function to test the connection on demand
export const testSupabaseConnection = async () => {
  if (!supabase) {
    return {
      success: false,
      error: { message: "Supabase client not initialized due to missing environment variables" },
      status: 500,
    }
  }

  try {
    console.log("Testing Supabase connection...")
    console.log("URL:", supabaseUrl)
    console.log("Key set:", !!supabaseAnonKey)

    const { data, error, status } = await supabase.from("users").select("count", { count: "exact", head: true })

    if (error) {
      console.error("Connection test failed:", error)
      console.error("Status:", status)
      console.error("Error details:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      })
      return { success: false, error, status }
    }

    console.log("Connection test successful:", data)
    return { success: true, data, status }
  } catch (err: any) {
    console.error("Connection test exception:", err)
    return { success: false, error: err, status: 500 }
  }
}
