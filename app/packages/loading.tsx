import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-10 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-1/2 mx-auto mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[500px] w-full" />
            <Skeleton className="h-10 w-40 mx-auto mt-8" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
