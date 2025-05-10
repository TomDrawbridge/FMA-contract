import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("user_id")

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 })
  }

  try {
    const supabase = createServerClient()

    // Get user data
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !userData) {
      throw new Error("User not found")
    }

    // In a real implementation, you would use the GoCardless API to create a payment flow
    // This is a simplified example

    // Example GoCardless redirect URL with prefilled data
    const redirectUrl = new URL("https://pay.gocardless.com/demo")
    redirectUrl.searchParams.append("name", userData.name)
    redirectUrl.searchParams.append("email", userData.email)

    // Update user with GoCardless ID (in a real implementation)
    // await supabase
    //   .from("users")
    //   .update({ gocardless_id: "GC_123456" })
    //   .eq("id", userId)

    return NextResponse.json({
      redirect_url: redirectUrl.toString(),
    })
  } catch (error) {
    console.error("Error setting up GoCardless payment:", error)
    return NextResponse.json({ error: "Failed to set up payment" }, { status: 500 })
  }
}
