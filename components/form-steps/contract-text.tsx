"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface ContractTextProps {
  form: UseFormReturn<any>
}

export default function ContractText({ form }: ContractTextProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Function to check if scrolled to bottom
  const checkIfScrolledToBottom = (element: HTMLElement) => {
    const scrollPosition = element.scrollTop + element.clientHeight
    const scrollHeight = element.scrollHeight

    // Consider "scrolled to bottom" when within 20px of the bottom or at the bottom
    return scrollHeight - scrollPosition <= 20
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (checkIfScrolledToBottom(target)) {
      setHasScrolledToBottom(true)
    }
  }

  useEffect(() => {
    console.log("Contract has been scrolled to bottom:", hasScrolledToBottom)
  }, [hasScrolledToBottom])

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Terms and Conditions</div>

      <Alert variant="default" className="bg-blue-50 border-blue-200">
        <InfoIcon className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Please read the contract carefully and scroll to the bottom to continue.
        </AlertDescription>
      </Alert>

      <div className="relative h-1 w-full bg-gray-200 rounded mb-4">
        <div
          className="absolute top-0 left-0 h-full bg-blue-600 rounded transition-all duration-300"
          style={{
            width: hasScrolledToBottom ? "100%" : "0%",
          }}
        ></div>
      </div>

      {/* Replace ScrollArea with a simple div with overflow-y-auto */}
      <div
        ref={scrollContainerRef}
        className="h-[400px] border rounded-md p-4 bg-white overflow-y-auto"
        onScroll={handleScroll}
      >
        <div className="space-y-4 text-sm">
          <p>
            40. We cannot accept liability for loss or damage to you, your guest's or your child's personal property in
            the Academy or the car park, unless caused by our negligence, in which case our liability to you will be
            limited to the amount set out in paragraph 41. Vehicles parked within our car park are parked at the owner's
            risk and we take no responsibility for loss or damage, however caused.
          </p>

          <p>
            41. Our liability to pay you compensation for loss or damage (other than for death or personal injury) is
            limited to a reasonable amount, taking account of factors such as whether the loss or damage was due to our
            negligence. In any event, our maximum liability to you (other than for death or personal injury) will be an
            amount equal to six (6) months' Class Fees.
          </p>

          <p>
            42. We take no responsibility for any accident or injury incurred / sustained by you, your child, or your
            guests, through the making, drinking, carrying or spilling of any beverages at the Academy.
          </p>

          <p>43. We will be liable for death, personal injury or fraud where we are at fault or negligent.</p>

          <p className="font-bold">DATA PROTECTION</p>

          <p>
            44. We will keep any clinical information you give us confidential and secure and only pass it to, or
            receive it from, those involved with your child's programme or treatment. By joining the Academy and
            entering into this Agreement, you give us permission to process your child's personal data (including
            clinical information that relates to your child's health), as well as your personal data as your child's
            parent or legal guardian as is necessary to provide the services you have requested. Full details of how we
            manage your data can be found in our Data Protection, Retention and Disposal Policy (a copy of which can be
            found on our website at{" "}
            <a href="https://www.fm-academy.co.uk/policies" className="text-blue-600 underline">
              https://www.fm-academy.co.uk/policies
            </a>
            ).
          </p>

          <p>
            45. It is important that we hold the most up-to-date contact details for you and your child. You are
            responsible for keeping all your and your child's personal contact details and choices for how you want to
            receive marketing materials up to date.
          </p>

          <p>
            46. We use CCTV at the Academy for insurance purposes. The CCTV footage is stored for a period of 4 weeks
            and is then automatically deleted. The CCTV footage is stored on a password protected system which is
            accessible only by FMA managers. By entering into this Agreement, you expressly consent to CCTV footage
            being captured of your child whilst he/she is at the Academy, solely for the purposes of our compliance with
            our obligations set out by our insurance provider. Full details of our use of CCTV at the Academy can be
            found in our CCTV Policy (a copy of which can be found on our website at{" "}
            <a href="https://www.fm-academy.co.uk/policies" className="text-blue-600 underline">
              https://www.fm-academy.co.uk/policies
            </a>
            ).
          </p>

          <p className="font-bold">CHOICE OF LAW</p>

          <p>
            47. Your child's membership, and this Agreement, with us is governed by the laws of England and Wales, and
            and is subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>

          <p>T&C (1) Page 4 of 4 T&C (1)</p>

          {/* Add a marker at the bottom that becomes visible when scrolled to */}
          <div id="contract-end" className="h-1"></div>
        </div>
      </div>

      {!hasScrolledToBottom && (
        <p className="text-sm text-amber-600 mt-2">Please scroll to the bottom of the contract to continue</p>
      )}
      {hasScrolledToBottom && <p className="text-sm text-green-600 mt-2">Thank you for reading the contract</p>}

      <div className="mt-4">
        <FormField
          control={form.control}
          name="contractRead"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    console.log("Contract read checkbox changed:", checked)
                    field.onChange(checked)
                  }}
                  disabled={!hasScrolledToBottom}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <label
                  className={`font-medium cursor-pointer ${!hasScrolledToBottom ? "text-gray-400" : ""}`}
                  onClick={() => {
                    if (hasScrolledToBottom) {
                      const newValue = !field.value
                      console.log("Contract read label clicked, setting to:", newValue)
                      field.onChange(newValue)
                    }
                  }}
                >
                  I confirm that I have read the terms and conditions
                </label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
