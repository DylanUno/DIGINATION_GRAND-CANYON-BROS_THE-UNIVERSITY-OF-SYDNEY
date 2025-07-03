import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share, AlertTriangle, CheckCircle, Heart, Activity } from "lucide-react"
import Link from "next/link"

// Mock analysis results data
const analysisResults = {
  id: "A001",
  patientName: "John Doe",
  patientId: "P001",
  analysisDate: "2025-01-02",
  analysisTime: "14:30",
  overallRisk: "Medium",
  confidence: 87,
  vitalSigns: {
    heartRate: { value: 78, unit: "bpm", status: "normal", range: "60-100" },
    bloodPressure: { systolic: 145, diastolic: 92, unit: "mmHg", status: "elevated", range: "120/80" },
    respiratoryRate: { value: 18, unit: "breaths/min", status: "normal", range: "12-20" },
    spO2: { value: 97, unit: "%", status: "normal", range: "95-100" },
    temperature: { value: 36.8, unit: "°C", status: "normal", range: "36.1-37.2" },
  },
  aiFindings: [
    {
      category: "Cardiovascular",
      finding: "Elevated blood pressure detected",
      severity: "Moderate",
      confidence: 92,
    },
    {
      category: "Cardiac Rhythm",
      finding: "Occasional premature ventricular contractions (PVCs)",
      severity: "Mild",
      confidence: 78,
    },
    {
      category: "Respiratory",
      finding: "Normal respiratory patterns observed",
      severity: "Normal",
      confidence: 95,
    },
  ],
  recommendations: [
    "Monitor blood pressure regularly",
    "Consider lifestyle modifications (diet, exercise)",
    "Follow-up appointment in 2 weeks",
    "Continue current diabetes medication",
  ],
  specialistNotes:
    "Patient shows signs of hypertension progression. Recommend cardiology consultation if BP remains elevated.",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-brand-medical-green"
    case "elevated":
    case "high":
      return "text-red-500"
    case "low":
      return "text-blue-500"
    default:
      return "text-gray-500"
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "Normal":
      return <Badge className="bg-brand-medical-green text-white">Normal</Badge>
    case "Mild":
      return (
        <Badge variant="secondary" className="bg-yellow-400 text-white">
          Mild
        </Badge>
      )
    case "Moderate":
      return (
        <Badge variant="secondary" className="bg-orange-400 text-white">
          Moderate
        </Badge>
      )
    case "Severe":
      return <Badge variant="destructive">Severe</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "text-red-600 bg-red-100 border-red-500"
    case "Medium":
      return "text-orange-600 bg-orange-100 border-orange-500"
    case "Low":
      return "text-green-600 bg-green-100 border-green-500"
    default:
      return "text-gray-600 bg-gray-100 border-gray-500"
  }
}

export default function AnalysisResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/health-worker/queue">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Analysis Results</h1>
          <p className="text-gray-600">
            {analysisResults.patientName} ({analysisResults.patientId}) • {analysisResults.analysisDate} at{" "}
            {analysisResults.analysisTime}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <Card className={`border-2 ${getRiskColor(analysisResults.overallRisk)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {analysisResults.overallRisk === "High" && <AlertTriangle className="h-6 w-6" />}
              {analysisResults.overallRisk === "Medium" && <AlertTriangle className="h-6 w-6" />}
              {analysisResults.overallRisk === "Low" && <CheckCircle className="h-6 w-6" />}
              Overall Risk Assessment
            </CardTitle>
            <Badge variant="outline" className="text-sm">
              Confidence: {analysisResults.confidence}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2">{analysisResults.overallRisk} Risk</div>
            <p className="text-sm opacity-80">
              Based on AI analysis of vital signs, ECG data, and respiratory patterns
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vital Signs Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Vital Signs Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(analysisResults.vitalSigns).map(([key, vital]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</p>
                  <p className="text-sm text-gray-600">Normal: {vital.range}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${getStatusColor(vital.status)}`}>
                    {"systolic" in vital ? `${vital.systolic}/${vital.diastolic}` : vital.value} {vital.unit}
                  </p>
                  <p className={`text-sm capitalize ${getStatusColor(vital.status)}`}>{vital.status}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Findings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              AI Clinical Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {analysisResults.aiFindings.map((finding, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{finding.category}</p>
                    <p className="text-sm text-gray-600">{finding.finding}</p>
                  </div>
                  {getSeverityBadge(finding.severity)}
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Confidence: {finding.confidence}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recommendations & Next Steps</CardTitle>
          <CardDescription>AI-generated recommendations based on analysis results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analysisResults.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialist Notes */}
      {analysisResults.specialistNotes && (
        <Card>
          <CardHeader>
            <CardTitle>Specialist Review Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm">{analysisResults.specialistNotes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4">
        <Button asChild className="bg-brand-medical-green hover:bg-brand-medical-green/90">
          <Link href={`/health-worker/patients/${analysisResults.patientId}`}>View Patient Profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/health-worker/upload?patient=${analysisResults.patientId}`}>Upload New Data</Link>
        </Button>
      </div>
    </div>
  )
} 