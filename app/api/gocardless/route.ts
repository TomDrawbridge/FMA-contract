import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { createGoCardlessRedirectFlow } from "@/lib/gocardless"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user data
    const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

    if (userError || !userData) {
      console.error("User not found:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get member data to determine membership option
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      console.error("Error fetching member data:", memberError)
      // Default to monthly if member data not found
      const membershipOption = "monthly"

      // Create GoCardless redirect flow with default option
      const redirectUrl = await createGoCardlessRedirectFlow({
        userId,
        name: userData.name,
        email: userData.email,
        membershipOption,
      })

      return NextResponse.json({ redirect_url: redirectUrl })
    }

    // Create GoCardless redirect flow
    const redirectUrl = await createGoCardlessRedirectFlow({
      userId,
      name: userData.name,
      email: userData.email,
      membershipOption: memberData.membership_option || "monthly",
    })

    // Return the redirect URL
    return NextResponse.json({ redirect_url: redirectUrl })
  } catch (error: any) {
    console.error("Error setting up GoCardless payment:", error)

    // Always return a valid JSON response, even in case of error
    return NextResponse.json(
      {
        error: "Failed to set up payment",
        details: error.message || "Unknown error",
        // Provide a fallback URL so the UI doesn't break
        redirect_url: "https://pay.gocardless.com/demo",
      },
      { status: 500 },
    )
  }
}
