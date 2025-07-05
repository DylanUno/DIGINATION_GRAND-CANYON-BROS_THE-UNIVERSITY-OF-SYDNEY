"use client"

import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Clock,
  AlertTriangle,
  UserPlus,
  Search,
  Eye,
  Bell,
  Calendar,
  Activity,
  FileText,
  Stethoscope,
  Timer,
} from "lucide-react"
import Link from "next/link"

// Mock data
const stats = {
  patientsProcessed: 24,
  pendingReviews: 8,
  urgentCases: 3,
  averageProcessingTime: 12,
}

const todaysPatients = [
  {
    id: "P001",
    name: "John D.",
    timeProcessed: "09:15",
    status: "Results Ready",
    riskLevel: "Medium",
  },
  {
    id: "P002",
    name: "Mary S.",
    timeProcessed: "09:30",
    status: "Specialist Review",
    riskLevel: "High",
  },
  {
    id: "P003",
    name: "Robert J.",
    timeProcessed: "10:00",
    status: "AI Analyzing",
    riskLevel: "Low",
  },
  {
    id: "P004",
    name: "Sarah W.",
    timeProcessed: "10:15",
    status: "Data Uploaded",
    riskLevel: "Medium",
  },
  {
    id: "P005",
    name: "Michael B.",
    timeProcessed: "10:30",
    status: "AI Analyzing",
    riskLevel: "Low",
  },
]

const urgentAlerts = [
  {
    type: "High-Risk Case",
    message: "Patient Mary S. requires immediate specialist attention - cardiac irregularities detected",
    time: "10 mins ago",
    priority: "urgent",
  },
  {
    type: "Results Ready",
    message: "3 patients ready for notification - John D., Michael B., Lisa K.",
    time: "25 mins ago",
    priority: "normal",
  },
  {
    type: "System Update",
    message: "AI analysis model updated - improved accuracy for respiratory conditions",
    time: "1 hour ago",
    priority: "info",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Results Ready":
      return "completed"
    case "Specialist Review":
      return "processing"
    case "AI Analyzing":
      return "processing"
    case "Data Uploaded":
      return "urgent"
    default:
      return "completed"
  }
}

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case "High":
      return <Badge className="bg-red-100 text-red-800 border-red-200">High Risk</Badge>
    case "Medium":
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Medium Risk</Badge>
    case "Low":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Low Risk</Badge>
    default:
      return <Badge variant="outline">{risk}</Badge>
  }
}

const getAlertStyle = (priority: string) => {
  switch (priority) {
    case "urgent":
      return "border-l-4 border-l-red-500 bg-red-50"
    case "normal":
      return "border-l-4 border-l-blue-500 bg-blue-50"
    case "info":
      return "border-l-4 border-l-green-500 bg-green-50"
    default:
      return "border-l-4 border-l-gray-500 bg-gray-50"
  }
}

export default function HealthWorkerDashboard() {
  const staffName = "Dr. Sarah Johnson"
  const puskesmasLocation = "Karimunjawa"
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 17 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">
            {greeting}, {staffName} - Puskesmas {puskesmasLocation}
          </CardTitle>
          <CardDescription className="text-base text-gray-600">
            Today:{" "}
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Today's Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Patients Processed Today</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.patientsProcessed}</div>
            <p className="text-xs text-gray-500">Today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Specialist Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pendingReviews}</div>
            <p className="text-xs text-gray-500">Awaiting specialist</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgentCases}</div>
            <p className="text-xs text-gray-500">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Processing Time</CardTitle>
            <Timer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.averageProcessingTime} min</div>
            <p className="text-xs text-gray-500">Per patient</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <EnhancedButton asChild size="lg" className="h-16 bg-blue-600 hover:bg-blue-700">
              <Link href="/health-worker/patients/register" className="flex flex-col items-center gap-2">
                <UserPlus className="h-6 w-6" />
                <span>Register New Patient</span>
              </Link>
            </EnhancedButton>

            <div className="relative">
              <Search className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
              <Input type="search" placeholder="Search existing patient..." className="h-16 pl-10 text-center" />
            </div>

            <EnhancedButton asChild size="lg" variant="outline" className="h-16">
              <Link href="/health-worker/upload" className="flex flex-col items-center gap-2">
                <Stethoscope className="h-6 w-6" />
                <span>Start New Analysis</span>
              </Link>
            </EnhancedButton>

            <EnhancedButton asChild size="lg" variant="outline" className="h-16">
              <Link href="/health-worker/queue" className="flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span>View Today's Queue</span>
              </Link>
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>

      {/* Patient Queue Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Today's Patients
          </CardTitle>
          <CardDescription>Real-time status of today's patient processing</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Name</TableHead>
                <TableHead>Time Processed</TableHead>
                <TableHead>Current Status</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysPatients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell className="text-sm text-gray-600">{patient.timeProcessed}</TableCell>
                  <TableCell>
                    <StatusIndicator
                      status={getStatusColor(patient.status) as any}
                      label={patient.status}
                      showIcon={false}
                    />
                  </TableCell>
                  <TableCell>{getRiskBadge(patient.riskLevel)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EnhancedButton size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Results
                      </EnhancedButton>
                      <EnhancedButton size="sm" variant="outline">
                        <Bell className="h-3 w-3 mr-1" />
                        Notify Patient
                      </EnhancedButton>
                      <EnhancedButton size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Follow-up
                      </EnhancedButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Urgent Alerts Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Urgent Alerts
          </CardTitle>
          <CardDescription>High-priority notifications requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {urgentAlerts.map((alert, index) => (
            <Alert key={index} className={getAlertStyle(alert.priority)}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-sm">{alert.type}</p>
                    <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 ml-4">{alert.time}</span>
                </div>
              </AlertDescription>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
