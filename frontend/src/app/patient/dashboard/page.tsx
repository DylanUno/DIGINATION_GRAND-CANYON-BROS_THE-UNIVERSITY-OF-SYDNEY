import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Badge } from "@/components/ui/badge"
import { FileText, Calendar, Phone, Clock, MapPin, Heart, AlertTriangle, Bell } from "lucide-react"
import Link from "next/link"

export default function PatientDashboardPage() {
  const patientName = "John Doe"
  const puskesmasLocation = "Puskesmas Karimunjawa"
  const lastAnalysisDate = "December 15, 2024"
  const lastAnalysisRisk = "Medium" // Green/Yellow/Red system
  const nextAppointmentDate = "December 22, 2024"
  const emergencyPhone = "+62 274 123-4567"

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "text-risk-high bg-red-50 border-red-200"
      case "Medium":
        return "text-risk-medium bg-yellow-50 border-yellow-200"
      case "Low":
        return "text-risk-low bg-green-50 border-green-200"
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200"
    }
  }

  const getRiskStatus = (risk: string) => {
    switch (risk) {
      case "High":
        return "high-risk"
      case "Medium":
        return "medium-risk"
      case "Low":
        return "low-risk"
      default:
        return "completed"
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-xl p-6 border border-health-teal/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display font-bold text-neutral-900">Welcome, {patientName}</h1>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-neutral-600" />
              <p className="text-body text-neutral-600">Your healthcare center: {puskesmasLocation}</p>
            </div>
          </div>
          <div className={`p-4 rounded-lg border-2 ${getRiskColor(lastAnalysisRisk)}`}>
            <div className="text-center">
              <StatusIndicator
                status={getRiskStatus(lastAnalysisRisk) as any}
                label={`${lastAnalysisRisk} Risk`}
                showIcon={false}
                className="mb-2"
              />
              <p className="text-body-sm font-medium">Health Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3 pt-6">
          <EnhancedButton asChild size="lg" className="h-20 flex-col bg-trust-blue hover:bg-blue-600">
            <Link href="/patient/results">
              <FileText className="h-6 w-6 mb-2" />
              View Latest Results
            </Link>
          </EnhancedButton>
          <EnhancedButton asChild size="lg" variant="outline" className="h-20 flex-col">
            <Link href="/patient/analysis-history">
              <Clock className="h-6 w-6 mb-2" />
              View All Medical History
            </Link>
          </EnhancedButton>
          <EnhancedButton asChild size="lg" variant="outline" className="h-20 flex-col">
            <Link href="/patient/new-analysis">
              <Calendar className="h-6 w-6 mb-2" />
              Request New Analysis
            </Link>
          </EnhancedButton>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Health Summary Cards */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-health-teal" />
              Last Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-body font-medium text-neutral-900">{lastAnalysisDate}</p>
                <StatusIndicator
                  status={getRiskStatus(lastAnalysisRisk) as any}
                  label={`${lastAnalysisRisk} Risk`}
                  showIcon={false}
                />
              </div>
              <p className="text-body-sm text-neutral-600">Comprehensive health screening completed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-health-teal" />
              Next Appointment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-body font-medium text-neutral-900">{nextAppointmentDate}</p>
                <Badge variant="outline" className="text-trust-blue border-trust-blue">
                  Follow-up
                </Badge>
              </div>
              <p className="text-body-sm text-neutral-600">Scheduled at {puskesmasLocation}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Phone className="h-5 w-5 text-health-teal" />
              Emergency Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-body font-medium text-neutral-900">{emergencyPhone}</p>
                <p className="text-body-sm text-neutral-600">{puskesmasLocation}</p>
              </div>
              <EnhancedButton size="sm" variant="outline" className="w-full">
                <Phone className="h-4 w-4 mr-2" />
                Call Now
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Area */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
            <Bell className="h-5 w-5 text-health-teal" />
            Notifications & Reminders
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-trust-blue mt-0.5" />
              <div>
                <p className="font-medium text-body text-neutral-900">New Analysis Results Available</p>
                <p className="text-body-sm text-neutral-600">
                  Your health screening results from {lastAnalysisDate} are ready for review.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-alert-orange mt-0.5" />
              <div>
                <p className="font-medium text-body text-neutral-900">Medication Reminder</p>
                <p className="text-body-sm text-neutral-600">
                  Don't forget to take your blood pressure medication every morning after breakfast.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
