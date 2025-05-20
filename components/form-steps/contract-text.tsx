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
          <p className="font-bold">INFORMATION ABOUT US</p>
          <p>We are a company registered in England and Wales – Gateway to FMA Ltd - 10236370 (the "Academy")</p>
          <p>
            1. The Academy's main mailing address is Unit 38 Monkspath Business Park, Highlands Road, Solihull, B90 4NZ.
          </p>
          <p>
            2. If you have any questions or if you have any complaints, please contact us either by telephoning 0121 745
            9778 or by e-mailing us at admin@fm-academy.co.uk.
          </p>
          <p>
            3. If you wish to contact us in writing use the address stated in paragraph 1, or if any paragraph in these
            terms requires you to give us notice in writing, you can send this to us by e-mail to
            admin@fm-academy.co.uk. We will confirm receipt of this by contacting you by email.
          </p>

          <p className="font-bold">CONTACT DETAILS</p>
          <p>
            4. We will send all letters and information to the contact details you have provided on the Membership
            Agreement Form. You must keep us up to date with any changes to your / the Member's details by filling in an
            administration form at the Academy.
          </p>

          <p className="font-bold">YOUR AGREEMENT WITH US</p>
          <p>
            5. You, the Member, and all visitors to the Academy, must abide by the Academy Safety Rules at all times
            while undertaking any activity or while on the premises or in the car park. These can be found at
            www.fm-academy.co.uk or via reception.
          </p>
          <p>
            6. FMA coaching fees are monthly memberships. When we refer to "month" in these terms and conditions, we
            mean a full calendar month. A full calendar month starts on the first day of the month and ends at the end
            of the last day.
          </p>
          <p>
            7. Your Agreement commences from the start date set out on the Membership Agreement completed online via
            DocHub. When your child becomes a member of the Academy ("Member"), you will need to make the payments set
            out on the Membership Agreement. The Member cannot participate in the Academy until you have electronically
            signed the Membership Agreement, made the payments set out on the Membership Agreement, and set up your
            direct debit. If you are not sure about the fees you are paying, please speak to a member of our team at the
            Academy.
          </p>
          <p>
            8. By completing and signing the Membership Agreement Form, you and the Member are accepting all the terms
            and conditions in this Agreement (insofar as they are applicable). You should only sign the Membership
            Agreement Form if you have read this Agreement and accept these terms.
          </p>
          <p>
            9. By agreeing to this Agreement, you represent to us that you are the Member's parent and/or legal
            guardian. We reserve the right to request proof of identity of the parent/legal guardian and may suspend or
            terminate a member's membership until we have received satisfactory proof of identity.
          </p>
          <p>
            10. You also represent that you have fully and accurately informed us about any relevant medical conditions
            and/or allergies that the Member may have and any accident/injuries the Member has had which may affect
            their training.
          </p>
          <p>
            11. By agreeing to this Agreement, you acknowledge and agree that all conditions, warranties or other terms
            which might have effect between you and us or be implied or incorporated into this Agreement, whether by
            statute, common law or otherwise, are hereby excluded, to the extent permitted by law.
          </p>

          <p className="font-bold">MEMBERSHIP FEES</p>
          <p>
            12. During your child's membership, you must pay all relevant fees whether the Member uses our facilities
            and services or not. Membership and notice fee is non-refundable or transferable.
          </p>
          <p>
            13. When your child's membership, and this Agreement, ends for any reason and we have taken the final
            payment from you, we will cancel your direct debit.
          </p>
          <p>14. You must sign a direct debit form or electronically register when you enter into this Agreement.</p>
          <p>
            15. You must promptly inform us of any changes to your bank account details. When you tell us about a change
            to your bank account details, we may ask you to sign a new direct debit form or refer you to your direct
            debit managers.
          </p>

          <p className="font-bold">BREAKDOWN OF MEMBERSHIP FEES</p>
          <p>16. The membership year runs from 1st October to 30th September.</p>
          <p>
            17. The annual fee is currently £50.00 ("Annual Fee"). We will advise of any increases in accordance with
            paragraph 32 below.
          </p>
          <p>
            18. When your child becomes a Member of the Academy, you will be required to pay the remaining portion of
            that year's Annual Fee. We will pro rata the Annual Fee for the remaining portion of the year. The Annual
            Fee is payable by direct debit and will be taken from your account within five (5) working days of your
            child becoming a Member of the Academy.
          </p>
          <p>
            19. In subsequent years, the Annual Fee will be due on 1st October, and will be payable by direct debit. We
            will automatically renew your child's annual membership, and this Agreement, and take the payment via direct
            debit from your account unless you notify us otherwise in writing or your child's membership is cancelled in
            accordance with paragraphs 26, 28 or 32 below.
          </p>
          <p>
            20. Class fees are payable on a monthly basis ("Class Fees"). The amount of the Class Fees due in each month
            will depend on the activity and frequency of the activity chosen by you / the Member.
          </p>
          <p>
            21. We will pro rata the Class Fees for the first month of membership according to the number of days
            remaining in that month; this fee will be payable by direct debit and will be taken from your account within
            five (5) working days of your child becoming a Member of the Academy. The Class Fees will be determined by
            the Class Price List, a copy of which will have been provided to you upon your entering into this Agreement
            and further copies of which are available upon request via email. After the first month, the Class Fees are
            payable by direct debit, and will be taken from your account on the 1st of each month.
          </p>
          <p>
            22. When your child becomes a Member of the Academy, a non-refundable (other than as set out in this
            Agreement) notice fee equal to one full month's Class Fees ("Notice Fee") per activity chosen by you / the
            Member, is payable by direct debit and will be taken from your account within five (5) working days of your
            child becoming a Member of the Academy. The payment of the Notice Fee means that if you chose to cancel your
            child's membership, and this Agreement in accordance with paragraph 26, we will cancel your direct debit
            immediately on our receipt of your notice to cancel, but you will have paid up to the end of the one month
            notice period. For example, if you give notice to cancel your child's membership on 16 March, we will cancel
            your direct debit, but your child will still be a paid up Member until 30 April, because you have already
            paid the Notice Fee in advance when your child became a Member.
          </p>
          <p>
            23. Please note that the Notice Fee is not refundable unless you need to cancel your child's membership and
            this Agreement within the first full month of his or her membership due to medical reasons, in which case,
            we may request that you provide us with a note from your child's doctor stating that your child is no longer
            able to take part in the classes at the Academy.
          </p>

          <p className="font-bold">FAILURE TO PAY</p>
          <p>
            24. This section is about what will happen if you do not pay your Annual Fee, Notice Fee and/or monthly
            Class Fees and any other fees you have agreed to pay because:
            <br />
            a. The account details you gave us for the direct debit are wrong; or
            <br />
            b. There is not enough money available in your bank account.
          </p>
          <p>
            25. If the account details you gave us for the direct debit were wrong, we will ask you to pay the total
            fees due by debit card or credit card and to confirm your correct bank details to us. We may appoint a
            debt-collection agency to collect any payments you owe, and you may have to pay any costs associated with
            this, including court costs. While you owe us payments, your child will not be allowed to participate in the
            Academy. Once your payments are up to date, your child will be allowed to participate in the Academy.
          </p>
          <p>
            26. If there is not enough money available in your account to pay the total fees that are due in full, we
            may ask you to pay by debit card, credit card or re-try the direct debit. If, after the second attempt to
            collect payment, you still owe us the payment (in whole or in part), we will cancel your child's membership,
            and this Agreement, from the end of that month. While you owe us payments, your child will not be allowed to
            participate in the Academy. Once your payments are up to date, your child will be allowed to participate in
            the Academy. In addition, there will be a £5.00 fee applied for each failed direct debit payments. This fee
            is to cover financial and administrative costs and will be taken via direct debit at the earliest possible
            time from when the Academy is notified of a failed payment.
          </p>

          <p className="font-bold">YOUR RIGHT TO CANCEL YOUR MEMBERSHIP</p>
          <p>
            27. You may cancel your child's membership, and this Agreement, by giving us one month's notice in writing
            to the Academy's manager. Cancelations MUST be made to the Academy before the 25th of the month (except in
            December which will be 20th) to prevent the next course fee payment being taken.
          </p>
          <p>
            28. If you cancel your child's membership, and this Agreement in writing (by post or e-mail), when we
            receive your written notice, we will send you an acknowledgement within 14 days of receipt, to confirm the
            date that your child's membership, and this Agreement, will end. If you do not receive this acknowledgement,
            you must assume that we have not received your cancellation notice. Members paying via standing order will
            be required to contact their financial provider and ensure that future payments have been stopped. The
            Academy cannot be held responsible for any over payment made after membership has been cancelled.
          </p>

          <p className="font-bold">OUR RIGHT TO CANCEL YOUR MEMBERSHIP</p>
          <p>
            29. We may cancel your child's membership, and this Agreement, by giving you one month's notice in writing
            for any reason. In these circumstances, we will refund any fees you have paid in advance for services not
            provided as at the date of termination of the membership and this Agreement.
          </p>
          <p>
            30. Without prejudice to paragraph 28, we may cancel or suspend your child's membership, and this Agreement,
            without giving you notice, if:
            <br />
            a. You, your guests, or your child seriously or repeatedly break the conditions of this Agreement (and, in
            particular, the Academy Safety Rules);
            <br />
            b. You, or your guests, or your child use offensive or abusive language, or use violent or offensive
            behaviour, at the Academy, or if you, your guest's, or your child's behaviour puts our other members, guests
            or employees at risk; or
            <br />
            c. You fail to provide satisfactory proof of identity when requested by us.
          </p>
          <p>
            31. If we cancel your child's membership, and this Agreement, under paragraph 29 we may not allow your child
            to join the Academy in the future and you and your child will not be allowed to enter the Academy.
          </p>

          <p className="font-bold">
            OUR RIGHT TO CHANGE YOUR MEMBERSHIP, THESE TERMS AND CONDITIONS OR THE TERMS OF ACADEMY USE
          </p>
          <p>
            32. From time to time we may change the Class Fees/times and Annual Fee by any amount we think is
            reasonable. We will try to only change the Class Fees/times and Annual Fee once a calendar year. However, we
            cannot guarantee this. We will tell you about any changes that will apply to you and will give you at least
            one full calendar months' notice in writing before the change comes into effect. If the changes to the Class
            Fees and/or Annual Fee result in the fees payable being increased by a material amount which mean that you
            are unable to pay the revised fees, you may immediately terminate your child's membership, and this
            Agreement, on written notice to us and seek a refund for any fees you may have paid in advance for services
            not provided as at the date of termination of the membership and this Agreement.
          </p>
          <p>
            33. We may make reasonable changes to the Agreement on written notice to you. If the changes have a material
            impact on the services we are contracted to provide to you and your child, you may immediately terminate
            your child's membership, and this Agreement, on written notice to us and seek a refund for any fees you may
            have paid in advance for services not provided as at the date of termination of the membership and this
            Agreement.
          </p>

          <p className="font-bold">EVENTS BEYOND OUR REASONABLE CONTROL</p>
          <p>
            34. If we cannot provide all the services and facilities at the Academy for 30 days or more in a row, or
            services and facilities are significantly reduced for 30 days or more in a row, for reasons or events beyond
            our reasonable control, you or we can cancel your child's membership, and this Agreement, immediately after
            giving notice in writing. 'Reasons or events beyond our reasonable control' would include, for example,
            natural disasters, a government's actions, war, national or regional emergency, acts of terrorism, protests,
            riot, fire, explosion, flood, an epidemic or pandemic, strikes or other labour disputes (whether or not they
            relate to our workforce), delays affecting suppliers or not being able to get suitable materials on time or
            at all.
          </p>

          <p className="font-bold">LIABILITIES AND DISCLAIMER</p>
          <p>
            35. You acknowledge that sometimes a service, facility or equipment may be unavailable due to health and
            safety reasons. You will not be entitled to any compensation in this instance.
          </p>
          <p>
            36. By law, we do not have to pay you compensation for loss or damage you, or your child, may suffer
            (including as a result of unavailability under paragraph 33 or 34) unless we have failed to carry out our
            duties under this Agreement to a reasonable standard or we break any duties we owe to you and/or the Member
            by law or we have acted negligently or fraudulently.
          </p>
          <p>
            37. We will not be liable to pay you compensation if we have failed to carry out our duties due to:
            <br />
            a. Your own fault;
            <br />
            b. The fault of someone else who is not directly connected with providing our services under this Agreement;
            or
            <br />
            c. Events which we could not have known about beforehand even if we had taken all reasonable care.
          </p>
          <p>
            38. We can make changes to the type of facilities we provide, and we will give you notice of any such
            changes. We will not be liable for any loss or damage caused by these changes unless the loss or damage is
            caused by our negligence.
          </p>
          <p>
            39. The activities provided at the Academy can be challenging and participation is not without risk as
            falls, accidents or misuse of equipment could result in serious injury or may even be fatal. The Member must
            abide by the Academy Safety Rules at all times and will receive clear instructions from a member of staff
            regarding safety prior to beginning any activity. We reserve the right to refuse admittance to the Academy
            or participation in the activities should we deem it necessary to do so. You must make sure that your child
            can do the exercise provided by any class your child takes part in. You should consult your family doctor
            before your child starts any class, if you are not sure whether it is suitable.
          </p>
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
