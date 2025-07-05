"use client"

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

export default function PatientDashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Welcome, Sarah Johnson</h1>
        <div className="flex items-center gap-2 text-neutral-600">
          <MapPin className="h-4 w-4" />
          <span>Your healthcare center: Puskesmas Central Jakarta</span>
        </div>
      </div>

      {/* Current Health Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-green-600" />
            Current Health Status
          </CardTitle>
          <CardDescription>Latest analysis summary from your recent visit</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              Healthy
            </Badge>
            <span className="text-sm text-neutral-600">Last updated: December 15, 2024</span>
          </div>
          <p className="mt-2 text-sm text-neutral-700">
            Your recent health screening shows normal vital signs and no immediate concerns. Continue maintaining your
            current healthy lifestyle.
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
                  <div className="text-xs opacity-90">December 15, 2024</div>
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
              <div className="text-sm font-medium">December 15, 2024</div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Normal Range
              </Badge>
              <p className="text-xs text-neutral-600">
                Comprehensive health screening completed. All vital signs within normal parameters.
              </p>
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
              <div className="text-sm font-medium">January 15, 2025</div>
              <div className="text-xs text-neutral-600">10:00 AM</div>
              <p className="text-xs text-neutral-600">Routine follow-up appointment at Puskesmas Central Jakarta</p>
              <EnhancedButton variant="outline" size="sm" className="w-full mt-2">
                Reschedule
              </EnhancedButton>
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

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Appointment Reminder:</strong> You have a scheduled follow-up appointment on January 15, 2025 at
            10:00 AM. Please arrive 15 minutes early and bring your ID card.
          </AlertDescription>
        </Alert>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Health Tip:</strong> Your recent results show excellent cardiovascular health. Continue your current
            exercise routine and maintain a balanced diet to keep up the good work.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Action Required:</strong> Please update your emergency contact information in your profile. Having
            current contact details helps us reach your family in case of emergencies.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
