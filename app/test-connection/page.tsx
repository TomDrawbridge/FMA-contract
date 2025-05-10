"use client"

import { useState, useEffect } from "react"
import { testSupabaseConnection } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestConnectionPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [envVars, setEnvVars] = useState({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set",
    keySet: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  const runTest = async () => {
    setIsLoading(true)
    try {
      const testResult = await testSupabaseConnection()
      setResult(testResult)
    } catch (error) {
      setResult({ success: false, error })
    } finally {
      setIsLoading(false)
    }
  }

  // Run test on page load
  useEffect(() => {
    runTest()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Supabase Connection Test</CardTitle>
          <CardDescription>Test your Supabase connection and environment variables</CardDescription>
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

            {result && (
              <div>
                <h3 className="font-medium mb-2">Test Result:</h3>
                <div className={`p-3 rounded-md ${result.success ? "bg-green-100" : "bg-red-100"}`}>
                  <p>
                    <strong>Status:</strong> {result.success ? "Success" : "Failed"}
                  </p>
                  {result.status && (
                    <p>
                      <strong>HTTP Status:</strong> {result.status}
                    </p>
                  )}
                  {result.error && (
                    <div className="mt-2">
                      <p>
                        <strong>Error:</strong> {result.error.message || JSON.stringify(result.error)}
                      </p>
                      {result.error.code && (
                        <p>
                          <strong>Code:</strong> {result.error.code}
                        </p>
                      )}
                      {result.error.hint && (
                        <p>
                          <strong>Hint:</strong> {result.error.hint}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={runTest} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Connection Again"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
