"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    keySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Environment Variables Check</CardTitle>
          <CardDescription>Check if your environment variables are properly set</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Environment Variables:</h3>
              <div className="bg-gray-100 p-3 rounded-md">
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.url}
                </p>
                <p>
                  <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.keySet ? "Set" : "Not set"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-gray-500">
            If these values are not set correctly, make sure they are properly configured in your environment.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
