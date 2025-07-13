"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  MapPin,
  FileText,
  Clock,
  User,
  Download,
  Phone,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"
import { getCurrentUserId } from "@/lib/client-auth"

interface PatientInfo {
  id: number
  first_name: string
  last_name: string
  phone_number: string
  health_center_name: string
  medical_record_number: string
  date_of_birth: string
  gender: string
}

interface DashboardData {
  latestScreening: {
    screening_date: string
    overall_status: string
    overall_notes: string
  } | null
  nextAppointment: {
    appointment_date: string
    appointment_type: string
    health_center_name: string
    notes: string
  } | null
  notifications: Array<{
    title: string
    message: string
    type: string
    priority: string
    read_status: boolean
    action_required: boolean
    created_at: string
  }>
}

async function fetchPatientInfo(): Promise<PatientInfo | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    const response = await fetch('/api/patient/info', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch patient info')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching patient info:', error)
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
    
    const response = await fetch('/api/patient/dashboard-data', {
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

export default function PatientDashboard() {
  const [patient, setPatient] = useState<PatientInfo | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [patientInfo, dashboardInfo] = await Promise.all([
        fetchPatientInfo(),
        fetchDashboardData()
      ])
      
      setPatient(patientInfo)
      setDashboardData(dashboardInfo)
      setLoading(false)
    }
    
    loadData()
  }, [])

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Healthy
          </Badge>
        )
      case 'attention_needed':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Attention Needed
          </Badge>
        )
      case 'urgent':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Urgent
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
            <Info className="h-3 w-3 mr-1" />
            No Recent Data
          </Badge>
        )
    }
  }

  // Helper function to get status border color
  const getStatusBorderColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'border-l-green-500'
      case 'attention_needed':
        return 'border-l-yellow-500'
      case 'urgent':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading patient dashboard...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load patient information</p>
          <EnhancedButton onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </EnhancedButton>
        </div>
      </div>
    )
  }

  const { latestScreening, nextAppointment, notifications } = dashboardData || {
    latestScreening: null,
    nextAppointment: null,
    notifications: []
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Welcome, {patient.first_name} {patient.last_name}
        </h1>
        <div className="flex items-center gap-2 text-neutral-600">
          <MapPin className="h-4 w-4" />
          <span>Your healthcare center: {patient.health_center_name}</span>
        </div>
      </div>

      {/* Current Health Status */}
      <Card className={`border-l-4 ${getStatusBorderColor(latestScreening?.overall_status || 'none')}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Current Health Status
          </CardTitle>
          <CardDescription>Latest analysis summary from your recent visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            {getStatusBadge(latestScreening?.overall_status || 'none')}
            <span className="text-sm text-neutral-600">
              {latestScreening ? `Last updated: ${formatDate(latestScreening.screening_date)}` : 'No recent screenings'}
            </span>
          </div>
          <p className="mt-2 text-sm text-neutral-700">
            {latestScreening?.overall_notes || 'No recent health screening data available. Please schedule an appointment for your next health check.'}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Access your most important health information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <EnhancedButton variant="default" size="lg" className="h-auto p-4 justify-start" asChild>
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">View Latest Results</div>
                  <div className="text-xs opacity-90">
                    {latestScreening ? formatDate(latestScreening.screening_date) : 'No data available'}
                  </div>
                </div>
              </div>
            </EnhancedButton>

            <EnhancedButton variant="outline" size="lg" className="h-auto p-4 justify-start" asChild>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">View All Medical History</div>
                  <div className="text-xs opacity-70">Timeline view</div>
                </div>
              </div>
            </EnhancedButton>

            <EnhancedButton variant="outline" size="lg" className="h-auto p-4 justify-start" asChild>
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Update Contact Information</div>
                  <div className="text-xs opacity-70">Keep your details current</div>
                </div>
              </div>
            </EnhancedButton>

            <EnhancedButton variant="outline" size="lg" className="h-auto p-4 justify-start" asChild>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Download Health Reports</div>
                  <div className="text-xs opacity-70">PDF format available</div>
                </div>
              </div>
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Last Analysis */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Last Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {latestScreening ? (
                <>
                  <div className="text-sm font-medium">{formatDate(latestScreening.screening_date)}</div>
                  {getStatusBadge(latestScreening.overall_status)}
                  <p className="text-xs text-neutral-600">
                    {latestScreening.overall_notes || 'Health screening completed successfully.'}
                  </p>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-neutral-500">No recent analysis</div>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">
                    No Data
                  </Badge>
                  <p className="text-xs text-neutral-600">
                    Schedule an appointment for your health screening.
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Appointment */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {nextAppointment ? (
                <>
                  <div className="text-sm font-medium">{formatDate(nextAppointment.appointment_date)}</div>
                  <div className="text-xs text-neutral-600">{formatTime(nextAppointment.appointment_date)}</div>
                  <p className="text-xs text-neutral-600">
                    {nextAppointment.appointment_type.replace('_', ' ')} at {nextAppointment.health_center_name}
                  </p>
                  <EnhancedButton variant="outline" size="sm" className="w-full mt-2">
                    Reschedule
                  </EnhancedButton>
                </>
              ) : (
                <>
                  <div className="text-sm font-medium text-neutral-500">No upcoming appointments</div>
                  <p className="text-xs text-neutral-600">Contact your health center to schedule your next check-up</p>
                  <EnhancedButton variant="outline" size="sm" className="w-full mt-2">
                    Schedule Appointment
                  </EnhancedButton>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm font-medium">24/7 Healthcare Hotline</div>
              <div className="text-lg font-bold text-trust-blue">119</div>
              <p className="text-xs text-neutral-600">For immediate medical emergencies, call this number anytime.</p>
              <EnhancedButton variant="outline" size="sm" className="w-full mt-2">
                <Phone className="h-3 w-3 mr-1" />
                Call Now
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Important Notifications */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Important Notifications</h2>

        {notifications.length > 0 ? (
          notifications.map((notification, index) => {
            const getNotificationIcon = (type: string, priority: string) => {
              if (priority === 'urgent') return AlertTriangle
              if (type === 'test_result') return CheckCircle
              if (type === 'appointment_reminder') return Calendar
              return Info
            }

            const Icon = getNotificationIcon(notification.type, notification.priority)

            return (
              <Alert key={index} className={notification.priority === 'urgent' ? 'border-red-200 bg-red-50' : ''}>
                <Icon className="h-4 w-4" />
                <AlertDescription>
                  <strong>{notification.title}:</strong> {notification.message}
                  {notification.action_required && (
                    <div className="mt-2">
                      <EnhancedButton variant="outline" size="sm">
                        Take Action
                      </EnhancedButton>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )
          })
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>All Clear:</strong> You have no new notifications at this time. Check back later for important updates about your health.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
