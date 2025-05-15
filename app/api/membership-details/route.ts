import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get member data
    const { data: memberData, error: memberError } = await supabase
      .from("members")
      .select("membership_option")
      .eq("user_id", userId)
      .single()

    if (memberError) {
      console.error("Error fetching member data:", memberError)
      return NextResponse.json(
        {
          success: false,
          error: "Member data not found",
          // Provide default data
          membership_option: "monthly",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({
      success: true,
      membership_option: memberData.membership_option || "monthly",
    })
  } catch (error: any) {
    console.error("Error fetching membership details:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch membership details",
        details: error.message || "Unknown error",
        // Provide default data
        membership_option: "monthly",
      },
      { status: 500 },
    )
  }
}
