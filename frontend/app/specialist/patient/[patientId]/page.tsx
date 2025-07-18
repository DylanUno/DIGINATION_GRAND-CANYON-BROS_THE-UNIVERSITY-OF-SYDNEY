"use client"

import { useState, useEffect } from 'react'
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
  Brain,
  Users,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { MedicalPlotsPanel } from "@/components/specialist/medical-plots-panel"
import { StructuredAIAssessment } from "@/components/specialist/structured-ai-assessment"

// Interface definitions
interface PatientInfo {
  patient_id: string
  full_name: string
  age: number
  gender: string
  phone: string
  address: string
  known_conditions: string | string[]
  current_medications: string | string[]
  allergies: string | string[]
}

interface AnalysisSession {
  session_id: string
  status: string
  ai_risk_level: string
  created_at: string
  updated_at: string
}

interface ClinicalContext {
  chief_complaint: string
  symptoms: string[]
  pain_scale: number
  symptom_duration: string
  temperature: string
  staff_notes: string
}

interface VitalSigns {
  heart_rate_bpm: number | null
  respiratory_rate_bpm: number | null
  pulse_rate_bpm: number | null
  spo2_percent: number | null
  hrv_sdnn: number | null
  hrv_rmssd: number | null
  video_respiratory_rate: number | null
  video_analysis_confidence: number | null
}

interface SpecialistInsight {
  specialist: string
  role: string
  key_finding: string
  confidence: number
}

interface MAIDxOResults {
  overall_risk_level: string
  consensus_level: number
  total_rounds: number
  timestamp: string
  specialist_insights: SpecialistInsight[]
  key_recommendations: string[]
  follow_up_needed: boolean
  final_consensus?: any
  debate_history?: any[]
}

interface PatientAnalysisData {
  patient_info: PatientInfo
  analysis_session: AnalysisSession
  clinical_context: ClinicalContext
  vital_signs: VitalSigns
  features: any
  mai_dxo_results: MAIDxOResults
  files: {
    dat_file_path: string
    hea_file_path: string
    video_file_path: string
  }
}

// Mock patient data (fallback)
const mockPatientData = {
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

// Helper function to get units for different vital signs
const getUnitForLabel = (label: string): string => {
  switch (label.toLowerCase()) {
    case 'heart rate':
      return 'bpm'
    case 'respiratory rate':
      return 'breaths/min'
    case 'pulse rate':
      return 'bpm'
    case 'spo2':
      return '%'
    case 'hrv (sdnn)':
      return 'ms'
    case 'temperature':
      return '°C'
    default:
      return ''
  }
}

// Helper function to format vital signs values with proper medical rounding
const formatVitalSignValue = (value: number | null | string, label: string): string => {
  if (value === null || value === undefined || value === '') return 'N/A'
  
  // Handle string temperature values
  if (label.toLowerCase() === 'temperature' && typeof value === 'string') {
    return value
  }
  
  // Handle numeric values
  if (typeof value === 'number') {
    switch (label.toLowerCase()) {
      case 'heart rate':
      case 'pulse rate':
      case 'respiratory rate':
        return Math.round(value).toString()
      case 'spo2':
        return Math.round(value).toString()
      case 'hrv (sdnn)':
        return value.toFixed(1)
      case 'temperature':
        return value.toFixed(1)
      default:
        return value.toString()
    }
  }
  
  return value.toString()
}

// Helper function to get normal ranges and status for vital signs
const getVitalSignStatus = (value: number | null | string, label: string) => {
  if (value === null || value === undefined || value === '') {
    return { status: 'unknown', normal: 'Data not available', statusText: 'No data available' }
  }

  // Handle string temperature values
  if (label.toLowerCase() === 'temperature' && typeof value === 'string') {
    const tempValue = parseFloat(value)
    if (isNaN(tempValue)) {
      return { status: 'unknown', normal: '36.1-37.2°C', statusText: 'Invalid reading' }
    }
    if (tempValue >= 36.1 && tempValue <= 37.2) {
      return { status: 'normal', normal: '36.1-37.2°C', statusText: 'Normal' }
    } else if (tempValue > 37.2) {
      return { status: 'high', normal: '36.1-37.2°C', statusText: 'Fever' }
    } else {
      return { status: 'low', normal: '36.1-37.2°C', statusText: 'Hypothermia' }
    }
  }

  // Handle numeric values
  if (typeof value === 'number') {
    switch (label.toLowerCase()) {
      case 'heart rate':
      case 'pulse rate':
        if (value >= 60 && value <= 100) {
          return { status: 'normal', normal: '60-100 bpm', statusText: 'Normal' }
        } else if (value < 60) {
          return { status: 'low', normal: '60-100 bpm', statusText: 'Bradycardia' }
        } else {
          return { status: 'high', normal: '60-100 bpm', statusText: 'Tachycardia' }
        }
      case 'respiratory rate':
        if (value >= 12 && value <= 20) {
          return { status: 'normal', normal: '12-20 breaths/min', statusText: 'Normal' }
        } else if (value < 12) {
          return { status: 'low', normal: '12-20 breaths/min', statusText: 'Bradypnea' }
        } else if (value <= 24) {
          return { status: 'elevated', normal: '12-20 breaths/min', statusText: 'Slightly Elevated' }
        } else {
          return { status: 'high', normal: '12-20 breaths/min', statusText: 'Tachypnea' }
        }
      case 'spo2':
        if (value >= 95) {
          return { status: 'normal', normal: '≥95%', statusText: 'Normal' }
        } else if (value >= 90) {
          return { status: 'low', normal: '≥95%', statusText: 'Mild Hypoxemia' }
        } else {
          return { status: 'high', normal: '≥95%', statusText: 'Severe Hypoxemia' }
        }
      case 'hrv (sdnn)':
        if (value >= 50) {
          return { status: 'normal', normal: '≥50 ms', statusText: 'Normal' }
        } else if (value >= 30) {
          return { status: 'low', normal: '≥50 ms', statusText: 'Reduced' }
        } else {
          return { status: 'high', normal: '≥50 ms', statusText: 'Significantly Reduced' }
        }
      case 'temperature':
        if (value >= 36.1 && value <= 37.2) {
          return { status: 'normal', normal: '36.1-37.2°C', statusText: 'Normal' }
        } else if (value > 37.2) {
          return { status: 'high', normal: '36.1-37.2°C', statusText: 'Fever' }
        } else {
          return { status: 'low', normal: '36.1-37.2°C', statusText: 'Hypothermia' }
        }
      default:
        return { status: 'unknown', normal: 'Unknown range', statusText: 'Unknown' }
    }
  }

  return { status: 'unknown', normal: 'Unknown range', statusText: 'Unknown' }
}

// Helper functions for status styling
const getStatusBorderColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'border-l-green-500 bg-green-50'
    case 'high':
      return 'border-l-red-500 bg-red-50'
    case 'low':
      return 'border-l-orange-500 bg-orange-50'
    case 'elevated':
      return 'border-l-yellow-500 bg-yellow-50'
    case 'unknown':
    default:
      return 'border-l-gray-400 bg-gray-50'
  }
}

const getStatusIconColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'text-green-600'
    case 'high':
      return 'text-red-600'
    case 'low':
      return 'text-orange-600'
    case 'elevated':
      return 'text-yellow-600'
    case 'unknown':
    default:
      return 'text-gray-600'
  }
}

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'text-green-800'
    case 'high':
      return 'text-red-800'
    case 'low':
      return 'text-orange-800'
    case 'elevated':
      return 'text-yellow-800'
    case 'unknown':
    default:
      return 'text-gray-800'
  }
}

const getStatusBadgeVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case 'normal':
      return 'default'
    case 'high':
      return 'destructive'
    case 'low':
    case 'elevated':
      return 'secondary'
    case 'unknown':
    default:
      return 'outline'
  }
}

const VitalSignCard = ({ icon: Icon, label, data }: any) => {
  // Handle both structured data objects and raw values
  const isStructuredData = data && typeof data === 'object' && 'status' in data
  
  // For raw values, create a properly formatted display
  if (!isStructuredData) {
    const formattedValue = formatVitalSignValue(data, label)
    const unit = getUnitForLabel(label)
    const statusInfo = getVitalSignStatus(data, label)
    
    return (
      <Card className={`border-l-4 ${getStatusBorderColor(statusInfo.status)}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${getStatusIconColor(statusInfo.status)}`} />
              <span className="font-medium text-sm">{label}</span>
            </div>
            {statusInfo.status !== 'unknown' && (
              <Badge variant={getStatusBadgeVariant(statusInfo.status)} className="text-xs">
                {statusInfo.statusText}
              </Badge>
            )}
          </div>
          <div className={`text-2xl font-bold ${getStatusTextColor(statusInfo.status)} mb-1`}>
            {formattedValue} {unit && <span className="text-sm font-normal">{unit}</span>}
          </div>
          <p className="text-xs text-neutral-600">
            Normal: {statusInfo.normal}
          </p>
        </CardContent>
      </Card>
    )
  }
}

// Helper function to make sure all vital signs panels are visible even with null data
const ensureVitalSignsSection = (data: PatientAnalysisData) => {
  if (!data.vital_signs) {
    data.vital_signs = {
      heart_rate_bpm: null,
      respiratory_rate_bpm: null,
      pulse_rate_bpm: null,
      spo2_percent: null,
      hrv_sdnn: null,
      hrv_rmssd: null,
      video_respiratory_rate: null,
      video_analysis_confidence: null
    };
  }
  
  return data;
}

// Helper functions to normalize string/array fields
const normalizeToArray = (value: string | string[] | null | undefined): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') return value.trim() ? [value] : []
  return []
}

export default function SpecialistPatientPage({ params }: { params: Promise<{ patientId: string }> }) {
  const [patientId, setPatientId] = useState<string>('')
  const [patientData, setPatientData] = useState<PatientAnalysisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  // Form state
  const [clinicalNotes, setClinicalNotes] = useState('')
  const [diagnosisCode, setDiagnosisCode] = useState('')
  const [urgencyLevel, setUrgencyLevel] = useState('')
  const [treatmentRecommendations, setTreatmentRecommendations] = useState('')

  useEffect(() => {
    async function getPatientId() {
      const resolvedParams = await params
      setPatientId(resolvedParams.patientId)
    }
    getPatientId()
  }, [params])

  useEffect(() => {
    if (!patientId) return

    async function fetchPatientData() {
      try {
        setLoading(true)
        const response = await fetch(`/api/specialist/patient-analysis/${patientId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch patient data')
        }
        let data = await response.json()
        
        // Ensure vital signs are present even if null
        data = ensureVitalSignsSection(data)
        
        // Process MAI-DxO data to extract insights and recommendations if they're not already structured
        if (data.mai_dxo_results) {
          // Generate clinical findings based on actual patient data
          if (!data.mai_dxo_results.specialist_insights) {
            data.mai_dxo_results.specialist_insights = generateClinicalFindings(data);
          }
          
          // Extract recommendations from final_consensus if key_recommendations is null
          if (!data.mai_dxo_results.key_recommendations && data.mai_dxo_results.final_consensus) {
            const consensus = data.mai_dxo_results.final_consensus;
            data.mai_dxo_results.key_recommendations = [
              ...(consensus.recommendations?.immediate_actions || []),
              ...(consensus.recommendations?.monitoring_recommendations || []),
              "Follow up " + (consensus.recommendations?.follow_up_timeline || "as advised")
            ];
            
            if (consensus.risk_assessment?.risk_factors?.length > 0) {
              data.mai_dxo_results.key_recommendations.push("Address risk factors: " + 
                consensus.risk_assessment.risk_factors.join(", "));
            }
          }
          
          // Generate recommendations if still none available
          if (!data.mai_dxo_results.key_recommendations || data.mai_dxo_results.key_recommendations.length === 0) {
            data.mai_dxo_results.key_recommendations = generateRecommendations(data);
          }
        }
        
        setPatientData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    // Helper function to generate clinical findings based on patient data
    function generateClinicalFindings(patientData: any) {
      const findings = [];
      
      // Check vital signs for abnormalities
      if (patientData.vital_signs?.heart_rate_bpm) {
        const hr = patientData.vital_signs.heart_rate_bpm;
        if (hr > 100) {
          findings.push({
            specialist: "Cardiology AI",
            role: "Cardiovascular Assessment",
            key_finding: "Elevated heart rate above normal range",
            confidence: 92
          });
        } else if (hr < 60) {
          findings.push({
            specialist: "Cardiology AI", 
            role: "Cardiovascular Assessment",
            key_finding: "Bradycardia detected",
            confidence: 88
          });
        }
      }
      
      if (patientData.vital_signs?.respiratory_rate_bpm && patientData.vital_signs.respiratory_rate_bpm > 20) {
        findings.push({
          specialist: "Pulmonology AI",
          role: "Respiratory Assessment", 
          key_finding: "Elevated respiratory rate",
          confidence: 85
        });
      }
      
      if (patientData.vital_signs?.spo2_percent && patientData.vital_signs.spo2_percent < 95) {
        findings.push({
          specialist: "Pulmonology AI",
          role: "Oxygenation Assessment",
          key_finding: "SpO2 below optimal levels",
          confidence: 90
        });
      }
      
      if (patientData.vital_signs?.hrv_sdnn && patientData.vital_signs.hrv_sdnn < 30) {
        findings.push({
          specialist: "Cardiology AI",
          role: "Autonomic Assessment", 
          key_finding: "Reduced heart rate variability indicating potential cardiac stress",
          confidence: 82
        });
      }
      
      // Check symptoms for clinical significance
      if (patientData.clinical_context?.symptoms?.length > 0) {
        const severeSymptomsMap: { [key: string]: { finding: string, confidence: number } } = {
          "Chest pain": { finding: "Chest pain requiring cardiac evaluation", confidence: 89 },
          "Shortness of breath": { finding: "Dyspnea indicating respiratory or cardiac concern", confidence: 86 },
          "Dizziness": { finding: "Dizziness suggesting possible cardiovascular issue", confidence: 78 },
          "Fatigue": { finding: "Fatigue pattern consistent with systemic stress", confidence: 75 },
          "Headache": { finding: "Headache potentially related to cardiovascular strain", confidence: 72 }
        };
        
        patientData.clinical_context.symptoms.forEach((symptom: string) => {
          if (severeSymptomsMap[symptom]) {
            findings.push({
              specialist: "Internal Medicine AI",
              role: "Symptom Analysis",
              key_finding: severeSymptomsMap[symptom].finding,
              confidence: severeSymptomsMap[symptom].confidence
            });
          }
        });
      }
      
      // If no specific findings, add general assessment
      if (findings.length === 0) {
        findings.push({
          specialist: "General Assessment AI",
          role: "Overall Evaluation",
          key_finding: "Clinical assessment completed with no acute abnormalities detected",
          confidence: 95
        });
      }
      
      return findings.slice(0, 3); // Limit to top 3 findings
    }
    
    // Helper function to generate recommendations
    function generateRecommendations(patientData: any) {
      const recommendations = [];
      
      // Generate recommendations based on vital signs and symptoms
      if (patientData.analysis_session?.ai_risk_level === "HIGH") {
        recommendations.push("Immediate specialist consultation recommended");
        recommendations.push("Continuous vital signs monitoring required");
        recommendations.push("Consider emergency intervention if symptoms worsen");
      } else if (patientData.analysis_session?.ai_risk_level === "MEDIUM") {
        recommendations.push("Schedule follow-up within 24-48 hours");
        recommendations.push("Monitor vital signs every 4 hours");
        recommendations.push("Patient education on warning signs");
      } else {
        recommendations.push("Routine follow-up as scheduled");
        recommendations.push("Continue current monitoring protocols");
        recommendations.push("Lifestyle counseling as appropriate");
      }
      
      return recommendations;
    }
    
    // Helper function to extract values from JSON strings
    function extractJsonValue(jsonString: string, key: string, isArray: boolean = false): string | null {
      try {
        // Find the key in the string
        const keyIndex = jsonString.indexOf(`"${key}"`);
        if (keyIndex === -1) return null;
        
        // Find the value after the key
        let valueStart = jsonString.indexOf(':', keyIndex) + 1;
        while (jsonString[valueStart] === ' ') valueStart++; // Skip spaces
        
        if (isArray) {
          // Extract the first item from an array
          if (jsonString[valueStart] === '[') {
            const arrayStart = valueStart + 1;
            let arrayEnd = arrayStart;
            
            // Find the first string in the array
            while (jsonString[arrayEnd] !== '"' && arrayEnd < jsonString.length) arrayEnd++;
            if (arrayEnd >= jsonString.length) return null;
            
            // Extract the string content
            const stringStart = arrayEnd + 1;
            arrayEnd = jsonString.indexOf('"', stringStart);
            if (arrayEnd === -1) return null;
            
            return jsonString.substring(stringStart, arrayEnd);
          }
        } else {
          // Extract a string value
          if (jsonString[valueStart] === '"') {
            const stringStart = valueStart + 1;
            const stringEnd = jsonString.indexOf('"', stringStart);
            if (stringEnd === -1) return null;
            
            return jsonString.substring(stringStart, stringEnd);
          }
        }
        
        return null;
      } catch (e) {
        return null;
      }
    }

    fetchPatientData()
  }, [patientId])

  const handleConsultationSubmit = async () => {
    if (!patientData || !clinicalNotes || !treatmentRecommendations) {
      alert('Please fill in clinical notes and treatment recommendations')
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/specialist/consultation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patient_id: patientId,
          clinical_notes: clinicalNotes,
          icd10_diagnosis_code: diagnosisCode,
          icd10_diagnosis_description: diagnosisCode ? `Diagnosis: ${diagnosisCode}` : '',
          urgency_assessment: urgencyLevel || 'routine',
          treatment_recommendations: treatmentRecommendations,
          additional_tests_required: [],
          follow_up_instructions: treatmentRecommendations,
          requires_emergency_care: urgencyLevel === 'emergency',
          requires_additional_info: false,
          specialist_id: 1 // TODO: Get from session
        })
      })

      if (response.ok) {
        alert('Consultation completed successfully!')
        // Clear form
        setClinicalNotes('')
        setDiagnosisCode('')
        setUrgencyLevel('')
        setTreatmentRecommendations('')
        // Optionally redirect or refresh data
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error || 'Failed to submit consultation'}`)
      }
    } catch (error) {
      console.error('Error submitting consultation:', error)
      alert('Error submitting consultation')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading patient data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Error Loading Patient Data</h2>
          <p className="text-neutral-600">{error}</p>
          <Link href="/specialist/dashboard">
            <EnhancedButton className="mt-4">Back to Dashboard</EnhancedButton>
          </Link>
        </div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <User className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-neutral-700 mb-2">No Patient Data Found</h2>
          <p className="text-neutral-600">Patient {patientId} not found or no analysis available.</p>
          <Link href="/specialist/dashboard">
            <EnhancedButton className="mt-4">Back to Dashboard</EnhancedButton>
          </Link>
        </div>
      </div>
    )
  }

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
              <h1 className="text-xl font-bold text-neutral-900">Patient {patientData.patient_info.patient_id} - Specialist Review</h1>
              <p className="text-sm text-neutral-600">
                Analysis Session • Submitted {new Date(patientData.analysis_session.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Badge variant={patientData.analysis_session.ai_risk_level === "HIGH" ? "destructive" : patientData.analysis_session.ai_risk_level === "MEDIUM" ? "default" : "secondary"} className="text-sm">
            {patientData.analysis_session.ai_risk_level} Risk
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
                  <p className="text-base font-semibold text-neutral-900">{patientData.patient_info.patient_id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Age:</span>
                  <p className="text-base font-semibold text-neutral-900">{patientData.patient_info.age} years</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Gender:</span>
                  <p className="text-base font-semibold text-neutral-900">{patientData.patient_info.gender}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-neutral-600">Phone:</span>
                  <p className="text-base font-semibold text-neutral-900 flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {patientData.patient_info.phone}
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
                <p className="text-base text-neutral-800 font-medium">{patientData.clinical_context.chief_complaint}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block">Current Symptoms:</span>
                <div className="flex flex-wrap gap-2">
                  {patientData.clinical_context.symptoms.map((symptom: string) => (
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
                  {normalizeToArray(patientData.patient_info.known_conditions).length > 0 ? (
                    normalizeToArray(patientData.patient_info.known_conditions).map((item: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-neutral-700 pl-3 border-l-2 border-neutral-200 bg-neutral-50 p-2 rounded"
                      >
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-neutral-500 pl-3 border-l-2 border-neutral-200 bg-neutral-50 p-2 rounded">
                      No known medical conditions
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block flex items-center gap-1">
                  <Pill className="h-4 w-4" />
                  Current Medications:
                </span>
                <ul className="space-y-2">
                  {normalizeToArray(patientData.patient_info.current_medications).length > 0 ? (
                    normalizeToArray(patientData.patient_info.current_medications).map((med: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-neutral-700 pl-3 border-l-2 border-blue-200 bg-blue-50 p-2 rounded"
                      >
                        {med}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-neutral-500 pl-3 border-l-2 border-blue-200 bg-blue-50 p-2 rounded">
                      No current medications
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <span className="text-sm font-medium text-neutral-700 mb-2 block">Allergies:</span>
                <ul className="space-y-2">
                  {normalizeToArray(patientData.patient_info.allergies).length > 0 ? (
                    normalizeToArray(patientData.patient_info.allergies).map((allergy: string, index: number) => (
                      <li
                        key={index}
                        className="text-sm text-red-700 pl-3 border-l-2 border-red-200 bg-red-50 p-2 rounded"
                      >
                        {allergy}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-neutral-500 pl-3 border-l-2 border-red-200 bg-red-50 p-2 rounded">
                      No known allergies
                    </li>
                  )}
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
              <VitalSignCard icon={Heart} label="Heart Rate" data={patientData.vital_signs.heart_rate_bpm} />
              <VitalSignCard icon={Lung} label="Respiratory Rate" data={patientData.vital_signs.respiratory_rate_bpm} />
              <VitalSignCard icon={Droplet} label="SpO2" data={patientData.vital_signs.spo2_percent} />
              <VitalSignCard icon={Activity} label="Pulse Rate" data={patientData.vital_signs.pulse_rate_bpm} />
              <VitalSignCard icon={Activity} label="HRV (SDNN)" data={patientData.vital_signs.hrv_sdnn} />
              <VitalSignCard icon={Thermometer} label="Temperature" data={patientData.clinical_context.temperature} />
            </div>
          </CardContent>
        </Card>

        {/* AI Assessment Panel */}
        <StructuredAIAssessment 
          maiDxoResults={patientData.mai_dxo_results}
          aiRiskLevel={patientData.analysis_session.ai_risk_level}
          consensusLevel={patientData.mai_dxo_results?.consensus_level}
        />

        {/* Medical Data Visualization */}
        <MedicalPlotsPanel patientId={patientId} />

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
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
              />
            </div>

            {/* Diagnosis and Treatment */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="icd-code" className="text-sm font-semibold text-neutral-700">
                  ICD-10 Diagnosis Code
                </Label>
                <Select value={diagnosisCode} onValueChange={setDiagnosisCode}>
                  <SelectTrigger id="icd-code" className="mt-2">
                    <SelectValue placeholder="Search diagnosis codes..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="I20.9">I20.9 - Angina pectoris, unspecified</SelectItem>
                    <SelectItem value="I25.9">I25.9 - Chronic ischemic heart disease</SelectItem>
                    <SelectItem value="R06.0">R06.0 - Dyspnea</SelectItem>
                    <SelectItem value="R50.9">R50.9 - Fever, unspecified</SelectItem>
                    <SelectItem value="Z00.00">Z00.00 - General adult medical examination</SelectItem>
                    <SelectItem value="R53.83">R53.83 - Other fatigue</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="urgency" className="text-sm font-semibold text-neutral-700">
                  Urgency Assessment
                </Label>
                <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
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
                value={treatmentRecommendations}
                onChange={(e) => setTreatmentRecommendations(e.target.value)}
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
                <EnhancedButton 
                  size="lg" 
                  className="w-full" 
                  onClick={handleConsultationSubmit}
                  disabled={submitting || !clinicalNotes || !treatmentRecommendations}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {submitting ? 'Submitting...' : 'Complete Consultation'}
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
