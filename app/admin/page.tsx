import { createServerClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

export default async function AdminPage() {
  const supabase = createServerClient()

  // Check if user is authenticated and has admin role
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/admin/login")
  }

  // Get all submissions
  const { data: members } = await supabase
    .from("members")
    .select(`
      *,
      users (
        id,
        name,
        email,
        created_at
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member Name</TableHead>
                <TableHead>Guardian</TableHead>
                <TableHead>Package</TableHead>
                <TableHead>Sport</TableHead>
                <TableHead>Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.users?.name}</TableCell>
                  <TableCell>{member.package}</TableCell>
                  <TableCell>{member.sport}</TableCell>
                  <TableCell>
                    {member.created_at
                      ? formatDistanceToNow(new Date(member.created_at), { addSuffix: true })
                      : "Unknown"}
                  </TableCell>
                </TableRow>
              ))}
              {!members?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No submissions yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
