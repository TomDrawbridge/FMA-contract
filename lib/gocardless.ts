interface PaymentLinkParams {
  userId: string
  name: string
  email: string
  membershipOption: string
  amount?: number
  description?: string
  redirectUrl?: string
  exitUrl?: string
}

/**
 * Creates a payment link using the GoCardless API
 */
export async function createGoCardlessPaymentLink(params: PaymentLinkParams): Promise<string> {
  const {
    userId,
    name,
    email,
    membershipOption,
    amount,
    description,
    redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/success`,
    exitUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/payment/cancelled`,
  } = params

  try {
    // Determine the amount based on membership option or use the provided amount
    const paymentAmount = amount || 0

    // Determine the description
    const paymentDescription = description || `FMA ${membershipOption === "annual" ? "Annual" : "Monthly"} Membership`

    // Get the GoCardless API key from environment variables
    const apiKey = process.env.GOCARDLESS_API_KEY
    if (!apiKey) {
      throw new Error("GoCardless API key is not configured")
    }

    // STEP 1: Create a billing request
    const requestHeaders = {
      "GoCardless-Version": "2015-07-06",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `billing-request-${Date.now()}`,
    }

    // Using the new format provided
    const billingRequestBody = {
      billing_requests: {
        mandate_request: {
          currency: "GBP",
          scheme: "bacs",
        },
        payment_request: {
          description: "Setup fee",
          amount: paymentAmount.toString(),
          currency: "GBP",
        },
      },
    }

    // Get the GoCardless API URL from environment variables
    const apiUrl = process.env.GOCARDLESS_API_URL || "https://api.gocardless.com"

    // Make the actual API call to create a billing request
    const billingRequestResponse = await fetch(`${apiUrl}/billing_requests`, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(billingRequestBody),
    })

    // Parse the response
    let billingRequestData
    try {
      const billingRequestResponseText = await billingRequestResponse.text()
      billingRequestData = JSON.parse(billingRequestResponseText)
    } catch (e) {
      throw new Error(`Invalid response from GoCardless billing request`)
    }

    // Check if the response contains an error
    if (!billingRequestResponse.ok) {
      const errorMessage = billingRequestData.error?.message || "Unknown error from GoCardless"
      throw new Error(`GoCardless API error: ${errorMessage}`)
    }

    // Extract the billing request ID from the response
    const billingRequestId = billingRequestData.billing_requests?.id
    if (!billingRequestId) {
      throw new Error("No billing request ID returned from GoCardless")
    }

    // STEP 2: Create a billing request flow
    const flowRequestHeaders = {
      "GoCardless-Version": "2015-07-06",
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `billing-flow-${Date.now()}`,
    }

    const billingRequestFlowBody = {
      billing_request_flows: {
        redirect_uri: redirectUrl,
        exit_uri: exitUrl,
        links: {
          billing_request: billingRequestId,
        },
      },
    }

    // Make the actual API call to create a billing request flow
    const billingFlowResponse = await fetch(`${apiUrl}/billing_request_flows`, {
      method: "POST",
      headers: flowRequestHeaders,
      body: JSON.stringify(billingRequestFlowBody),
    })

    // Parse the response
    let billingFlowData
    try {
      const billingFlowResponseText = await billingFlowResponse.text()
      billingFlowData = JSON.parse(billingFlowResponseText)
    } catch (e) {
      throw new Error(`Invalid response from GoCardless billing flow`)
    }

    // Check if the response contains an error
    if (!billingFlowResponse.ok) {
      const errorMessage = billingFlowData.error?.message || "Unknown error from GoCardless"
      throw new Error(`GoCardless API error: ${errorMessage}`)
    }

    // Extract the authorisation URL from the response
    const authorisationUrl = billingFlowData.billing_request_flows?.authorisation_url
    if (!authorisationUrl) {
      throw new Error("No authorisation URL returned from GoCardless")
    }

    return authorisationUrl
  } catch (error) {
    // Re-throw the error to be handled by the caller
    throw new Error(
      `Failed to create GoCardless payment link: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}
