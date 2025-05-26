import type { Metadata } from "next"
import { PackagesComparison } from "@/components/packages-comparison"

export const metadata: Metadata = {
  title: "FMA Membership Packages",
  description: "Compare our Bronze, Silver, Gold, and Platinum membership packages",
}

export default function PackagesPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <PackagesComparison showBackButton={true} />
    </div>
  )
}
