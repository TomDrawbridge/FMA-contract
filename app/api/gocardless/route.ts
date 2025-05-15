import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { createGoCardlessRedirectFlow } from "@/lib/gocardless"

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

    // Get member data to determine membership option
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      console.error("Error fetching member data:", memberError)
      throw new Error("Member data not found")
    }

    // Create GoCardless redirect flow
    const redirectUrl = await createGoCardlessRedirectFlow({
      userId,
      name: userData.name,
      email: userData.email,
      membershipOption: memberData.membership_option,
    })

    // Return the redirect URL
    return NextResponse.json({
      redirect_url: redirectUrl,
    })
  } catch (error: any) {
    console.error("Error setting up GoCardless payment:", error)
    return NextResponse.json({ error: "Failed to set up payment", details: error.message }, { status: 500 })
  }
}
