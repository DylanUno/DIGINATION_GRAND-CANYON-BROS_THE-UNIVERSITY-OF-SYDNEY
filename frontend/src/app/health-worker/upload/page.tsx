"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, Upload, FileCheck, Video, CheckCircle2, User, Clock, Wifi, WifiOff, AlertCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Mock patient data for search
const mockPatients = [
  { id: "P001", name: "John Doe", phone: "+1 (555) 123-4567", age: 45, lastVisit: "2024-12-10" },
  { id: "P002", name: "Mary Smith", phone: "+1 (555) 234-5678", age: 62, lastVisit: "2024-12-08" },
  { id: "P003", name: "Robert Johnson", phone: "+1 (555) 345-6789", age: 33, lastVisit: "2024-12-05" },
]

const chiefComplaints = [
  "Chest pain",
  "Shortness of breath",
  "Fatigue",
  "Dizziness",
  "Palpitations",
  "Headache",
  "Nausea",
  "Other",
]

const symptoms = [
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

export default function UploadDataPage() {
  const searchParams = useSearchParams()
  const preselectedPatientId = searchParams.get("patient")

  const [selectedPatient, setSelectedPatient] = useState(
    preselectedPatientId ? mockPatients.find((p) => p.id === preselectedPatientId) || null : null,
  )
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressureSystolic: "",
    bloodPressureDiastolic: "",
    heartRate: "",
    temperature: "",
    spO2: "",
    respiratoryRate: "",
    weight: "",
  })
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState({
    ecgData: null as File | null,
    ecgHeader: null as File | null,
    video: null as File | null,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [painScale, setPainScale] = useState([0])
  const [symptomDuration, setSymptomDuration] = useState("")
  const [staffNotes, setStaffNotes] = useState("")
  const [isOffline, setIsOffline] = useState(false)
  const [queuePosition, setQueuePosition] = useState(3)
  const [processingStatus, setProcessingStatus] = useState("Analyzing vitals... Est. time: 3 minutes")
  const [dataQuality, setDataQuality] = useState({ ecg: 95, video: 88, overall: 92 })

  const handleVitalSignChange = (field: string, value: string) => {
    setVitalSigns((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (type: "ecgData" | "ecgHeader" | "video", file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }))
    // Simulate data quality check
    if (type === "ecgData") {
      setDataQuality((prev) => ({ ...prev, ecg: Math.floor(Math.random() * 20) + 80 }))
    }
  }

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const startRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    const timer = setInterval(() => {
      setRecordingTime((prev) => {
        if (prev >= 120) {
          // 2 minutes
          setIsRecording(false)
          clearInterval(timer)
          return 120
        }
        return prev + 1
      })
    }, 1000)
  }

  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          alert("Data uploaded successfully and queued for AI analysis!")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Data Upload & Processing</h1>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Offline Mode
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          )}
        </div>
      </div>

      {/* Patient Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Context
          </CardTitle>
          <CardDescription>Select patient, verify identity, and review medical history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search by name, phone, or patient ID..." className="pl-8" />
            </div>
            <div className="grid gap-2">
              {mockPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-600">
                        {patient.id} • Age: {patient.age} • Last visit: {patient.lastVisit}
                      </p>
                    </div>
                    {selectedPatient?.id === patient.id && <CheckCircle2 className="h-5 w-5 text-primary" />}
                  </div>
                </div>
              ))}
            </div>

            {selectedPatient && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2">Medical History Summary</h4>
                <p className="text-sm text-gray-600">
                  Previous conditions: Hypertension, Type 2 Diabetes
                  <br />
                  Current medications: Lisinopril 10mg, Metformin 500mg
                  <br />
                  Allergies: Penicillin
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* Data Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle>Data Upload Section</CardTitle>
              <CardDescription>Upload vital sign files with real-time validation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Data Validation Alerts */}
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={`p-3 rounded-lg border ${dataQuality.ecg >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.ecg >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-sm font-medium">ECG Quality: {dataQuality.ecg}%</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${dataQuality.video >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.video >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-sm font-medium">Video Quality: {dataQuality.video}%</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${dataQuality.overall >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.overall >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-sm font-medium">Overall: {dataQuality.overall}%</span>
                  </div>
                </div>
              </div>

              {/* File Upload Areas */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>ECG Data File (.dat)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag & drop your .dat file here, or click to browse</p>
                    <Input
                      type="file"
                      accept=".dat"
                      className="hidden"
                      id="ecg-data"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("ecgData", file)
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("ecg-data")?.click()}>
                      Choose File
                    </Button>
                    {uploadedFiles.ecgData && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-brand-medical-green">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.ecgData.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Max file size: 50MB</p>
                </div>

                <div className="space-y-2">
                  <Label>ECG Header File (.hea)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Drag & drop your .hea file here, or click to browse</p>
                    <Input
                      type="file"
                      accept=".hea"
                      className="hidden"
                      id="ecg-header"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("ecgHeader", file)
                      }}
                    />
                    <Button variant="outline" size="sm" onClick={() => document.getElementById("ecg-header")?.click()}>
                      Choose File
                    </Button>
                    {uploadedFiles.ecgHeader && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-brand-medical-green">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.ecgHeader.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Max file size: 5MB</p>
                </div>
              </div>

              <Separator />

              {/* Video Recording/Upload */}
              <div className="space-y-4">
                <Label>Live Video Recording or Upload</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Record live video (2-minute timer)</p>
                    {!isRecording ? (
                      <Button onClick={startRecording} className="mb-2">
                        Start Recording
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-lg font-bold text-red-500">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                        </div>
                        <Progress value={(recordingTime / 120) * 100} className="w-full" />
                        <Button variant="destructive" onClick={() => setIsRecording(false)}>
                          Stop Recording
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 mb-4">Or upload video file</p>
                    <Input
                      type="file"
                      accept=".mp4,.mov,.avi"
                      className="hidden"
                      id="video-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("video", file)
                      }}
                    />
                    <Button variant="outline" onClick={() => document.getElementById("video-upload")?.click()}>
                      Choose Video File
                    </Button>
                    {uploadedFiles.video && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-brand-medical-green">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.video.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms & Context Section */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms & Context Section</CardTitle>
              <CardDescription>Detailed symptom assessment and clinical context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="chief-complaint">Chief Complaint</Label>
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
                  <Label htmlFor="symptom-duration">Symptom Duration</Label>
                  <Input
                    id="symptom-duration"
                    placeholder="e.g., 3 days, 2 weeks"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label>Symptoms Checklist</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {symptoms.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Pain Scale (1-10)</Label>
                <div className="mt-2 space-y-2">
                  <Slider value={painScale} onValueChange={setPainScale} max={10} min={0} step={1} className="w-full" />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>No pain (0)</span>
                    <span className="font-medium">Current: {painScale[0]}</span>
                    <span>Severe pain (10)</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="staff-notes">Staff Notes</Label>
                <Textarea
                  id="staff-notes"
                  placeholder="Additional observations, patient behavior, environmental factors..."
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Processing & Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Processing & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Real-Time Status */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  Real-Time Status
                </h4>
                <p className="text-sm text-gray-700">{processingStatus}</p>
              </div>

              {/* Queue Visibility */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium mb-2">Queue Visibility</h4>
                <p className="text-sm text-gray-700">
                  Your patient is #{queuePosition} in the specialist review queue.
                </p>
              </div>

              {/* Offline Mode Support */}
              {isOffline && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    Offline Mode Active
                  </h4>
                  <p className="text-sm text-gray-700">
                    Data collection continues offline. Will sync automatically when connection is restored.
                  </p>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uploading and processing...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <Button
                onClick={handleSubmit}
                disabled={isUploading || !selectedPatient}
                className="w-full bg-brand-medical-green hover:bg-brand-medical-green/90"
                size="lg"
              >
                {isUploading ? "Processing..." : "Submit for AI Analysis"}
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 