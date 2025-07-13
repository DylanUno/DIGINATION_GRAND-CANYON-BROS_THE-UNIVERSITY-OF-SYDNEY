"use client"

import { useState, useEffect } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  User,
  Upload,
  Video,
  FileCheck,
  Camera,
  Play,
  Square,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Thermometer,
} from "lucide-react"
import { getCurrentUserId } from "@/lib/client-auth"
interface Patient {
  patient_id: string
  full_name: string
  date_of_birth: string
  phone_number: string
  age: number
  conditions: string[]
  medications: string[]
  allergies: string[]
}

async function fetchPatients(): Promise<Patient[]> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return []
    }
    
    const response = await fetch('/api/health-worker/patients', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch patients')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

const chiefComplaints = [
  "Chest pain",
  "Shortness of breath",
  "Dizziness",
  "Fatigue",
  "Palpitations",
  "Headache",
  "Nausea",
  "Irregular heartbeat",
  "Other",
]

const commonSymptoms = [
  "Chest pain",
  "Shortness of breath",
  "Fatigue",
  "Dizziness",
  "Palpitations",
  "Headache",
  "Nausea",
  "Sweating",
  "Weakness",
  "Irregular heartbeat",
  "Swelling",
  "Cough",
  "Fever",
  "Joint pain",
  "Sleep problems",
]

export default function DataUploadPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState({
    datFile: null as File | null,
    heaFile: null as File | null,
    videoFile: null as File | null,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [painScale, setPainScale] = useState([0])
  const [symptomDuration, setSymptomDuration] = useState("")
  const [staffNotes, setStaffNotes] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const [queuePosition, setQueuePosition] = useState(3)

  const filteredPatients = patients.filter(
    (patient: Patient) =>
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone_number.includes(searchTerm),
  )

  useEffect(() => {
    async function loadPatients() {
      setLoading(true)
      const patientsData = await fetchPatients()
      setPatients(patientsData)
      setLoading(false)
    }
    loadPatients()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 120) {
            // 2 minutes max
            setIsRecording(false)
            return 120
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleFileUpload = (type: keyof typeof uploadedFiles, file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }))
  }

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)
    setProcessingStatus("Uploading files...")

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setProcessingStatus("Analyzing vital signs... Estimated time: 3 minutes")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Data Upload & Processing</h1>
        <p className="text-gray-600">Upload patient vital signs and video data for AI analysis</p>
      </div>

      {/* Patient Selection */}
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Patient Selection
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by name, phone, or patient ID..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">Loading patients...</div>
            ) : filteredPatients.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No patients found</div>
            ) : (
              filteredPatients.map((patient: Patient) => (
                <div
                  key={patient.patient_id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.patient_id === patient.patient_id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{patient.full_name}</p>
                      <p className="text-sm text-gray-600">
                        {patient.patient_id} • Age: {patient.age} • {patient.phone_number}
                      </p>
                    </div>
                    {selectedPatient?.patient_id === patient.patient_id && <CheckCircle className="h-5 w-5 text-blue-600" />}
                  </div>
                </div>
              ))
            )}
          </div>

          {selectedPatient && (
            <Alert className="border-l-4 border-l-green-500 bg-green-50">
              <Heart className="h-4 w-4" />
              <AlertDescription>
                <div>
                  <p className="font-medium text-sm mb-2">Medical History Summary</p>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p>
                      <strong>Conditions:</strong> {selectedPatient.conditions.join(", ")}
                    </p>
                    <p>
                      <strong>Medications:</strong> {selectedPatient.medications.join(", ")}
                    </p>
                    <p>
                      <strong>Allergies:</strong> {selectedPatient.allergies.join(", ")}
                    </p>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* Vital Signs Upload */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600" />
                Vital Signs Upload
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                {/* DAT File Upload */}
                <div>
                  <Label>ECG Data File (.dat) *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag & drop your .dat file here</p>
                    <Input
                      type="file"
                      accept=".dat"
                      className="hidden"
                      id="dat-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("datFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("dat-file")?.click()}
                    >
                      Choose File
                    </EnhancedButton>
                    {uploadedFiles.datFile && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.datFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 50MB</p>
                </div>

                {/* HEA File Upload */}
                <div>
                  <Label>ECG Header File (.hea) *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag & drop your .hea file here</p>
                    <Input
                      type="file"
                      accept=".hea"
                      className="hidden"
                      id="hea-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("heaFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("hea-file")?.click()}
                    >
                      Choose File
                    </EnhancedButton>
                    {uploadedFiles.heaFile && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.heaFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                </div>
              </div>

              {/* File Validation Status */}
              {(uploadedFiles.datFile || uploadedFiles.heaFile) && (
                <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <p className="text-sm">File validation in progress... Quality check passed ✓</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Video Recording Options */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-600" />
                Video Recording Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Live Recording */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Option 1 - Live Recording
                  </h4>

                  <div className="bg-gray-100 rounded-lg p-6 text-center mb-4">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Camera preview window</p>
                    <p className="text-xs text-gray-500">Position patient for optimal VitalLens analysis</p>
                  </div>

                  {!isRecording ? (
                    <EnhancedButton onClick={() => setIsRecording(true)} className="w-full bg-red-600 hover:bg-red-700">
                      <Play className="h-4 w-4 mr-2" />
                      Start Recording (2 min max)
                    </EnhancedButton>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">{formatTime(recordingTime)}</div>
                        <Progress value={(recordingTime / 120) * 100} className="mb-3" />
                        <Badge className="bg-red-100 text-red-800">Recording in progress...</Badge>
                      </div>
                      <EnhancedButton onClick={() => setIsRecording(false)} variant="outline" className="w-full">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </EnhancedButton>
                    </div>
                  )}
                </div>

                {/* File Upload */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Option 2 - File Upload
                  </h4>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                    <Video className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload video file</p>
                    <Input
                      type="file"
                      accept=".mp4,.mov,.avi"
                      className="hidden"
                      id="video-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("videoFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("video-file")?.click()}
                    >
                      Choose Video File
                    </EnhancedButton>
                  </div>

                  {uploadedFiles.videoFile && (
                    <Alert className="border-l-4 border-l-green-500 bg-green-50">
                      <FileCheck className="h-4 w-4" />
                      <AlertDescription>
                        <p className="text-sm">✓ Video uploaded: {uploadedFiles.videoFile.name}</p>
                        <p className="text-xs text-gray-600">Quality check passed</p>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms & Context */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-orange-600" />
                Symptoms & Context
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="chief-complaint">Chief Complaint *</Label>
                  <Select value={chiefComplaint} onValueChange={setChiefComplaint}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary complaint" />
                    </SelectTrigger>
                    <SelectContent>
                      {chiefComplaints.map((complaint) => (
                        <SelectItem key={complaint} value={complaint}>
                          {complaint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration of Symptoms</Label>
                  <Input
                    id="duration"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    placeholder="e.g., 3 days, 2 weeks, 1 hour"
                  />
                </div>
              </div>

              <div>
                <Label>Additional Symptoms (Check all that apply)</Label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                  {commonSymptoms.map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={selectedSymptoms.includes(symptom)}
                        onCheckedChange={() => handleSymptomToggle(symptom)}
                      />
                      <Label htmlFor={symptom} className="text-sm">
                        {symptom}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Pain Scale (0-10)</Label>
                <div className="mt-3 space-y-3">
                  <Slider value={painScale} onValueChange={setPainScale} max={10} min={0} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>No pain (0)</span>
                    <Badge variant="outline" className="font-medium">
                      Current: {painScale[0]}
                    </Badge>
                    <span>Severe pain (10)</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="staff-notes">Staff Observations</Label>
                <Textarea
                  id="staff-notes"
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  placeholder="Additional observations, patient behavior, environmental factors, positioning guidance followed..."
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Processing Status */}
          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                Processing Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isProcessing && (
                <>
                  <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
                    <Activity className="h-4 w-4 animate-pulse" />
                    <AlertDescription>
                      <p className="font-medium text-sm">{processingStatus}</p>
                      <Progress value={uploadProgress} className="mt-2" />
                    </AlertDescription>
                  </Alert>

                  <Alert className="border-l-4 border-l-yellow-500 bg-yellow-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <p className="text-sm">Your patient is #{queuePosition} in specialist review queue</p>
                    </AlertDescription>
                  </Alert>
                </>
              )}

              <EnhancedButton
                onClick={handleSubmit}
                disabled={!selectedPatient || !uploadedFiles.datFile || !uploadedFiles.heaFile || isProcessing}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? "Processing..." : "Submit for AI Analysis"}
              </EnhancedButton>

              {(!uploadedFiles.datFile || !uploadedFiles.heaFile) && (
                <p className="text-sm text-red-600 text-center">Please upload both .dat and .hea files to proceed</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
