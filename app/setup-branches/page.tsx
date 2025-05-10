"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"

export default function SetupBranchesPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success?: boolean
    message?: string
    error?: string
    alreadyExists?: boolean
  } | null>(null)

  const runSetup = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/setup-branches")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ success: false, error: String(error) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Branches Setup</CardTitle>
          <CardDescription>Set up the branches table and update the members table</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            This will create the branches table, add a branch_id column to the members table, and insert sample branch
            data.
          </p>

          {result && (
            <Alert variant={result.success || result.alreadyExists ? "default" : "destructive"} className="mt-4">
              {result.success || result.alreadyExists ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>{result.success ? "Success" : result.alreadyExists ? "Already Set Up" : "Error"}</AlertTitle>
              <AlertDescription>
                {result.message || result.error || (result.success ? "Setup completed successfully" : "Setup failed")}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={runSetup} disabled={isLoading} className="w-full">
            {isLoading ? "Setting up..." : "Run Setup"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
