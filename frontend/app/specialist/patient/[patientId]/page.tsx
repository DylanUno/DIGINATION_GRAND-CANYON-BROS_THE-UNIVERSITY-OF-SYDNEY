"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Heart,
  AirVentIcon as Lung,
  Activity,
  Thermometer,
  Droplet,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  User,
  Calendar,
  Phone,
  FileText,
  Send,
  AlertOctagon,
  Clock,
  Stethoscope,
  LineChart,
  MessageSquare,
  UserCheck,
  MapPin,
  Pill,
} from "lucide-react"
import Link from "next/link"

// Mock patient data
const patientData = {
  id: "P001",
  initials: "J.D.",
  fullName: "John D.", // For specialist use only
  age: 45,
  gender: "Male",
  location: "Puskesmas Karimunjawa",
  submissionTime: "2025-01-07 09:15",
  riskLevel: "High",
  aiConfidence: 87,
  chiefComplaint: "Chest pain, shortness of breath, and dizziness for the past 2 hours",
  symptoms: ["Chest pain", "Shortness of breath", "Dizziness", "Sweating"],
  medicalHistory: [
    "Hypertension (diagnosed 2018)",
    "Type 2 Diabetes (controlled with medication)",
    "Former smoker (quit 2020)",
  ],
  currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily", "Aspirin 81mg daily"],
  allergies: ["Penicillin (rash)", "Shellfish (hives)"],
  vitalSigns: {
    heartRate: { value: 95, unit: "bpm", normal: "60-100", status: "normal", trend: "stable" },
    respiratoryRate: { value: 22, unit: "breaths/min", normal: "12-20", status: "high", trend: "up" },
    spO2: { value: 94, unit: "%", normal: "95-100", status: "low", trend: "down" },
    pulseRate: { value: 98, unit: "bpm", normal: "60-100", status: "normal", trend: "up" },
    hrv: { value: 28, unit: "ms", normal: "50-100", status: "low", trend: "down" },
    temperature: { value: 37.2, unit: "°C", normal: "36.1-37.2", status: "normal", trend: "stable" },
  },
  aiFindings: [
    { finding: "Elevated respiratory rate above normal range", severity: "Moderate", confidence: 92 },
    { finding: "SpO2 below optimal levels", severity: "Moderate", confidence: 89 },
    { finding: "Reduced heart rate variability", severity: "High", confidence: 85 },
    { finding: "Potential cardiac stress indicators", severity: "High", confidence: 78 },
  ],
  aiSuggestions: [
    { suggestion: "Immediate ECG recommended to rule out acute coronary syndrome", confidence: 85 },
    { suggestion: "Consider chest X-ray to assess pulmonary status", confidence: 78 },
    { suggestion: "Monitor oxygen saturation closely - may require supplemental oxygen", confidence: 82 },
  ],
}

const VitalSignCard = ({ icon: Icon, label, data }: any) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "border-red-200 bg-red-50"
      case "low":
        return "border-orange-200 bg-orange-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "high":
        return "text-red-800"
      case "low":
        return "text-orange-800"
      default:
        return "text-green-800"
    }
  }

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-red-500" />
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-blue-500" />
    return <Minus className="h-4 w-4 text-gray-500" />
  }

  return (
    <Card className={`${getStatusColor(data.status)} border-l-4`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${getStatusTextColor(data.status)}`} />
            <span className="font-medium text-sm">{label}</span>
          </div>
          <TrendIcon trend={data.trend} />
        </div>
        <div className={`text-2xl font-bold ${getStatusTextColor(data.status)} mb-1`}>
          {data.value} <span className="text-sm font-normal">{data.unit}</span>
        </div>
        <p className="text-xs text-neutral-600">Normal: {data.normal}</p>
      </CardContent>
    </Card>
  )
}

export default async function SpecialistPatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = await params
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <EnhancedButton variant="ghost" size="sm" asChild>
              <Link href="/specialist/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Queue
              </Link>
            </EnhancedButton>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Patient {patientData.initials} - Specialist Review</h1>
              <p className="text-sm text-neutral-600">
                {patientData.location} • Submitted {patientData.submissionTime}
              </p>
            </div>
          </div>
          <Badge variant={patientData.riskLevel === "High" ? "destructive" : "secondary"} className="text-sm">
            {patientData.riskLevel} Risk
          </Badge>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Patient Information Section - Now Stacked */}
        <div className="space-y-6">
          {/* Patient Demographics */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-sm font-medium text-neutral-600">Patient ID:</span>
                  <p className="text-base font-semibold text-neutral-900">{patientData.initials}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Age:</span>
                  <p className="text-base font-semibold text-neutral-900">{patientData.age} years</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Gender:</span>
                  <p className="text-base font-semibold text-neutral-900">{patientData.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Location:</span>
                  <p className="text-base font-semibold text-neutral-900 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {patientData.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chief Complaint */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertOctagon className="h-5 w-5 text-red-600" />
                Chief Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                <p className="text-base text-neutral-800 font-medium">{patientData.chiefComplaint}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block">Current Symptoms:</span>
                <div className="flex flex-wrap gap-2">
                  {patientData.symptoms.map((symptom) => (
                    <Badge key={symptom} variant="outline" className="text-sm">
                      {symptom}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Medical History
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block">Past Medical History:</span>
                <ul className="space-y-2">
                  {patientData.medicalHistory.map((item, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-700 pl-3 border-l-2 border-neutral-200 bg-neutral-50 p-2 rounded"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block flex items-center gap-1">
                  <Pill className="h-4 w-4" />
                  Current Medications:
                </span>
                <ul className="space-y-2">
                  {patientData.currentMedications.map((med, index) => (
                    <li
                      key={index}
                      className="text-sm text-neutral-700 pl-3 border-l-2 border-blue-200 bg-blue-50 p-2 rounded"
                    >
                      {med}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block">Allergies:</span>
                <ul className="space-y-2">
                  {patientData.allergies.map((allergy, index) => (
                    <li
                      key={index}
                      className="text-sm text-red-700 pl-3 border-l-2 border-red-200 bg-red-50 p-2 rounded"
                    >
                      {allergy}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Vital Signs Dashboard */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-6 w-6 text-purple-600" />
              Vital Signs Summary Dashboard
            </CardTitle>
            <CardDescription>Real-time physiological measurements with trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <VitalSignCard icon={Heart} label="Heart Rate" data={patientData.vitalSigns.heartRate} />
              <VitalSignCard icon={Lung} label="Respiratory Rate" data={patientData.vitalSigns.respiratoryRate} />
              <VitalSignCard icon={Droplet} label="SpO2" data={patientData.vitalSigns.spO2} />
              <VitalSignCard icon={Activity} label="Pulse Rate" data={patientData.vitalSigns.pulseRate} />
              <VitalSignCard icon={Activity} label="HRV (SDNN)" data={patientData.vitalSigns.hrv} />
              <VitalSignCard icon={Thermometer} label="Temperature" data={patientData.vitalSigns.temperature} />
            </div>
          </CardContent>
        </Card>

        {/* AI Assessment Panel */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-orange-600" />
              AI Assessment Panel
            </CardTitle>
            <CardDescription>Automated analysis and preliminary diagnostic insights</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Risk Assessment */}
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-red-800">Overall Risk Assessment</h3>
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-red-800 mb-1">{patientData.riskLevel} Risk</div>
              <p className="text-sm text-red-700">AI Confidence: {patientData.aiConfidence}%</p>
              <p className="text-sm text-red-600 mt-2 bg-red-100 p-2 rounded">
                Multiple indicators suggest potential cardiac stress requiring immediate evaluation
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* AI-Identified Clinical Findings */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  AI-Identified Clinical Findings
                </h3>
                <div className="space-y-3">
                  {patientData.aiFindings.map((finding, index) => (
                    <div key={index} className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium text-neutral-800">{finding.finding}</span>
                        <Badge variant={finding.severity === "High" ? "destructive" : "secondary"} className="text-xs">
                          {finding.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-neutral-600">Confidence: {finding.confidence}%</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preliminary Diagnostic Suggestions */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-600" />
                  Preliminary Diagnostic Suggestions
                </h3>
                <div className="space-y-3">
                  {patientData.aiSuggestions.map((suggestion, index) => (
                    <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-800 mb-1">{suggestion.suggestion}</p>
                      <p className="text-xs text-blue-600">Confidence: {suggestion.confidence}%</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specialist Consultation Tools */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-green-600" />
              Specialist Consultation Tools
            </CardTitle>
            <CardDescription>Clinical assessment and treatment planning interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Clinical Notes */}
            <div>
              <Label htmlFor="clinical-notes" className="text-sm font-semibold text-neutral-700">
                Clinical Notes & Observations
              </Label>
              <Textarea
                id="clinical-notes"
                placeholder="Enter your detailed clinical assessment, differential diagnosis, and specialist observations..."
                className="mt-2 min-h-[100px]"
              />
            </div>

            {/* Diagnosis and Treatment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="icd-code" className="text-sm font-semibold text-neutral-700">
                  ICD-10 Diagnosis Code
                </Label>
                <Select>
                  <SelectTrigger id="icd-code" className="mt-2">
                    <SelectValue placeholder="Search diagnosis codes..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I20.9">I20.9 - Angina pectoris, unspecified</SelectItem>
                    <SelectItem value="I25.9">I25.9 - Chronic ischemic heart disease</SelectItem>
                    <SelectItem value="R06.0">R06.0 - Dyspnea</SelectItem>
                    <SelectItem value="R50.9">R50.9 - Fever, unspecified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgency" className="text-sm font-semibold text-neutral-700">
                  Urgency Assessment
                </Label>
                <Select>
                  <SelectTrigger id="urgency" className="mt-2">
                    <SelectValue placeholder="Select urgency level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emergency">Emergency - Immediate Care</SelectItem>
                    <SelectItem value="urgent">Urgent - Within 24 hours</SelectItem>
                    <SelectItem value="routine">Routine - Standard follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Treatment Recommendations */}
            <div>
              <Label htmlFor="treatment" className="text-sm font-semibold text-neutral-700">
                Treatment Recommendations & Patient Instructions
              </Label>
              <Textarea
                id="treatment"
                placeholder="Provide specific treatment plans, medication adjustments, lifestyle modifications, and follow-up instructions..."
                className="mt-2 min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <EnhancedButton variant="destructive" size="sm" className="justify-start">
                <AlertOctagon className="h-4 w-4 mr-2" />
                Emergency Care
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm" className="justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Additional Tests
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm" className="justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </EnhancedButton>
              <EnhancedButton variant="outline" size="sm" className="justify-start">
                <Clock className="h-4 w-4 mr-2" />
                Routine Monitoring
              </EnhancedButton>
            </div>

            {/* Communication Panel */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Communication & Case Management</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <EnhancedButton className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Patient
                </EnhancedButton>
                <EnhancedButton variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Health Worker
                </EnhancedButton>
              </div>
            </div>

            {/* Case Status Management */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-neutral-700 mb-3">Case Status Management</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <EnhancedButton size="lg" className="w-full">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Consultation
                </EnhancedButton>
                <EnhancedButton variant="outline" size="lg" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Request More Information
                </EnhancedButton>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
