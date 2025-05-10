"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { supabase } from "@/lib/supabase"

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

  const nextStep = () => {
    const currentIndex = steps.findIndex((step) => step.id === activeStep)
    if (currentIndex < steps.length - 1) {
      setActiveStep(steps[currentIndex + 1].id)
      // Scroll to top when changing steps
      window.scrollTo(0, 0)
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

      // Check if Supabase is properly initialized
      if (!supabase) {
        throw new Error("Supabase client is not initialized")
      }

      // Log Supabase URL and connection info
      console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("Supabase Anon Key set:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

      // Test connection before proceeding
      const { data: testData, error: testError } = await supabase
        .from("users")
        .select("count", { count: "exact", head: true })

      if (testError) {
        console.error("Supabase connection test failed:", testError)
        setDebugInfo({ type: "connectionError", error: testError })
        throw new Error(`Connection test failed: ${testError.message}`)
      } else {
        console.log("Supabase connection successful")
      }

      // Save form data to Supabase with detailed error handling
      console.log("Inserting user data...")
      const {
        data: userData,
        error: userError,
        status: userStatus,
      } = await supabase
        .from("users")
        .insert({
          name: data.guardianName,
          email: data.guardianEmail,
          address: data.guardianAddress,
          post_code: data.guardianPostCode,
          home_phone: data.guardianHomePhone || null,
          mobile_phone: data.guardianMobilePhone,
          work_phone: data.guardianWorkPhone || null,
        })
        .select()

      if (userError) {
        console.error("Error inserting user:", userError)
        console.error("Error details:", {
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code,
          status: userStatus,
        })
        setDebugInfo({
          type: "userError",
          error: userError,
          status: userStatus,
          details: {
            message: userError.message,
            details: userError.details,
            hint: userError.hint,
            code: userError.code,
          },
        })
        throw userError
      }

      if (!userData || userData.length === 0) {
        const error = new Error("No user data returned after insertion")
        setDebugInfo({ type: "noUserData" })
        throw error
      }

      const userId = userData[0].id
      console.log("User created with ID:", userId)

      // Save contract signature
      console.log("Inserting signature data...")
      const { error: signatureError } = await supabase.from("signatures").insert({
        user_id: userId,
        signature_data: data.signatureData,
        ip_address: data.ipAddress,
        user_agent: navigator.userAgent,
      })

      if (signatureError) {
        console.error("Error inserting signature:", signatureError)
        setDebugInfo({ type: "signatureError", error: signatureError })
        throw signatureError
      }

      // Save member information
      console.log("Inserting member data...")
      const { error: memberError } = await supabase.from("members").insert({
        user_id: userId,
        name: data.memberName,
        package: data.package,
        sport: data.sport,
        day: data.day,
        time: data.time,
        date_of_birth: data.dateOfBirth,
        gender: data.gender,
        sibling_attends: data.siblingAttends,
        has_medical_conditions: data.hasMedicalConditions,
        medical_conditions_details: data.hasMedicalConditions ? data.medicalConditionsDetails : null,
        has_allergies: data.hasAllergies,
        allergies_details: data.hasAllergies ? data.allergiesDetails : null,
        has_injury: data.hasInjury,
        injury_details: data.hasInjury ? data.injuryDetails : null,
        photo_consent: data.photoConsent,
        first_aid_consent: data.firstAidConsent,
        membership_option: data.membershipOption,
      })

      if (memberError) {
        console.error("Error inserting member:", memberError)
        setDebugInfo({ type: "memberError", error: memberError })
        throw memberError
      }

      // Save emergency contact
      console.log("Inserting emergency contact data...")
      const { error: emergencyError } = await supabase.from("emergency_contacts").insert({
        user_id: userId,
        name: data.emergencyName,
        address: data.emergencyAddress,
        post_code: data.emergencyPostCode,
        home_phone: data.emergencyHomePhone || null,
        mobile_phone: data.emergencyMobilePhone,
        work_phone: data.emergencyWorkPhone || null,
        relationship: data.emergencyRelationship,
      })

      if (emergencyError) {
        console.error("Error inserting emergency contact:", emergencyError)
        setDebugInfo({ type: "emergencyError", error: emergencyError })
        throw emergencyError
      }

      // Save contract acceptance
      console.log("Inserting contract acceptance data...")
      const { error: contractError } = await supabase.from("contract_acceptances").insert({
        user_id: userId,
        accepted_at: new Date().toISOString(),
        contract_version: "v1",
      })

      if (contractError) {
        console.error("Error inserting contract acceptance:", contractError)
        setDebugInfo({ type: "contractError", error: contractError })
        throw contractError
      }

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
        router.push(`/payment?user_id=${userId}`)
      }, 2000)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
        details: error.details,
        hint: error.hint,
      })
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
