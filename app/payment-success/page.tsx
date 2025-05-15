import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Payment Set Up Successfully!</CardTitle>
              <CardDescription>Your membership is now active</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-md">
                <h3 className="font-medium text-green-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
                  <li>Your direct debit has been set up</li>
                  <li>You'll receive a confirmation email with your contract</li>
                  <li>Your membership is now active</li>
                  <li>Your first payment will be processed according to your chosen plan</li>
                </ul>
              </div>

              <p className="text-sm text-gray-500">
                Thank you for joining FMA! If you have any questions about your membership, please contact our support
                team.
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/" className="w-full">
                <Button className="w-full">Return to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
