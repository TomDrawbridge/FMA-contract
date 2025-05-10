"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form } from "@/components/ui/form"

import MemberInfo from "./form-steps/member-info"
import GuardianInfo from "./form-steps/guardian-info"
import EmergencyContact from "./form-steps/emergency-contact"
import MedicalInfo from "./form-steps/medical-info"
import Consent from "./form-steps/consent"
import PaymentInfo from "./form-steps/payment-info"
import ContractText from "./form-steps/contract-text"
import SignatureStep from "./form-steps/signature-step"
import ProgressBar from "./progress-bar"

// Define the form schema
const formSchema = z.object({
  // Member Information
  memberName: z.string().min(2, { message: "Full name is required" }),
  package: z.string().min(1, { message: "Package is required" }),
  sport: z.string().min(1, { message: "Sport is required" }),
  day: z.string().min(1, { message: "Day is required" }),
  time: z.string().min(1, { message: "Time is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  gender: z.string().min(1, { message: "Gender is required" }),
  siblingAttends: z.boolean().default(false),

  // Guardian Information
  guardianName: z.string().min(2, { message: "Guardian name is required" }),
  guardianEmail: z.string().email({ message: "Valid email is required" }),
  guardianAddress: z.string().min(5, { message: "Address is required" }),
  guardianPostCode: z.string().min(5, { message: "Post code is required" }),
  guardianHomePhone: z.string().optional(),
  guardianMobilePhone: z.string().min(10, { message: "Mobile phone is required" }),
  guardianWorkPhone: z.string().optional(),
  guardianRelationship: z.string().min(1, { message: "Relationship is required" }),

  // Emergency Contact
  emergencyName: z.string().min(2, { message: "Emergency contact name is required" }),
  emergencyAddress: z.string().min(5, { message: "Address is required" }),
  emergencyPostCode: z.string().min(5, { message: "Post code is required" }),
  emergencyHomePhone: z.string().optional(),
  emergencyMobilePhone: z.string().min(10, { message: "Mobile phone is required" }),
  emergencyWorkPhone: z.string().optional(),
  emergencyRelationship: z.string().min(1, { message: "Relationship is required" }),

  // Medical Information
  hasMedicalConditions: z.boolean().default(false),
  medicalConditionsDetails: z.string().optional(),
  hasAllergies: z.boolean().default(false),
  allergiesDetails: z.string().optional(),
  hasInjury: z.boolean().default(false),
  injuryDetails: z.string().optional(),

  // Consent
  photoConsent: z.boolean().default(true),
  firstAidConsent: z.boolean().default(true),

  // Payment Information
  membershipOption: z.enum(["annual", "monthly"]),

  // Add this new field
  ipAddress: z.string().default("127.0.0.1"),

  // Contract Agreement
  contractRead: z.boolean().refine((val) => val === true, {
    message: "You must read the contract before proceeding",
  }),
  contractAgreed: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  signatureData: z.string().min(1, { message: "Signature is required" }),
})

type FormValues = z.infer<typeof formSchema>

export default function ContractForm() {
  const [activeStep, setActiveStep] = useState("member-info")
  const [signatureData, setSignatureData] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const router = useRouter()

  // For testing, pre-fill the form with sample data
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      memberName: "",
      package: "",
      sport: "",
      day: "",
      time: "",
      dateOfBirth: "",
      gender: "",
      siblingAttends: false,

      guardianName: "",
      guardianEmail: "",
      guardianAddress: "",
      guardianPostCode: "",
      guardianHomePhone: "",
      guardianMobilePhone: "",
      guardianWorkPhone: "",
      guardianRelationship: "",

      emergencyName: "",
      emergencyAddress: "",
      emergencyPostCode: "",
      emergencyHomePhone: "",
      emergencyMobilePhone: "",
      emergencyWorkPhone: "",
      emergencyRelationship: "",

      hasMedicalConditions: false,
      medicalConditionsDetails: "",
      hasAllergies: false,
      allergiesDetails: "",
      hasInjury: false,
      injuryDetails: "",

      photoConsent: true,
      firstAidConsent: true,

      membershipOption: "monthly",

      // Add this new field
      ipAddress: "127.0.0.1",

      // Set both checkboxes to unchecked by default
      contractRead: false,
      contractAgreed: false,

      signatureData: "",
    },
  })

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      form.setValue("memberName", "John Doe")
      form.setValue("package", "Standard")
      form.setValue("sport", "Football")
      form.setValue("day", "monday")
      form.setValue("time", "14:00")
      form.setValue("dateOfBirth", "2010-01-01")
      form.setValue("gender", "male")

      form.setValue("guardianName", "Jane Doe")
      form.setValue("guardianEmail", "jane.doe@example.com")
      form.setValue("guardianAddress", "123 Main St")
      form.setValue("guardianPostCode", "AB12 3CD")
      form.setValue("guardianMobilePhone", "1234567890")
      form.setValue("guardianRelationship", "Parent")

      form.setValue("emergencyName", "Bob Smith")
      form.setValue("emergencyAddress", "456 Oak St")
      form.setValue("emergencyPostCode", "EF45 6GH")
      form.setValue("emergencyMobilePhone", "0987654321")
      form.setValue("emergencyRelationship", "Grandparent")

      console.log("Form pre-filled with sample data")
    }
  }, [form])

  // Debug form state
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log("Form values changed:", value)
    })
    return () => subscription.unsubscribe()
  }, [form])

  // Add these validation functions after the form declaration
  const validateMemberInfo = async () => {
    const result = await form.trigger(["memberName", "package", "sport", "day", "time", "dateOfBirth", "gender"])
    return result
  }

  const validateGuardianInfo = async () => {
    const result = await form.trigger([
      "guardianName",
      "guardianEmail",
      "guardianAddress",
      "guardianPostCode",
      "guardianMobilePhone",
      "guardianRelationship",
    ])
    return result
  }

  const validateEmergencyContact = async () => {
    const result = await form.trigger([
      "emergencyName",
      "emergencyAddress",
      "emergencyPostCode",
      "emergencyMobilePhone",
      "emergencyRelationship",
    ])
    return result
  }

  const validateMedicalInfo = async () => {
    // Medical info has conditional fields, so we need to check them based on conditions
    const fieldsToValidate = ["hasMedicalConditions", "hasAllergies", "hasInjury"]

    if (form.getValues("hasMedicalConditions")) {
      fieldsToValidate.push("medicalConditionsDetails")
    }

    if (form.getValues("hasAllergies")) {
      fieldsToValidate.push("allergiesDetails")
    }

    if (form.getValues("hasInjury")) {
      fieldsToValidate.push("injuryDetails")
    }

    const result = await form.trigger(fieldsToValidate)
    return result
  }

  const validateConsent = async () => {
    // Consent fields are optional checkboxes, so they don't need validation
    return true
  }

  const validatePaymentInfo = async () => {
    const result = await form.trigger(["membershipOption"])
    return result
  }

  const validateContract = async () => {
    const result = await form.trigger(["contractRead"])
    return result
  }

  const validateSignature = async () => {
    const result = await form.trigger(["contractAgreed", "signatureData"])
    return result
  }

  const steps = [
    { id: "member-info", label: "Member Info" },
    { id: "guardian-info", label: "Guardian Info" },
    { id: "emergency-contact", label: "Emergency Contact" },
    { id: "medical-info", label: "Medical Info" },
    { id: "consent", label: "Consent" },
    { id: "payment-info", label: "Payment" },
    { id: "contract", label: "Contract" },
    { id: "signature", label: "Signature" },
  ]

  const currentStepIndex = steps.findIndex((step) => step.id === activeStep)
  const progress = ((currentStepIndex + 1) / steps.length) * 100

  const nextStep = async () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)

    // Validate the current step
    let isValid = false

    switch (activeStep) {
      case "member-info":
        isValid = await validateMemberInfo()
        break
      case "guardian-info":
        isValid = await validateGuardianInfo()
        break
      case "emergency-contact":
        isValid = await validateEmergencyContact()
        break
      case "medical-info":
        isValid = await validateMedicalInfo()
        break
      case "consent":
        isValid = await validateConsent()
        break
      case "payment-info":
        isValid = await validatePaymentInfo()
        break
      case "contract":
        isValid = await validateContract()
        break
      case "signature":
        isValid = await validateSignature()
        break
      default:
        isValid = true
    }

    // Only proceed to the next step if validation passes
    if (isValid && currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    } else if (!isValid) {
      // Show a toast message if validation fails
      toast({
        title: "Please fix the errors",
        description: "Please complete all required fields before proceeding.",
        variant: "destructive",
      })
    }
  }

  const prevStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex > 0) {
      setActiveStep(steps[currentIndex - 1].id)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
    }
  }

  const onSignatureEnd = (signatureData: string) => {
    console.log("Signature data received:", signatureData.substring(0, 50) + "...")
    setSignatureData(signatureData)
    form.setValue("signatureData", signatureData)
  }

  const onSubmit = async (data: FormValues) => {
    console.log("Form submitted with data:", data)
    console.log("Contract agreed:", data.contractAgreed)
    console.log("Signature data length:", data.signatureData?.length || 0)

    try {
      setIsSubmitting(true)
      setSubmissionError(null)
      setDebugInfo(null)

      // Add user agent to the form data
      const formDataWithUserAgent = {
        ...data,
        userAgent: navigator.userAgent,
      }

      // Submit form data to the API route
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithUserAgent),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form")
      }

      console.log("Form submission successful:", result)

      // Send confirmation email with PDF attachment
      console.log("Sending confirmation email...")
      try {
        const emailResponse = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.guardianEmail,
            name: data.guardianName,
            memberName: data.memberName,
            signatureData: data.signatureData,
          }),
        })

        if (!emailResponse.ok) {
          console.warn("Email sending failed, but continuing with form submission")
        }
      } catch (emailError) {
        console.warn("Email sending failed, but continuing with form submission:", emailError)
      }

      toast({
        title: "Form submitted successfully!",
        description: "You will be redirected to the payment page shortly.",
      })

      // Redirect to payment page (GoCardless)
      console.log("Redirecting to payment page...")
      setTimeout(() => {
        router.push(`/payment?user_id=${result.userId}`)
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setSubmissionError(error.message || "An unexpected error occurred. Please try again.")
      toast({
        title: "Error submitting form",
        description: error.message || "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Add a direct submit handler for testing
  const handleDirectSubmit = () => {
    console.log("Direct submit handler called")
    console.log("Current form values:", form.getValues())

    // Validate form
    form.trigger().then((isValid) => {
      console.log("Form validation result:", isValid)
      if (isValid) {
        console.log("Form is valid, submitting...")
        form.handleSubmit(onSubmit)()
      } else {
        console.log("Form validation errors:", form.formState.errors)
        setSubmissionError("Please fix the form errors before submitting.")
      }
    })
  }

  return (
    <div className="space-y-6">
      <ProgressBar progress={progress} />

      <Tabs value={activeStep} className="w-full">
        <TabsList className="hidden">
          {steps.map((step) => (
            <TabsTrigger key={step.id} value={step.id}>
              {step.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <Card>
          <CardContent className="pt-6">
            {submissionError && (
              <Alert variant="destructive" className="mb-6">
                <AlertDescription>{submissionError}</AlertDescription>
              </Alert>
            )}

            {debugInfo && (
              <div className="mb-6 p-4 bg-gray-100 rounded-md overflow-auto">
                <h3 className="font-bold mb-2">Debug Information:</h3>
                <pre className="text-xs">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <TabsContent value="member-info">
                  <MemberInfo form={form} />
                  <div className="flex justify-end mt-6">
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="guardian-info">
                  <GuardianInfo form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="emergency-contact">
                  <EmergencyContact form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="medical-info">
                  <MedicalInfo form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="consent">
                  <Consent form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="payment-info">
                  <PaymentInfo form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="contract">
                  <ContractText form={form} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button type="button" onClick={nextStep} disabled={!form.getValues().contractRead}>
                      Next
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signature">
                  <SignatureStep form={form} onSignatureEnd={onSignatureEnd} />
                  <div className="flex justify-between mt-6">
                    <Button type="button" variant="outline" onClick={prevStep}>
                      Previous
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDirectSubmit}
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Form"}
                    </Button>
                  </div>

                  {/* Debug section */}
                  <div className="mt-6 p-4 bg-gray-100 rounded-md">
                    <h3 className="font-bold mb-2">Form State:</h3>
                    <p>Contract Read: {form.getValues().contractRead ? "Yes" : "No"}</p>
                    <p>Contract Agreed: {form.getValues().contractAgreed ? "Yes" : "No"}</p>
                    <p>Signature: {form.getValues().signatureData ? "Provided" : "Not provided"}</p>
                    <p>Form Valid: {Object.keys(form.formState.errors).length === 0 ? "Yes" : "No"}</p>
                    {Object.keys(form.formState.errors).length > 0 && (
                      <div className="mt-2">
                        <h4 className="font-semibold">Errors:</h4>
                        <pre className="text-xs mt-1">{JSON.stringify(form.formState.errors, null, 2)}</pre>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
