"use client"

import { useEffect } from "react"

interface GetIpProps {
  onIpReceived: (ip: string) => void
}

export default function GetIp({ onIpReceived }: GetIpProps) {
  useEffect(() => {
    const fetchIp = async () => {
      try {
        // Use our server-side API route to avoid CORS issues
        const response = await fetch("/api/get-ip")

        if (!response.ok) {
          throw new Error(`Failed to fetch IP: ${response.status}`)
        }

        const data = await response.json()

        if (data.ip) {
          onIpReceived(data.ip)
        } else {
          // Fallback to a default IP if we couldn't get one
          console.error("No IP address returned from API")
          onIpReceived("127.0.0.1")
        }
      } catch (error) {
        console.error("Error fetching IP:", error)
        // Fallback to a default IP
        onIpReceived("127.0.0.1")
      }
    }

    fetchIp()
    // Only run once when component mounts
  }, [onIpReceived])

  // This component doesn't render anything
  return null
}
