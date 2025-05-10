import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const { email, name, memberName, signatureData } = await request.json()

    console.log("Email API called with:", { email, name, memberName })

    // For now, just log the email sending and return success
    // In a production environment, you would use a service like SendGrid, Resend, or Postmark
    console.log(`Sending email to ${email} for ${memberName}`)

    try {
      const supabase = createServerClient()

      // Log the email sending in Supabase
      await supabase.from("email_logs").insert({
        recipient_email: email,
        recipient_name: name,
        subject: "FMA Contract Confirmation",
        sent_at: new Date().toISOString(),
      })
    } catch (dbError) {
      console.error("Error logging email to database:", dbError)
      // Continue even if logging fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in email API route:", error)
    return NextResponse.json(
      { error: "Failed to send email", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
