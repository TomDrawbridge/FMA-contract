import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    // Get the client's IP address from the request headers
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1"

    return NextResponse.json({ ip })
  } catch (error) {
    console.error("Error getting IP:", error)
    return NextResponse.json({ ip: "127.0.0.1" }, { status: 500 })
  }
}
