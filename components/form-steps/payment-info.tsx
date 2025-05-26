"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Gift } from "lucide-react"

interface PaymentInfoProps {
  form: UseFormReturn<any>
}

export default function PaymentInfo({ form }: PaymentInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Payment Information</div>

      <Alert className="bg-green-50 border-green-200">
        <Gift className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Special Offer:</strong> Membership is completely FREE until September 2025! No payment for membership
          fee required during registration. You only need to pay for your monthly classes package.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="membershipOption"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>FMA Membership Option</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-4">
                  <FormItem className="flex flex-col space-y-0 space-x-0">
                    <Card className="cursor-pointer border-2 hover:border-blue-500 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="annual" id="annual" />
                          <FormLabel htmlFor="annual" className="font-semibold text-lg cursor-pointer">
                            Annual Membership
                          </FormLabel>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 line-through">£50.00</div>
                          <div className="text-2xl font-bold text-green-600">£0.00</div>
                          <CardDescription>Free until September 2025</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FormItem>

                  <FormItem className="flex flex-col space-y-0 space-x-0">
                    <Card className="cursor-pointer border-2 hover:border-blue-500 transition-all">
                      <CardHeader className="pb-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="monthly" id="monthly" />
                          <FormLabel htmlFor="monthly" className="font-semibold text-lg cursor-pointer">
                            Monthly Membership
                          </FormLabel>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-500 line-through">£20.00 initial + £3.00/month</div>
                          <div className="text-2xl font-bold text-green-600">£0.00</div>
                          <CardDescription>Free until September 2025</CardDescription>
                        </div>
                      </CardContent>
                    </Card>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <h3 className="font-semibold mb-2 text-blue-900">Promotional Details</h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p>
              🎉 <strong>Limited Time Offer:</strong> All memberships are completely free until September 2025.
            </p>
            <p>
              📅 <strong>What happens after September 2025?</strong> Regular pricing will resume, and you'll be notified
              in advance with options to continue or cancel.
            </p>
            <p>
              ✨ <strong>No membership fees:</strong> This promotion covers your membership fee - you only need to pay
              for your monthly classes package.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Additional Information</h3>
          <p className="text-sm text-gray-700 mb-2">
            FMA Remaining Monthly Fee: This amount will depend on how many weeks are remaining in the month.
          </p>
          <p className="text-sm text-gray-700">FMA Notice Fee: £40.00</p>
        </div>
      </div>
    </div>
  )
}
