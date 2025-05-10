"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPinIcon } from "lucide-react"

export default function BranchSelector() {
  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const { data, error } = await supabase.from("branches").select("*").order("name")

        if (error) {
          console.error("Error fetching branches:", error)
          return
        }

        setBranches(data || [])

        // If there's only one branch, select it automatically
        if (data && data.length === 1) {
          setSelectedBranch(data[0].id)
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBranches()
  }, [])

  const handleContinue = () => {
    if (selectedBranch) {
      router.push(`/?venue=${selectedBranch}`)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Select Your Branch</CardTitle>
        <CardDescription className="text-center">Please select the FMA branch you wish to join</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
          </div>
        ) : branches.length === 0 ? (
          <div className="text-center text-gray-500">No branches available. Please contact support.</div>
        ) : (
          <div className="space-y-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedBranch && (
              <div className="mt-4">
                {branches.find((b) => b.id === selectedBranch)?.address && (
                  <div className="flex items-start mt-2 text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2 mt-0.5" />
                    <div>
                      <p>{branches.find((b) => b.id === selectedBranch)?.address}</p>
                      <p>{branches.find((b) => b.id === selectedBranch)?.post_code}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleContinue} disabled={!selectedBranch || isLoading}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}
