"use client" // Keep for potential client-side interactions like sorting/filtering in future

// Remove useState import: import { useState } from "react"
import Link from "next/link" // Add Link import
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Filter, Search, Users, AlertOctagon, Clock, ArrowUpDown } from "lucide-react" // Added ArrowUpDown
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Remove imports for detailed panel components:
// import { PatientInfoPanel } from "@/components/specialist/patient-info-panel"
// ... and others

// Placeholder data
const initialPatients = [
  {
    id: "P001",
    initials: "J.D.",
    age: 45,
    gender: "Male",
    submissionTime: "2025-06-04 09:15",
    riskLevel: "High",
    priorityScore: 95,
  },
  {
    id: "P002",
    initials: "A.S.",
    age: 62,
    gender: "Female",
    submissionTime: "2025-06-04 08:30",
    riskLevel: "Medium",
    priorityScore: 70,
  },
  {
    id: "P003",
    initials: "R.B.",
    age: 33,
    gender: "Male",
    submissionTime: "2025-06-03 17:45",
    riskLevel: "Low",
    priorityScore: 40,
  },
]

type Patient = (typeof initialPatients)[0]

const getRiskBadgeVariant = (riskLevel: string) => {
  if (riskLevel === "High") return "destructive"
  if (riskLevel === "Medium") return "secondary"
  return "default"
}

export default function SpecialistDashboardPage() {
  // Remove state: const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  // Remove handlers: handleSelectPatient, handleCloseDetailView

  return (
    // Remove the lg:grid-cols-12 and related conditional classes for the split view
    <div className="grid flex-1 auto-rows-max items-start gap-4 md:gap-8">
      {/* Stats Cards - always visible */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              Total Patients in Queue
            </CardDescription>
            <CardTitle className="text-3xl md:text-4xl text-primary">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">+5 since last hour</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <AlertOctagon className="h-4 w-4 mr-1 text-red-500" />
              High-Risk Patients
            </CardDescription>
            <CardTitle className="text-3xl md:text-4xl text-red-500">3</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Immediate attention required</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              Avg. Processing Time
            </CardDescription>
            <CardTitle className="text-3xl md:text-4xl text-primary">25m</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">Per patient analysis</div>
          </CardContent>
        </Card>
      </div>

      {/* Patient Queue Card */}
      <Card>
        <CardHeader className="px-4 sm:px-7">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Queue</CardTitle>
              <CardDescription>Manage and prioritize incoming patient analyses.</CardDescription>
            </div>
            {/* Remove XCircle button for closing details */}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Filter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>High Risk</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Medium Risk</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Low Risk</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search patients..." className="pl-8 w-full bg-white" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient ID</TableHead>
                <TableHead>Initials</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead className="hidden md:table-cell">
                  Submission Time{" "}
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                    {" "}
                    {/* Adjusted button */}
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="hidden sm:table-cell">Priority</TableHead> {/* Show priority on sm and up */}
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{patient.id}</TableCell>
                  <TableCell>{patient.initials}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.gender}</TableCell>
                  <TableCell className="hidden md:table-cell">{patient.submissionTime}</TableCell>
                  <TableCell>
                    <Badge
                      variant={getRiskBadgeVariant(patient.riskLevel)}
                      className={
                        patient.riskLevel === "Low"
                          ? "bg-brand-medical-green text-white"
                          : patient.riskLevel === "Medium"
                            ? "bg-orange-400 text-white"
                            : ""
                      }
                    >
                      {patient.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{patient.priorityScore}</TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/specialist/patient/${patient.id}`}>View Details</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Remove the detailed patient analysis view section */}
    </div>
  )
}
