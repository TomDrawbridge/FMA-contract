// GoCardless API integration utility
// This file handles the creation of payment links using the GoCardless API

interface PaymentLinkParams {
  amount: number
  description: string
  successRedirectUrl: string
  cancelledRedirectUrl: string
  customerEmail: string
  customerName: string
  customerAddressLine1: string
  customerCity: string
  customerPostalCode: string
  apiKey?: string // Optional API key parameter
}

export async function createGoCardlessPaymentLink(params: PaymentLinkParams) {
  try {
    // Use the provided API key or fall back to the environment variable
    const apiKey = params.apiKey || process.env.GOCARDLESS_API_KEY

    if (!apiKey) {
      throw new Error("GoCardless API key is not configured")
    }

    // Step 1: Create a billing request
    const billingRequestResponse = await fetch("https://api.gocardless.com/billing_requests", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "GoCardless-Version": "2015-07-06",
      },
      body: JSON.stringify({
        billing_requests: {
          mandate_request: {
            scheme: "bacs",
          },
          payment_request: {
            amount: params.amount,
            currency: "GBP",
            description: params.description,
          },
        },
      }),
    })

    if (!billingRequestResponse.ok) {
      const errorData = await billingRequestResponse.json()
      throw new Error(`Failed to create billing request: ${JSON.stringify(errorData)}`)
    }

    const billingRequestData = await billingRequestResponse.json()
    const billingRequestId = billingRequestData.billing_requests.id

    // Step 2: Create a billing request flow
    const flowResponse = await fetch("https://api.gocardless.com/billing_request_flows", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "GoCardless-Version": "2015-07-06",
      },
      body: JSON.stringify({
        billing_request_flows: {
          redirect_uri: params.successRedirectUrl,
          exit_uri: params.cancelledRedirectUrl,
          links: {
            billing_request: billingRequestId,
          },
          prefilled_customer: {
            email: params.customerEmail,
            given_name: params.customerName.split(" ")[0],
            family_name: params.customerName.split(" ").slice(1).join(" ") || params.customerName.split(" ")[0],
            address_line1: params.customerAddressLine1,
            city: params.customerCity,
            postal_code: params.customerPostalCode,
            country_code: "GB",
          },
        },
      }),
    })

    if (!flowResponse.ok) {
      const errorData = await flowResponse.json()
      throw new Error(`Failed to create billing request flow: ${JSON.stringify(errorData)}`)
    }

    const flowData = await flowResponse.json()
    return {
      success: true,
      authorisation_url: flowData.billing_request_flows.authorisation_url,
      id: flowData.billing_request_flows.id,
    }
  } catch (error) {
    console.error("Error creating GoCardless payment link:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
