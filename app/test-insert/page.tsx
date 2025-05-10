"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestInsertPage() {
  const [result, setResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const runTest = async () => {
    setIsLoading(true)
    try {
      // Try to insert a test record
      const { data, error, status } = await supabase
        .from("users")
        .insert({
          name: "Test User",
          email: `test-${Date.now()}@example.com`, // Unique email
          address: "123 Test St",
          post_code: "TE1 1ST",
          mobile_phone: "1234567890",
        })
        .select()

      setResult({
        success: !error,
        data,
        error,
        status,
      })
    } catch (error: any) {
      setResult({
        success: false,
        error: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Supabase Insert Test</CardTitle>
          <CardDescription>Test inserting a record into the users table</CardDescription>
        </CardHeader>
        <CardContent>
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
                {result.data && (
                  <div className="mt-2">
                    <p>
                      <strong>Data:</strong>
                    </p>
                    <pre className="bg-gray-800 text-white p-2 rounded text-xs mt-1 overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
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
                    {result.error.details && (
                      <p>
                        <strong>Details:</strong> {result.error.details}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runTest} disabled={isLoading} className="w-full">
            {isLoading ? "Testing..." : "Test Insert"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
