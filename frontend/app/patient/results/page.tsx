"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Download,
  Printer,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Stethoscope,
} from "lucide-react"

export default function PatientResults() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Latest Health Analysis Results</h1>
        <p className="text-neutral-600">Comprehensive health screening results and recommendations</p>
      </div>

      {/* Analysis Summary */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-sm">
                <strong>Date:</strong> December 15, 2024, 10:30 AM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-500" />
              <span className="text-sm">
                <strong>Location:</strong> Puskesmas Central Jakarta
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-base px-3 py-1">
              <CheckCircle className="h-4 w-4 mr-2" />
              Healthy - No Immediate Concerns
            </Badge>
          </div>

          <p className="text-neutral-700">
            Your comprehensive health screening has been completed successfully. All vital signs and key health
            indicators are within normal ranges. The analysis shows good overall health with no immediate medical
            concerns requiring urgent attention.
          </p>
        </CardContent>
      </Card>

      {/* Vital Signs Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vital Signs Overview
          </CardTitle>
          <CardDescription>Detailed analysis of your key health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Heart Health */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold">Heart Health</h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Normal
              </Badge>
              <p className="text-sm text-neutral-600">
                Heart rhythm is regular and strong. Blood pressure readings are within optimal range (120/80 mmHg).
              </p>
            </div>

            {/* Respiratory */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Respiratory</h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Normal
              </Badge>
              <p className="text-sm text-neutral-600">
                Breathing patterns are regular and efficient. Lung capacity and respiratory rate are within healthy
                limits.
              </p>
            </div>

            {/* Blood Oxygen */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-cyan-500" />
                <h3 className="font-semibold">Blood Oxygen</h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Excellent
              </Badge>
              <p className="text-sm text-neutral-600">
                Oxygen saturation levels are excellent at 98%. Blood circulation and oxygen delivery are optimal.
              </p>
            </div>

            {/* Body Temperature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">Temperature</h3>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Normal
              </Badge>
              <p className="text-sm text-neutral-600">
                Body temperature is stable at 36.7°C. No signs of fever or temperature irregularities detected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Overall Health Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Excellent Health Status:</strong> Your comprehensive health screening indicates that you are in
              excellent health. All vital signs, cardiovascular indicators, and respiratory functions are performing
              optimally. No immediate medical concerns have been identified that require urgent attention or
              intervention.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Specialist Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Specialist Recommendations
          </CardTitle>
          <CardDescription>Professional guidance for maintaining your health</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Next Steps */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Next Steps
            </h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Continue your current healthy lifestyle and dietary habits
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Schedule your next routine check-up in 6 months (June 2025)
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Maintain regular physical activity and exercise routine
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                Keep monitoring your blood pressure monthly at home
              </li>
            </ul>
          </div>

          <Separator />

          {/* Lifestyle Advice */}
          <div>
            <h3 className="font-semibold mb-3">Lifestyle Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Diet & Nutrition</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Continue balanced diet with plenty of fruits and vegetables</li>
                  <li>• Maintain adequate water intake (8-10 glasses daily)</li>
                  <li>• Limit processed foods and excessive salt intake</li>
                  <li>• Include omega-3 rich foods for heart health</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Physical Activity</h4>
                <ul className="text-sm text-neutral-600 space-y-1">
                  <li>• Maintain 150 minutes of moderate exercise weekly</li>
                  <li>• Include both cardio and strength training</li>
                  <li>• Take regular walks, especially after meals</li>
                  <li>• Consider yoga or stretching for flexibility</li>
                </ul>
              </div>
            </div>
          </div>

          <Separator />

          {/* Follow-up Schedule */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Follow-up Schedule
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-neutral-700 mb-2">
                <strong>Next Appointment:</strong> January 15, 2025 at 10:00 AM
              </p>
              <p className="text-sm text-neutral-600">
                This will be a routine follow-up to monitor your continued good health and address any new concerns.
                Please bring this report and any questions you may have.
              </p>
            </div>
          </div>

          <Separator />

          {/* Warning Signs */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              When to Seek Immediate Medical Attention
            </h3>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Contact emergency services (119) immediately if you experience:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Severe chest pain or pressure</li>
                  <li>• Difficulty breathing or shortness of breath</li>
                  <li>• Sudden severe headache or dizziness</li>
                  <li>• Persistent high fever (above 39°C)</li>
                  <li>• Any symptoms that concern you significantly</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Options
          </CardTitle>
          <CardDescription>Save or print your health reports for your records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <EnhancedButton variant="default" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report (PDF)
            </EnhancedButton>
            <EnhancedButton variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Summary Report
            </EnhancedButton>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Full report includes detailed medical data and technical measurements. Summary report provides key
            information in simplified format for home reference.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
