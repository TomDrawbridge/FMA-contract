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

    // Get member data to determine membership option and package details
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option, name, branch_id, package_id, package_total_price")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      return NextResponse.json({ error: "Member data not found" }, { status: 404 })
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || "http://localhost:3000"

    // Get the package amount in pence (convert from pounds)
    const packageAmount = memberData.package_total_price ? Math.round(memberData.package_total_price * 100) : 0

    // Create payment link using the real GoCardless API
    const paymentLink = await createGoCardlessPaymentLink({
      userId,
      name: userData.name,
      email: userData.email,
      membershipOption: memberData.membership_option,
      amount: packageAmount, // Use the package amount, not the membership amount
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
