"use client" // Needed for params and potentially client-side interactions in panels

import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import {
  ArrowLeft,
  Heart,
  Activity,
  Thermometer,
  Droplet,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  Lightbulb,
  ListChecks,
  BarChart3,
  LineChart,
  PieChart,
  ScatterChart,
  FilePlus,
  MessageSquare,
  ShieldAlert,
  Phone,
  Calendar,
  Users,
  BookOpen,
  Search,
  FileText,
  Clock,
  User,
  MapPin,
  Pill,
  AlertCircle,
} from "lucide-react"

// Mock patient data
const patientData = {
  id: "P001",
  initials: "J.D.",
  age: 45,
  gender: "Male",
  dob: "1979-03-15",
  location: "Puskesmas Karimunjawa",
  phone: "+62 274 123-4567",
  address: "Jl. Merdeka No. 123, Karimunjawa",
  chiefComplaint: "Persistent chest pain and occasional shortness of breath for the past 2 weeks",
  medicalHistory: [
    "Hypertension (diagnosed 2015)",
    "Type 2 Diabetes (diagnosed 2018, diet-controlled)",
    "Seasonal Allergies",
  ],
  currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
  allergies: ["Penicillin (rash)", "Shellfish"],
  emergencyContact: {
    name: "Jane Doe",
    relationship: "Spouse",
    phone: "+62 274 123-4568",
  },
}

const vitalSigns = {
  heartRate: { value: 78, unit: "bpm", status: "normal", range: "60-100", trend: "stable" },
  spO2: { value: 97, unit: "%", status: "normal", range: "95-100", trend: "stable" },
  bloodPressure: { systolic: 145, diastolic: 92, unit: "mmHg", status: "elevated", range: "120/80", trend: "up" },
  respiratoryRate: { value: 18, unit: "breaths/min", status: "normal", range: "12-20", trend: "stable" },
  temperature: { value: 36.8, unit: "°C", status: "normal", range: "36.1-37.2", trend: "stable" },
  pulseRate: { value: 75, unit: "bpm", status: "elevated", range: "60-100", trend: "up" },
}

const aiAssessment = {
  overallRisk: "Medium",
  confidenceScore: 87,
  clinicalFindings: [
    { finding: "Elevated resting pulse rate", severity: "Moderate", confidence: 92 },
    { finding: "Slight decrease in HRV (SDNN)", severity: "Mild", confidence: 78 },
    { finding: "Occasional ectopic beats on PPG", severity: "Moderate", confidence: 85 },
  ],
  differentialDiagnosis: [
    { diagnosis: "Essential Hypertension", probability: 85, evidence: "Elevated BP, family history" },
    { diagnosis: "Cardiac Arrhythmia", probability: 60, evidence: "Irregular pulse patterns" },
    { diagnosis: "Anxiety-related symptoms", probability: 40, evidence: "Stress indicators" },
  ],
  recommendations: [
    { suggestion: "Consider 24-hour Holter monitoring for arrhythmia assessment", confidence: 70 },
    { suggestion: "Lifestyle modification advice for stress and activity levels", confidence: 90 },
    { suggestion: "Follow-up echocardiogram within 4 weeks", confidence: 65 },
  ],
}

const icd10Codes = [
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "R05", description: "Cough" },
  { code: "R06.0", description: "Dyspnea" },
  { code: "I49.9", description: "Cardiac arrhythmia, unspecified" },
  { code: "Z51.89", description: "Other specified aftercare" },
]

const treatmentTemplates = [
  "Advise lifestyle modifications (diet, exercise, stress management)",
  "Prescribe antihypertensive medication - ACE inhibitor",
  "Refer to cardiology for further evaluation",
  "Schedule follow-up appointment in 2 weeks",
  "Recommend home blood pressure monitoring",
  "Order 24-hour Holter monitor study",
]

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-red-500" />
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-blue-500" />
  return <Minus className="h-4 w-4 text-gray-500" />
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-green-600"
    case "elevated":
      return "text-orange-600"
    case "high":
      return "text-red-600"
    default:
      return "text-gray-600"
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

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "Severe":
      return <Badge variant="destructive">Severe</Badge>
    case "Moderate":
      return (
        <Badge variant="secondary" className="bg-orange-400 text-white">
          Moderate
        </Badge>
      )
    case "Mild":
      return <Badge className="bg-green-500 text-white">Mild</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

export default function SpecialistPatientDetailPage({ params }: { params: { patientId: string } }) {
  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Patient Information */}
      <div className="w-80 border-r border-neutral-200 bg-gradient-to-b from-neutral-50 to-white overflow-y-auto">
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center gap-2 mb-4">
            <EnhancedButton asChild variant="outline" size="icon-sm">
              <Link href="/specialist/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </EnhancedButton>
            <div>
              <h2 className="text-h2 font-semibold text-neutral-900">{patientData.initials}</h2>
              <p className="text-body-sm text-neutral-600">Patient ID: {patientData.id}</p>
            </div>
          </div>

          <Badge variant="secondary" className="mb-4">
            {patientData.age} y.o. {patientData.gender}
          </Badge>
        </div>

        {/* Patient Information Panel */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Demographics
            </h3>
            <div className="space-y-1 text-body-sm text-neutral-600">
              <p>
                <strong>DOB:</strong> {patientData.dob}
              </p>
              <p>
                <strong>Phone:</strong> {patientData.phone}
              </p>
              <div className="flex items-start gap-1">
                <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <span>{patientData.address}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2">Chief Complaint</h3>
            <p className="text-body-sm text-neutral-600 bg-amber-50 p-3 rounded-md border border-amber-200">
              {patientData.chiefComplaint}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2">Medical History</h3>
            <ul className="space-y-1 text-body-sm text-neutral-600">
              {patientData.medicalHistory.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-neutral-400 rounded-full mt-2 flex-shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
              <Pill className="h-4 w-4" />
              Current Medications
            </h3>
            <ul className="space-y-1 text-body-sm text-neutral-600">
              {patientData.currentMedications.map((med, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  {med}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              Allergies
            </h3>
            <ul className="space-y-1 text-body-sm">
              {patientData.allergies.map((allergy, index) => (
                <li key={index} className="text-red-600 flex items-start gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  {allergy}
                </li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold text-body text-neutral-900 mb-2">Emergency Contact</h3>
            <div className="text-body-sm text-neutral-600 space-y-1">
              <p>
                <strong>{patientData.emergencyContact.name}</strong>
              </p>
              <p>{patientData.emergencyContact.relationship}</p>
              <p>{patientData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-blue-50">
          <h1 className="text-display font-bold text-neutral-900">
            Detailed Patient Analysis: <span className="text-trust-blue">{patientData.initials}</span>
          </h1>
          <p className="text-body-lg text-neutral-600 mt-1">
            Comprehensive health screening analysis and specialist consultation
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Vital Signs Summary Dashboard */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader>
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <Heart className="h-6 w-6 text-health-teal" />
                Vital Signs Summary Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(vitalSigns).map(([key, vital]) => {
                  const isAbnormal = vital.status !== "normal"
                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-lg border ${isAbnormal ? "border-orange-400 bg-orange-50" : "bg-gray-50 border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {key === "heartRate" && <Heart className="h-4 w-4 text-red-500" />}
                          {key === "spO2" && <Droplet className="h-4 w-4 text-blue-500" />}
                          {key === "bloodPressure" && <Activity className="h-4 w-4 text-purple-500" />}
                          {key === "respiratoryRate" && <Activity className="h-4 w-4 text-green-500" />}
                          {key === "temperature" && <Thermometer className="h-4 w-4 text-orange-500" />}
                          {key === "pulseRate" && <Heart className="h-4 w-4 text-pink-500" />}
                          <span className="text-body-sm font-medium text-neutral-700 capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                        </div>
                        <TrendIcon trend={vital.trend as "up" | "down" | "stable"} />
                      </div>
                      <div className="text-h2 font-bold text-neutral-900">
                        {"systolic" in vital ? `${vital.systolic}/${vital.diastolic}` : vital.value}
                        <span className="text-body-sm font-normal text-neutral-600 ml-1">{vital.unit}</span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-neutral-500">Normal: {vital.range}</p>
                        <Badge
                          variant={vital.status === "normal" ? "default" : "secondary"}
                          className={vital.status === "normal" ? "bg-green-500 text-white" : "bg-orange-400 text-white"}
                        >
                          {vital.status}
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* AI Assessment Panel */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader>
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-trust-blue" />
                AI Assessment Panel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Risk Assessment */}
              <div className={`p-4 rounded-lg border-2 ${getRiskColor(aiAssessment.overallRisk)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-h3 font-semibold">Overall Risk Assessment</h3>
                  <Badge variant="outline" className="text-sm">
                    Confidence: {aiAssessment.confidenceScore}%
                  </Badge>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{aiAssessment.overallRisk} Risk</div>
                  <p className="text-body-sm opacity-80">
                    Based on AI analysis of vital signs, ECG data, and respiratory patterns
                  </p>
                </div>
              </div>

              {/* AI-Identified Findings */}
              <div>
                <h4 className="font-semibold text-h3 text-neutral-900 mb-3 flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-trust-blue" />
                  AI-Identified Clinical Findings
                </h4>
                <div className="space-y-3">
                  {aiAssessment.clinicalFindings.map((finding, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-neutral-50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-body text-neutral-900">{finding.finding}</p>
                          <p className="text-body-sm text-neutral-600">Confidence: {finding.confidence}%</p>
                        </div>
                        {getSeverityBadge(finding.severity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Differential Diagnosis Assistant */}
              <div>
                <h4 className="font-semibold text-h3 text-neutral-900 mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5 text-calm-purple" />
                  Differential Diagnosis Assistant
                </h4>
                <div className="space-y-3">
                  {aiAssessment.differentialDiagnosis.map((diagnosis, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-purple-50">
                      <div className="flex justify-between items-start mb-1">
                        <h5 className="font-medium text-body text-neutral-900">{diagnosis.diagnosis}</h5>
                        <Badge variant="outline" className="text-calm-purple border-calm-purple">
                          {diagnosis.probability}%
                        </Badge>
                      </div>
                      <p className="text-body-sm text-neutral-600">{diagnosis.evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Visualization Suite */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader>
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-trust-blue" />
                Data Visualization Suite
              </CardTitle>
              <CardDescription>Interactive analysis of patient's physiological data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-medium">ECG & PPG Waveforms</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-muted-foreground">Interactive ECG/PPG chart with zoom/pan controls</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-medium">Vital Sign Trends</CardTitle>
                    <LineChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-muted-foreground">Time-series analysis of vital signs</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-medium">HRV Analysis</CardTitle>
                    <PieChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-muted-foreground">Heart rate variability analysis charts</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-body font-medium">Correlation Plots</CardTitle>
                    <ScatterChart className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                      <p className="text-muted-foreground">Vital sign correlation analysis</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Specialist Consultation & Decision Tools */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader>
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <FilePlus className="h-6 w-6 text-trust-blue" />
                Specialist Consultation & Decision Tools
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Clinical Notes */}
              <div>
                <Label htmlFor="clinical-notes" className="text-h3 font-semibold text-neutral-900">
                  Clinical Notes
                </Label>
                <Textarea
                  id="clinical-notes"
                  placeholder="Enter detailed clinical observations, assessment, and reasoning..."
                  className="mt-2 min-h-[120px]"
                />
              </div>

              {/* Diagnosis & Treatment */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="diagnosis-code" className="text-body font-semibold text-neutral-900">
                    Diagnosis (ICD-10)
                  </Label>
                  <Select>
                    <SelectTrigger id="diagnosis-code" className="mt-2">
                      <SelectValue placeholder="Search ICD-10 codes" />
                    </SelectTrigger>
                    <SelectContent>
                      {icd10Codes.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} - {item.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="treatment-plan" className="text-body font-semibold text-neutral-900">
                    Treatment Plan Templates
                  </Label>
                  <Select>
                    <SelectTrigger id="treatment-plan" className="mt-2">
                      <SelectValue placeholder="Select treatment template" />
                    </SelectTrigger>
                    <SelectContent>
                      {treatmentTemplates.map((template, index) => (
                        <SelectItem key={index} value={template}>
                          {template}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Drug Interaction Checker */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
                  <Pill className="h-4 w-4 text-trust-blue" />
                  Drug Interaction Checker
                </h4>
                <p className="text-body-sm text-neutral-600 mb-3">
                  Current medications: Lisinopril, Metformin - No major interactions detected
                </p>
                <EnhancedButton size="sm" variant="outline">
                  Check New Prescription
                </EnhancedButton>
              </div>

              {/* Evidence-Based Medicine Integration */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-health-teal" />
                  Evidence-Based Medicine Integration
                </h4>
                <p className="text-body-sm text-neutral-600 mb-3">
                  Access latest clinical guidelines and research for hypertension management
                </p>
                <div className="flex gap-2">
                  <EnhancedButton size="sm" variant="outline">
                    Search Literature
                  </EnhancedButton>
                  <EnhancedButton size="sm" variant="outline">
                    Clinical Guidelines
                  </EnhancedButton>
                </div>
              </div>

              {/* Urgency Assessment */}
              <div>
                <Label className="text-body font-semibold text-neutral-900">Urgency Assessment</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="urgency" value="routine" className="text-trust-blue" />
                    <span className="text-body text-neutral-700">Routine</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="urgency" value="urgent" className="text-orange-500" />
                    <span className="text-body text-neutral-700">Urgent</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="urgency" value="emergency" className="text-red-500" />
                    <span className="text-body text-neutral-700">Emergency</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <EnhancedButton variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Additional Tests
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Follow-up
                </EnhancedButton>
                <EnhancedButton variant="destructive" size="sm">
                  <ShieldAlert className="h-4 w-4 mr-2" />
                  Refer to Emergency Care
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message to Patient
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Health Worker
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Multi-Specialist Consultation
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          {/* Case Management & QA */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader>
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-health-teal" />
                Case Management & Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Status Management */}
              <div>
                <Label className="text-body font-semibold text-neutral-900">Case Status</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="reviewed" className="text-health-teal" />
                    <span className="text-body text-neutral-700">Mark as Reviewed</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="more-info" className="text-orange-500" />
                    <span className="text-body text-neutral-700">Request More Information</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="status" value="escalate" className="text-red-500" />
                    <span className="text-body text-neutral-700">Escalate</span>
                  </label>
                </div>
              </div>

              {/* Peer Review System */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-calm-purple" />
                  Peer Review System
                </h4>
                <p className="text-body-sm text-neutral-600 mb-3">
                  Request a second opinion from another specialist for complex cases
                </p>
                <EnhancedButton size="sm" variant="outline">
                  Request Second Opinion
                </EnhancedButton>
              </div>

              {/* Audit Trail */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-body text-neutral-900 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-neutral-600" />
                  Audit Trail
                </h4>
                <div className="space-y-2 text-body-sm text-neutral-600">
                  <p>• Case opened: 2025-01-03 09:15 by Dr. Emily Carter</p>
                  <p>• AI analysis completed: 2025-01-03 09:18</p>
                  <p>• Specialist review started: 2025-01-03 10:30</p>
                  <p>• Additional data requested: 2025-01-03 10:45</p>
                </div>
              </div>

              {/* Final Actions */}
              <div className="pt-4 border-t border-neutral-200">
                <div className="flex gap-4">
                  <EnhancedButton size="lg" className="flex-1">
                    Finalize & Submit Consultation
                  </EnhancedButton>
                  <EnhancedButton size="lg" variant="outline">
                    Save as Draft
                  </EnhancedButton>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
