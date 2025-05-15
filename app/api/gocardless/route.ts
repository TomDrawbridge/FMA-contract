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
      console.error("User not found:", userError)
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get member data to determine membership option
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option, name, branch_id")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      console.error("Error fetching member data:", memberError)
      return NextResponse.json({ error: "Member data not found" }, { status: 404 })
    }

    // For now, return a mock payment link for testing
    // In production, this would call the GoCardless API
    console.log("Creating payment link for:", {
      userId,
      name: userData.name,
      email: userData.email,
      membershipOption: memberData.membership_option,
      memberName: memberData.name,
      branchId: memberData.branch_id,
    })

    // Mock payment link - replace with actual GoCardless API call
    const mockPaymentLink = `https://pay.gocardless.com/demo?user=${encodeURIComponent(userId)}&name=${encodeURIComponent(userData.name)}`

    // Return the payment link
    return NextResponse.json({
      redirect_url: mockPaymentLink,
      user_id: userId,
    })
  } catch (error: any) {
    console.error("Error setting up GoCardless payment:", error)
    return NextResponse.json(
      {
        error: "Failed to set up payment",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
