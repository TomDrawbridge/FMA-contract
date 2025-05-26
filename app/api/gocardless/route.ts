import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { createGoCardlessPaymentLink } from "@/lib/gocardless"

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
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get member data to determine membership option
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option, name, branch_id")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      return NextResponse.json({ error: "Member data not found" }, { status: 404 })
    }

    // Get package data to determine the actual amount
    const { data: packageData, error: packageError } = await supabase
      .from("members")
      .select("package_total_price")
      .eq("user_id", userId)
      .single()

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || "http://localhost:3000"

    // Create payment link using the real GoCardless API
    const paymentLink = await createGoCardlessPaymentLink({
      userId,
      name: userData.name,
      email: userData.email,
      membershipOption: memberData.membership_option,
      amount: packageData?.package_total_price ? Math.round(packageData.package_total_price * 100) : 0, // Convert to pence
      redirectUrl: `${baseUrl}/payment/success?user_id=${userId}`,
      exitUrl: `${baseUrl}/payment/cancelled?user_id=${userId}`,
    })

    // Return the payment link
    return NextResponse.json({
      redirect_url: paymentLink,
      user_id: userId,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to set up payment",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
