// GoCardless API utility functions

interface PaymentLinkParams {
  userId: string
  name: string
  email: string
  membershipOption: string
}

/**
 * Creates a payment link using the GoCardless API
 */
export async function createGoCardlessPaymentLink(params: PaymentLinkParams): Promise<string> {
  const { userId, name, email, membershipOption } = params

  console.log("GoCardless: Creating payment link", {
    userId,
    name,
    email,
    membershipOption,
    timestamp: new Date().toISOString(),
  })

  try {
    // In a real implementation, this would call the GoCardless API
    // For now, we'll return a mock payment link

    // Mock API call logging
    console.log("GoCardless API Request:", {
      url: "https://api.gocardless.com/billing_requests",
      method: "POST",
      headers: {
        "GoCardless-Version": "2015-07-06",
        Authorization: "Bearer [REDACTED]",
        "Content-Type": "application/json",
      },
      body: {
        billing_requests: {
          mandate_request: {
            scheme: "bacs",
            verify: "recommended",
          },
          payment_request: {
            amount: membershipOption === "annual" ? 5000 : 2000, // £50.00 or £20.00
            currency: "GBP",
            description: `FMA ${membershipOption === "annual" ? "Annual" : "Monthly"} Membership`,
          },
          links: {
            customer: {
              given_name: name.split(" ")[0],
              family_name: name.split(" ").slice(1).join(" "),
              email: email,
            },
          },
        },
      },
    })

    // Mock successful response
    console.log("GoCardless API Response:", {
      status: 200,
      body: {
        billing_requests: {
          id: "BR123456",
          status: "pending",
          payment_request: {
            id: "PR123456",
            status: "pending",
          },
          redirect_url: `https://pay.gocardless.com/billing/BR123456?user=${encodeURIComponent(userId)}`,
        },
      },
    })

    // Return a mock payment link
    return `https://pay.gocardless.com/demo?user=${encodeURIComponent(userId)}&name=${encodeURIComponent(name)}`
  } catch (error) {
    console.error("GoCardless API Error:", error)

    // Log the error details
    if (error instanceof Error) {
      console.error({
        name: error.name,
        message: error.message,
        stack: error.stack,
      })
    }

    // Re-throw the error to be handled by the caller
    throw new Error(
      `Failed to create GoCardless payment link: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

/**
 * Gets the membership amount based on the membership option
 */
export function getMembershipAmount(membershipOption: string): number {
  switch (membershipOption) {
    case "annual":
      return 5000 // £50.00
    case "monthly":
      return 2000 // £20.00 initial payment
    default:
      return 2000 // Default to monthly
  }
}
