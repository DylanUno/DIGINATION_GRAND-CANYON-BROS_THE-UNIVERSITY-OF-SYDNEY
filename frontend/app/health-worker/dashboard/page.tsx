"use client"

import { useState, useEffect } from "react"
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
import { getCurrentUserId } from "@/lib/client-auth"

interface HealthWorkerInfo {
  id: number
  first_name: string
  last_name: string
  health_center_name: string
  health_center_id: number
  department: string
  position: string
}

interface DashboardData {
  dailyStats: {
    patients_processed: number
    pending_reviews: number
    urgent_cases: number
    average_processing_time_minutes: number
  }
  todaysPatients: Array<{
    id: number
    name: string
    screening_date: string
    overall_status: string
    analysis_status: string
    ai_risk_level: string
    specialist_status: string | null
  }>
  urgentAlerts: Array<{
    type: string
    message: string
    minutes_ago: number
    priority: string
  }>
}

async function fetchHealthWorkerInfo(): Promise<HealthWorkerInfo | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    const response = await fetch('/api/health-worker/info', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch health worker info')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching health worker info:', error)
    return null
  }
}

async function fetchDashboardData(): Promise<DashboardData | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    const response = await fetch('/api/health-worker/dashboard-data', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return null
  }
}

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
  const [healthWorker, setHealthWorker] = useState<HealthWorkerInfo | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      
      // Check if user is authenticated
      const userId = getCurrentUserId()
      if (!userId) {
        console.error('No user ID found, redirecting to login')
        window.location.href = '/auth/login/health-worker'
        return
      }
      
      const [workerInfo, dashboardInfo] = await Promise.all([
        fetchHealthWorkerInfo(),
        fetchDashboardData()
      ])
      
      setHealthWorker(workerInfo)
      setDashboardData(dashboardInfo)
      setLoading(false)
    }
    
    loadData()
  }, [])

  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 17 ? "Good Afternoon" : "Good Evening"

  // Helper functions
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPatientStatus = (patient: any) => {
    if (patient.specialist_status === 'pending') return 'Specialist Review'
    if (patient.analysis_status === 'processing') return 'AI Analyzing'
    if (patient.analysis_status === 'completed') return 'Results Ready'
    if (patient.analysis_status === 'urgent_review') return 'Urgent Review'
    return 'Data Uploaded'
  }

  const formatTimeAgo = (minutesAgo: number) => {
    if (minutesAgo < 60) {
      return `${Math.round(minutesAgo)} mins ago`
    } else if (minutesAgo < 1440) {
      return `${Math.round(minutesAgo / 60)} hours ago`
    } else {
      return `${Math.round(minutesAgo / 1440)} days ago`
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading health worker dashboard...</p>
        </div>
      </div>
    )
  }

  if (!healthWorker) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load health worker information</p>
          <p className="text-gray-600 mb-4">This might be due to authentication issues.</p>
          <div className="space-y-2">
            <EnhancedButton onClick={() => window.location.reload()} className="mr-2">
              Try Again
            </EnhancedButton>
            <EnhancedButton 
              variant="outline" 
              onClick={() => window.location.href = '/auth/login/health-worker'}
            >
              Go to Login
            </EnhancedButton>
          </div>
        </div>
      </div>
    )
  }

  const { dailyStats, todaysPatients, urgentAlerts } = dashboardData || {
    dailyStats: { patients_processed: 0, pending_reviews: 0, urgent_cases: 0, average_processing_time_minutes: 0 },
    todaysPatients: [],
    urgentAlerts: []
  }

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900">
            {greeting}, {healthWorker.first_name} {healthWorker.last_name} - {healthWorker.health_center_name}
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
            <div className="text-2xl font-bold text-blue-600">{dailyStats?.patients_processed || 0}</div>
            <p className="text-xs text-gray-500">Today</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Pending Specialist Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{dailyStats?.pending_reviews || 0}</div>
            <p className="text-xs text-gray-500">Awaiting specialist</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{dailyStats?.urgent_cases || 0}</div>
            <p className="text-xs text-gray-500">Require attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Processing Time</CardTitle>
            <Timer className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dailyStats?.average_processing_time_minutes || 0} min</div>
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
              {todaysPatients.length > 0 ? (
                todaysPatients.map((patient: any) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{patient.name}</TableCell>
                    <TableCell className="text-sm text-gray-600">{formatTime(patient.screening_date)}</TableCell>
                    <TableCell>
                      <StatusIndicator
                        status={getStatusColor(getPatientStatus(patient)) as any}
                        label={getPatientStatus(patient)}
                        showIcon={false}
                      />
                    </TableCell>
                    <TableCell>{getRiskBadge(patient.ai_risk_level || 'Low')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <EnhancedButton size="sm" variant="outline" asChild>
                          <Link href={`/health-worker/patients/${patient.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View Results
                          </Link>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No patients processed today
                  </TableCell>
                </TableRow>
              )}
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
          {urgentAlerts.length > 0 ? (
            urgentAlerts.map((alert: any, index: number) => (
              <Alert key={index} className={getAlertStyle(alert.priority)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{alert.type}</p>
                      <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">{formatTimeAgo(alert.minutes_ago)}</span>
                  </div>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <div className="text-center py-8">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All Clear</h3>
              <p className="text-gray-600">No urgent alerts at this time. All patients are being processed normally.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
