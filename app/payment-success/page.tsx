"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const userId = searchParams.get("user_id")
  const redirectFlowId = searchParams.get("redirect_flow_id")

  useEffect(() => {
    const completePayment = async () => {
      try {
        if (!redirectFlowId || !userId) {
          setStatus("error")
          setMessage("Missing redirect flow ID or user ID")
          return
        }

        // Call API to complete the payment
        const response = await fetch(`/api/gocardless/complete?redirect_flow_id=${redirectFlowId}&user_id=${userId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to complete payment setup")
        }

        setStatus("success")
        setMessage(data.message || "Your payment has been set up successfully")
      } catch (error: any) {
        console.error("Payment completion error:", error)
        setStatus("error")
        setMessage(error.message || "Failed to complete payment setup")
      }
    }

    completePayment()
  }, [redirectFlowId, userId])

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>
                Payment Setup {status === "success" ? "Complete" : status === "error" ? "Failed" : "Processing"}
              </CardTitle>
              <CardDescription>
                {status === "loading"
                  ? "We're finalizing your payment setup..."
                  : status === "success"
                    ? "Your direct debit has been set up successfully"
                    : "There was a problem setting up your payment"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-center py-6">
                {status === "loading" ? (
                  <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
                ) : status === "success" ? (
                  <CheckCircle className="h-16 w-16 text-green-500" />
                ) : (
                  <XCircle className="h-16 w-16 text-red-500" />
                )}
              </div>

              <div
                className={`p-4 rounded-md ${
                  status === "loading"
                    ? "bg-blue-50 text-blue-800"
                    : status === "success"
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                }`}
              >
                <p>{message}</p>
                {status === "success" && (
                  <p className="mt-2">
                    Your membership is now active. You will receive a confirmation email with your contract details.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-2">Please contact support for assistance or try again later.</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              {status === "loading" ? (
                <Button disabled className="w-full">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </Button>
              ) : status === "success" ? (
                <Link href="/" className="w-full">
                  <Button className="w-full">Return to Home</Button>
                </Link>
              ) : (
                <Link href="/payment?user_id=${userId}" className="w-full">
                  <Button className="w-full">Try Again</Button>
                </Link>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
