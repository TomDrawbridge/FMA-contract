"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import ContractForm from "@/components/contract-form"
import BranchSelector from "@/components/branch-selector"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const searchParams = useSearchParams()
  const venueParam = searchParams.get("venue")
  const [branchName, setBranchName] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBranchName = async () => {
      if (venueParam) {
        try {
          const { data, error } = await supabase.from("branches").select("name").eq("id", venueParam).single()

          if (error) {
            console.error("Error fetching branch:", error)
            setBranchName("FMA")
          } else {
            setBranchName(data?.name || "FMA")
          }
        } catch (error) {
          console.error("Error fetching branch:", error)
          setBranchName("FMA")
        }
      } else {
        setBranchName("FMA")
      }
      setIsLoading(false)
    }

    fetchBranchName()
  }, [venueParam])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="h-10 w-3/4 mx-auto mb-8" />
          <Skeleton className="h-[600px] w-full max-w-3xl mx-auto rounded-lg" />
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">FMA Membership Form - {branchName}</h1>

        {venueParam ? <ContractForm branchId={venueParam} /> : <BranchSelector />}
      </div>
    </main>
  )
}
