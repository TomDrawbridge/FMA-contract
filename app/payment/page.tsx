"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"
import { Loader2, CreditCard, AlertCircle } from "lucide-react"

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [membershipDetails, setMembershipDetails] = useState<{
    option: string
    amount: string
  } | null>(null)
  const searchParams = useSearchParams()
  const userId = searchParams.get("user_id")

  useEffect(() => {
    const setupPayment = async () => {
      try {
        // If no user ID is provided, show an error
        if (!userId) {
          setError("No user ID provided. Please complete the registration form first.")
          setIsLoading(false)
          return
        }

        // Get payment URL from API
        let redirectUrl: string | null = null

        try {
          const response = await fetch(`/api/gocardless?user_id=${userId}`)

          // Check if the response is JSON
          const contentType = response.headers.get("content-type")
          if (contentType && contentType.includes("application/json")) {
            const data = await response.json()

            if (!response.ok) {
              throw new Error(data.error || "Failed to set up payment")
            }

            redirectUrl = data.redirect_url
          } else {
            // If not JSON, get the text and log it
            const text = await response.text()
            console.error("Non-JSON response:", text)
            throw new Error("Invalid response from server")
          }
        } catch (fetchError) {
          console.error("Error fetching payment URL:", fetchError)
          // Fall back to demo URL
          redirectUrl = "https://pay.gocardless.com/demo"
          setError("Could not connect to payment provider. Using demo mode.")
        }

        // Set membership details
        let membershipOption = "monthly"

        try {
          const membershipResponse = await fetch(`/api/membership-details?user_id=${userId}`)
          if (membershipResponse.ok) {
            const membershipData = await membershipResponse.json()
            membershipOption = membershipData.membership_option || "monthly"
          }
        } catch (membershipError) {
          console.error("Error fetching membership details:", membershipError)
          // Continue with default
        }

        setMembershipDetails({
          option: membershipOption,
          amount: membershipOption === "annual" ? "£50.00/year" : "£3.00/month (£20.00 initial fee)",
        })

        setPaymentUrl(redirectUrl)
      } catch (error: any) {
        console.error("Payment setup error:", error)
        setError(error.message || "Failed to set up payment")
        // Set a fallback URL so the UI doesn't break completely
        setPaymentUrl("https://pay.gocardless.com/demo")
      } finally {
        setIsLoading(false)
      }
    }

    setupPayment()
  }, [userId])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Set Up Direct Debit</CardTitle>
              <CardDescription>Please set up your direct debit payment to complete your registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : error ? (
                <div className="bg-red-50 p-4 rounded-md text-red-800">
                  <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2 text-red-600" />
                    <h3 className="font-medium">Warning</h3>
                  </div>
                  <p className="text-sm mt-1">{error}</p>
                  {paymentUrl && (
                    <p className="text-sm mt-2">
                      You can continue to the demo payment page, but it will not process a real payment.
                    </p>
                  )}
                </div>
              ) : null}

              {!isLoading && membershipDetails && (
                <>
                  <div className="bg-blue-50 p-4 rounded-md mb-4">
                    <h3 className="font-medium text-blue-800 mb-2">Your Membership Details</h3>
                    <div className="text-blue-700 space-y-1">
                      <p>
                        <span className="font-medium">Plan:</span>{" "}
                        {membershipDetails.option === "monthly" ? "Monthly Membership" : "Annual Membership"}
                      </p>
                      <p>
                        <span className="font-medium">Amount:</span> {membershipDetails.amount}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">
                    You will be redirected to GoCardless to securely set up your direct debit payment. Your information
                    will be pre-filled based on the details you provided.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                    <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
                      <li>You'll be redirected to GoCardless</li>
                      <li>Confirm your payment details</li>
                      <li>Your membership will be activated immediately</li>
                      <li>You'll receive a confirmation email with your contract</li>
                    </ul>
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                disabled={isLoading || !paymentUrl}
                onClick={() => {
                  if (paymentUrl) {
                    window.location.href = paymentUrl
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" /> Continue to Payment
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
