import { GC_KEY } from "./env"

// This is a simplified version of the GoCardless client
// In production, you would use the gocardless-nodejs library
export async function createGoCardlessRedirectFlow(userData: {
  userId: string
  name: string
  email: string
  membershipOption: string
}) {
  try {
    // In a real implementation, you would use the gocardless-nodejs library:
    // const { Client } = require('gocardless-nodejs')
    // const client = new Client({
    //   access_token: GC_KEY,
    //   environment: 'sandbox', // or 'live' for production
    // })

    // For now, we'll simulate the API call
    console.log("Creating GoCardless redirect flow for user:", userData)

    // Split the name into first and last name
    const nameParts = userData.name.split(" ")
    const firstName = nameParts[0] || ""
    const lastName = nameParts.slice(1).join(" ") || ""

    // In production, you would use the actual GoCardless API:
    // const redirectFlow = await client.redirectFlows.create({
    //   description: `FMA Membership - ${userData.membershipOption}`,
    //   session_token: `user_${userData.userId}`,
    //   success_redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/payment-success`,
    //   prefilled_customer: {
    //     email: userData.email,
    //     given_name: firstName,
    //     family_name: lastName,
    //   },
    //   metadata: {
    //     user_id: userData.userId,
    //     membership_option: userData.membershipOption,
    //   },
    // })
    // return redirectFlow.redirect_url

    // For testing, we'll return a mock URL
    // In production, replace this with the actual GoCardless API call
    if (GC_KEY) {
      // If we have a GoCardless API key, we would use it here
      console.log("Using GoCardless API key:", GC_KEY.substring(0, 5) + "...")
    }

    // Create a mock redirect URL with query parameters
    const mockRedirectUrl = new URL("https://pay.gocardless.com/flow/RE123456")
    mockRedirectUrl.searchParams.append("email", userData.email)
    mockRedirectUrl.searchParams.append("first_name", firstName)
    mockRedirectUrl.searchParams.append("last_name", lastName)
    mockRedirectUrl.searchParams.append("plan", userData.membershipOption)

    return mockRedirectUrl.toString()
  } catch (error) {
    console.error("Error creating GoCardless redirect flow:", error)
    throw error
  }
}
