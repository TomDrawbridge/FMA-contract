"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from "next/navigation"

export default function PaymentPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const userId = searchParams.get("user_id")

  useEffect(() => {
    const setupPayment = async () => {
      try {
        // If no user ID is provided, use a demo link
        if (!userId) {
          setPaymentUrl("https://pay.gocardless.com/demo")
          setIsLoading(false)
          return
        }

        // Get payment URL from API
        const response = await fetch(`/api/gocardless?user_id=${userId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to set up payment")
        }

        setPaymentUrl(data.redirect_url)
      } catch (error: any) {
        console.error("Payment setup error:", error)
        setError(error.message || "Failed to set up payment")
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
                  <h3 className="font-medium mb-1">Error</h3>
                  <p className="text-sm">{error}</p>
                  <p className="text-sm mt-2">Please contact support for assistance.</p>
                </div>
              ) : (
                <>
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
                {isLoading ? "Setting up payment..." : "Continue to Payment"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
