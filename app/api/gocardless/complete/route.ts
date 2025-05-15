import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { completeGoCardlessRedirectFlow } from "@/lib/gocardless"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const redirectFlowId = searchParams.get("redirect_flow_id")
  const userId = searchParams.get("user_id")

  if (!redirectFlowId || !userId) {
    return NextResponse.json({ error: "Redirect flow ID and user ID are required" }, { status: 400 })
  }

  try {
    // Complete the redirect flow
    const sessionToken = `user_${userId}_${Date.now()}`
    const result = await completeGoCardlessRedirectFlow(redirectFlowId, sessionToken)

    if (!result.success) {
      throw new Error("Failed to complete redirect flow")
    }

    const supabase = createServerClient()

    // Update the user with the mandate and customer IDs
    await supabase
      .from("users")
      .update({
        gocardless_mandate_id: result.mandateId,
        gocardless_customer_id: result.customerId,
        payment_status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    return NextResponse.json({
      success: true,
      message: "Payment setup completed successfully",
      mandate_id: result.mandateId,
      customer_id: result.customerId,
    })
  } catch (error: any) {
    console.error("Error completing GoCardless redirect flow:", error)
    return NextResponse.json({ error: "Failed to complete payment setup", details: error.message }, { status: 500 })
  }
}
