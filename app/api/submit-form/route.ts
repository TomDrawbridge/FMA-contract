import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    console.log("Form data received:", formData)

    // Create server-side Supabase client with service role key
    const supabase = createServerClient()

    // Insert user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert({
        name: formData.guardianName,
        email: formData.guardianEmail,
        address: formData.guardianAddress,
        post_code: formData.guardianPostCode,
        home_phone: formData.guardianHomePhone || null,
        mobile_phone: formData.guardianMobilePhone,
        work_phone: formData.guardianWorkPhone || null,
      })
      .select()

    if (userError) {
      console.error("Error inserting user:", userError)
      return NextResponse.json({ error: "Failed to insert user", details: userError }, { status: 500 })
    }

    if (!userData || userData.length === 0) {
      return NextResponse.json({ error: "No user data returned after insertion" }, { status: 500 })
    }

    const userId = userData[0].id
    console.log("User created with ID:", userId)

    // Insert signature data
    const { error: signatureError } = await supabase.from("signatures").insert({
      user_id: userId,
      signature_data: formData.signatureData,
      ip_address: formData.ipAddress,
      user_agent: formData.userAgent,
    })

    if (signatureError) {
      console.error("Error inserting signature:", signatureError)
      return NextResponse.json({ error: "Failed to insert signature", details: signatureError }, { status: 500 })
    }

    // Insert member data with branch_id
    const { error: memberError } = await supabase.from("members").insert({
      user_id: userId,
      name: formData.memberName,
      package: formData.package,
      sport: formData.sport,
      day: formData.day,
      time: formData.time,
      date_of_birth: formData.dateOfBirth,
      gender: formData.gender,
      sibling_attends: formData.siblingAttends,
      has_medical_conditions: formData.hasMedicalConditions,
      medical_conditions_details: formData.hasMedicalConditions ? formData.medicalConditionsDetails : null,
      has_allergies: formData.hasAllergies,
      allergies_details: formData.hasAllergies ? formData.allergiesDetails : null,
      has_injury: formData.hasInjury,
      injury_details: formData.hasInjury ? formData.injuryDetails : null,
      photo_consent: formData.photoConsent,
      first_aid_consent: formData.firstAidConsent,
      membership_option: formData.membershipOption,
      branch_id: formData.branchId,
    })

    if (memberError) {
      console.error("Error inserting member:", memberError)
      return NextResponse.json({ error: "Failed to insert member", details: memberError }, { status: 500 })
    }

    // Insert emergency contact
    const { error: emergencyError } = await supabase.from("emergency_contacts").insert({
      user_id: userId,
      name: formData.emergencyName,
      address: formData.emergencyAddress,
      post_code: formData.emergencyPostCode,
      home_phone: formData.emergencyHomePhone || null,
      mobile_phone: formData.emergencyMobilePhone,
      work_phone: formData.emergencyWorkPhone || null,
      relationship: formData.emergencyRelationship,
    })

    if (emergencyError) {
      console.error("Error inserting emergency contact:", emergencyError)
      return NextResponse.json(
        { error: "Failed to insert emergency contact", details: emergencyError },
        { status: 500 },
      )
    }

    // Insert contract acceptance
    const { error: contractError } = await supabase.from("contract_acceptances").insert({
      user_id: userId,
      accepted_at: new Date().toISOString(),
      contract_version: "v1",
    })

    if (contractError) {
      console.error("Error inserting contract acceptance:", contractError)
      return NextResponse.json(
        { error: "Failed to insert contract acceptance", details: contractError },
        { status: 500 },
      )
    }

    // Return success response with user ID
    return NextResponse.json({ success: true, userId })
  } catch (error: any) {
    console.error("Error in submit-form API route:", error)
    return NextResponse.json({ error: "An unexpected error occurred", details: error.message }, { status: 500 })
  }
}
