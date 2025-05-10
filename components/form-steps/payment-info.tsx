"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"

interface PaymentInfoProps {
  form: UseFormReturn<any>
}

export default function PaymentInfo({ form }: PaymentInfoProps) {
  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Payment Information</div>

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
                        <div className="text-2xl font-bold">£50.00</div>
                        <CardDescription>Pay once per year</CardDescription>
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
                        <div className="text-2xl font-bold">£20.00 initial + £3.00/month</div>
                        <CardDescription>Initial payment followed by monthly direct debit</CardDescription>
                      </CardContent>
                    </Card>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
