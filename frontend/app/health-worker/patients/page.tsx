import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Search, UserPlus, Eye, Upload, Users } from "lucide-react"
import Link from "next/link"

// Mock patient data
const patients = [
  {
    id: "P001",
    name: "John Doe",
    age: 45,
    gender: "Male",
    phone: "+1 (555) 123-4567",
    lastVisit: "2025-01-02",
    status: "Active",
  },
  {
    id: "P002",
    name: "Mary Smith",
    age: 62,
    gender: "Female",
    phone: "+1 (555) 234-5678",
    lastVisit: "2025-01-01",
    status: "Pending Review",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    age: 33,
    gender: "Male",
    phone: "+1 (555) 345-6789",
    lastVisit: "2024-12-28",
    status: "Active",
  },
  {
    id: "P004",
    name: "Sarah Wilson",
    age: 28,
    gender: "Female",
    phone: "+1 (555) 456-7890",
    lastVisit: "2024-12-25",
    status: "Inactive",
  },
]

const getStatusIndicator = (status: string) => {
  switch (status) {
    case "Active":
      return <StatusIndicator status="completed" label="Active" showIcon={false} />
    case "Pending Review":
      return <StatusIndicator status="processing" label="Pending Review" showIcon={false} />
    case "Inactive":
      return <StatusIndicator status="urgent" label="Inactive" showIcon={false} />
    default:
      return <StatusIndicator status="completed" label={status} showIcon={false} />
  }
}

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-bold text-neutral-900">Patient Management</h1>
          <p className="text-body-lg text-neutral-600 mt-2">Manage community health records and patient information</p>
        </div>
        <EnhancedButton asChild className="bg-health-teal hover:bg-teal-600">
          <Link href="/health-worker/patients/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Patient
          </Link>
        </EnhancedButton>
      </div>

      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-health-teal" />
            Patient Search & Management
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Find and manage patient records in your community
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                placeholder="Search by name, phone, or patient ID..."
                className="pl-10 h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <EnhancedButton variant="outline">Filter</EnhancedButton>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-body font-medium text-neutral-700">Patient ID</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Full Name</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Age</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Gender</TableHead>
                <TableHead className="hidden md:table-cell text-body font-medium text-neutral-700">Phone</TableHead>
                <TableHead className="hidden lg:table-cell text-body font-medium text-neutral-700">
                  Last Visit
                </TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Status</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-neutral-50">
                  <TableCell className="font-medium text-body text-neutral-900">{patient.id}</TableCell>
                  <TableCell className="text-body text-neutral-900">{patient.name}</TableCell>
                  <TableCell className="text-body text-neutral-700">{patient.age}</TableCell>
                  <TableCell className="text-body text-neutral-700">{patient.gender}</TableCell>
                  <TableCell className="hidden md:table-cell text-body text-neutral-700">{patient.phone}</TableCell>
                  <TableCell className="hidden lg:table-cell text-body text-neutral-700">{patient.lastVisit}</TableCell>
                  <TableCell>{getStatusIndicator(patient.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EnhancedButton asChild size="sm" variant="outline">
                        <Link href={`/health-worker/patients/${patient.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild size="sm" variant="outline">
                        <Link href={`/health-worker/upload?patient=${patient.id}`}>
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Link>
                      </EnhancedButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
