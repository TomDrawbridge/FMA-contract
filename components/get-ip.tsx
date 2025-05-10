"use client"

import { useEffect, useState } from "react"

interface GetIpProps {
  onIpReceived: (ip: string) => void
}

export default function GetIp({ onIpReceived }: GetIpProps) {
  const [ip, setIp] = useState<string>("")

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json")
        const data = await response.json()
        setIp(data.ip)
        onIpReceived(data.ip)
      } catch (error) {
        console.error("Error fetching IP:", error)
        // Fallback to a default value
        setIp("127.0.0.1")
        onIpReceived("127.0.0.1")
      }
    }

    fetchIp()
  }, [onIpReceived])

  return null
}
