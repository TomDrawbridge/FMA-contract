import { type NextRequest, NextResponse } from "next/server"
import { createGoCardlessPaymentLink } from "@/lib/gocardless"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      amount,
      description,
      customerEmail,
      customerName,
      customerAddressLine1,
      customerCity,
      customerPostalCode,
      branchId,
      contractId,
    } = data

    if (!amount || !description || !customerEmail || !customerName || !branchId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create Supabase client with service role to access API keys
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch the branch-specific API key
    const { data: branchData, error: branchError } = await supabase
      .from("branches")
      .select("gocardless_api_key")
      .eq("id", branchId)
      .single()

    if (branchError) {
      console.error("Error fetching branch data:", branchError)
      return NextResponse.json({ error: "Failed to fetch branch data" }, { status: 500 })
    }

    // Get the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.headers.get("origin") || ""

    // Create payment link with branch-specific API key
    const result = await createGoCardlessPaymentLink({
      amount,
      description,
      successRedirectUrl: `${baseUrl}/thank-you?contractId=${contractId}&status=success`,
      cancelledRedirectUrl: `${baseUrl}/thank-you?contractId=${contractId}&status=cancelled`,
      customerEmail,
      customerName,
      customerAddressLine1: customerAddressLine1 || "",
      customerCity: customerCity || "",
      customerPostalCode: customerPostalCode || "",
      apiKey: branchData?.gocardless_api_key, // Pass the branch-specific API key
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error in GoCardless API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
