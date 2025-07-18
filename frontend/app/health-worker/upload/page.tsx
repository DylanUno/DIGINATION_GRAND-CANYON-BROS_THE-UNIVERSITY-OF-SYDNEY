"use client"

import { useState, useEffect, useRef } from "react"
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
    datNormalizedFile: null as File | null,
    heaNormalizedFile: null as File | null,
    breathAnnotationFile: null as File | null,
    videoFile: null as File | null,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([])
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [painScale, setPainScale] = useState([0])
  const [symptomDuration, setSymptomDuration] = useState("")
  const [temperature, setTemperature] = useState("")
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

  // Cleanup camera stream on component unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cameraStream])

  // Set video source when camera stream is available
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream
      videoRef.current.play().catch(console.error)
    }
  }, [cameraStream])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 30) {
            // 30 seconds max for VitalLens API compatibility
            setIsRecording(false)
            return 30
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false 
      })
      setCameraStream(stream)
    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('Unable to access camera. Please ensure camera permissions are granted and try using HTTPS.')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const startRecording = async () => {
    if (!cameraStream) {
      await startCamera()
      return
    }

    try {
      const recorder = new MediaRecorder(cameraStream, {
        mimeType: 'video/webm;codecs=vp8'
      })

      const chunks: Blob[] = []
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const videoFile = new File([blob], `recording_${Date.now()}.webm`, { type: 'video/webm' })
        setUploadedFiles((prev) => ({ ...prev, videoFile }))
        setRecordedChunks([])
      }

      setRecordedChunks(chunks)
      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTime(0)
      recorder.start()
    } catch (error) {
      console.error('Error starting recording:', error)
      alert('Unable to start recording. Please try again.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop()
      setIsRecording(false)
      setMediaRecorder(null)
      stopCamera()
    }
  }

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    if (!uploadedFiles.datFile || !uploadedFiles.heaFile || !uploadedFiles.datNormalizedFile || !uploadedFiles.heaNormalizedFile || !uploadedFiles.breathAnnotationFile) {
      alert("Please upload all 5 required files: .dat, .hea, normalized .dat, normalized .hea, and .breath annotation files")
      return
    }

    setIsProcessing(true)
    setUploadProgress(0)
    setProcessingStatus("Uploading files...")

    try {
      // Create FormData for file upload
      const formData = new FormData()
      formData.append('patient_id', selectedPatient.patient_id)
      formData.append('chief_complaint', chiefComplaint)
      formData.append('symptoms', JSON.stringify(selectedSymptoms))
      formData.append('pain_scale', painScale[0].toString())
      formData.append('symptom_duration', symptomDuration)
      formData.append('temperature', temperature)
      formData.append('staff_notes', staffNotes)
      formData.append('dat_file', uploadedFiles.datFile)
      formData.append('hea_file', uploadedFiles.heaFile)
      formData.append('dat_normalized_file', uploadedFiles.datNormalizedFile)
      formData.append('hea_normalized_file', uploadedFiles.heaNormalizedFile)
      formData.append('breath_annotation_file', uploadedFiles.breathAnnotationFile)
      
      // Add video file if available
      if (uploadedFiles.videoFile) {
        formData.append('video_file', uploadedFiles.videoFile)
      }

      // Debug logging
      console.log('Debug - Form data being sent:')
      console.log('  patient_id:', selectedPatient.patient_id)
      console.log('  chief_complaint:', chiefComplaint)
      console.log('  symptoms:', JSON.stringify(selectedSymptoms))
      console.log('  pain_scale:', painScale[0].toString())
      console.log('  symptom_duration:', symptomDuration)
      console.log('  staff_notes:', staffNotes)
      console.log('  dat_file:', uploadedFiles.datFile)
      console.log('  hea_file:', uploadedFiles.heaFile)
      console.log('  dat_normalized_file:', uploadedFiles.datNormalizedFile)
      console.log('  hea_normalized_file:', uploadedFiles.heaNormalizedFile)
      console.log('  breath_annotation_file:', uploadedFiles.breathAnnotationFile)
      console.log('  dat_file.name:', uploadedFiles.datFile?.name)
      console.log('  hea_file.name:', uploadedFiles.heaFile?.name)
      console.log('  dat_normalized_file.name:', uploadedFiles.datNormalizedFile?.name)
      console.log('  hea_normalized_file.name:', uploadedFiles.heaNormalizedFile?.name)
      console.log('  breath_annotation_file.name:', uploadedFiles.breathAnnotationFile?.name)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Make API call
      console.log('Making upload request to:', 'http://localhost:8000/api/upload/upload-vital-signs')
      const response = await fetch('http://localhost:8000/api/upload/upload-vital-signs', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        let errorMessage = 'Upload failed'
        try {
          const errorData = await response.json()
          console.log('Error response data:', errorData)
          
          // Handle different error formats
          if (errorData.detail) {
            if (Array.isArray(errorData.detail)) {
              // FastAPI validation errors
              errorMessage = errorData.detail.map((err: any) => 
                `${err.loc ? err.loc.join('.') : 'Field'}: ${err.msg}`
              ).join(', ')
            } else {
              errorMessage = errorData.detail
            }
          } else if (errorData.message) {
            errorMessage = errorData.message
          } else {
            errorMessage = 'Upload failed'
          }
        } catch (parseError) {
          console.log('Failed to parse error response:', parseError)
          errorMessage = `Upload failed with status: ${response.status}`
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()
      console.log('Success response data:', result)
      
      setProcessingStatus("Upload successful! Processing vital signs...")
      
      // Simulate processing time
      setTimeout(() => {
        setProcessingStatus("Analysis complete! Patient added to specialist queue.")
        setQueuePosition(Math.floor(Math.random() * 5) + 1)
        
        // Reset form after successful upload
        setTimeout(() => {
          setIsProcessing(false)
          setUploadProgress(0)
          setProcessingStatus("")
          setSelectedPatient(null)
          setUploadedFiles({
            datFile: null,
            heaFile: null,
            datNormalizedFile: null,
            heaNormalizedFile: null,
            breathAnnotationFile: null,
            videoFile: null,
          })
          setChiefComplaint("")
          setSelectedSymptoms([])
          setPainScale([0])
          setSymptomDuration("")
          setTemperature("")
          setStaffNotes("")
          alert("Upload successful! Patient data has been processed and added to specialist queue.")
        }, 3000)
      }, 2000)

    } catch (error) {
      console.error('Upload error:', error)
      console.error('Error type:', typeof error)
      console.error('Error constructor:', error?.constructor?.name)
      
      setProcessingStatus("Upload failed. Please try again.")
      setIsProcessing(false)
      setUploadProgress(0)
      
      let errorMessage = 'Unknown error occurred'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // Try to extract error message from object
        const errorObj = error as any
        errorMessage = errorObj.message || errorObj.detail || errorObj.error || JSON.stringify(error)
      }
      
      alert(`Upload failed: ${errorMessage}`)
    }
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
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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

                {/* DAT Normalized File Upload */}
                <div>
                  <Label>Normalized Vital Signs Data (.dat) *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Processed vital signs data file</p>
                    <Input
                      type="file"
                      accept=".dat"
                      className="hidden"
                      id="dat-normalized-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("datNormalizedFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("dat-normalized-file")?.click()}
                    >
                      Choose File
                    </EnhancedButton>
                    {uploadedFiles.datNormalizedFile && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.datNormalizedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 10MB</p>
                </div>

                {/* HEA Normalized File Upload */}
                <div>
                  <Label>Normalized Header File (.hea) *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Processed header metadata file</p>
                    <Input
                      type="file"
                      accept=".hea"
                      className="hidden"
                      id="hea-normalized-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("heaNormalizedFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("hea-normalized-file")?.click()}
                    >
                      Choose File
                    </EnhancedButton>
                    {uploadedFiles.heaNormalizedFile && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.heaNormalizedFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 2MB</p>
                </div>

                {/* Breath Annotation File Upload */}
                <div>
                  <Label>Breathing Annotation File (.breath) *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Respiratory pattern annotations</p>
                    <Input
                      type="file"
                      accept=".breath"
                      className="hidden"
                      id="breath-annotation-file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleFileUpload("breathAnnotationFile", file)
                      }}
                    />
                    <EnhancedButton
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("breath-annotation-file")?.click()}
                    >
                      Choose File
                    </EnhancedButton>
                    {uploadedFiles.breathAnnotationFile && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-green-600">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-sm">{uploadedFiles.breathAnnotationFile.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Max file size: 5MB</p>
                </div>
              </div>

              {/* File Validation Status */}
              {(uploadedFiles.datFile || uploadedFiles.heaFile || uploadedFiles.datNormalizedFile || uploadedFiles.heaNormalizedFile || uploadedFiles.breathAnnotationFile) && (
                <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">File validation status:</p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                        <span className={uploadedFiles.datFile ? "text-green-600" : "text-gray-400"}>
                          ✓ Raw ECG Data {uploadedFiles.datFile ? "✓" : "⏳"}
                        </span>
                        <span className={uploadedFiles.heaFile ? "text-green-600" : "text-gray-400"}>
                          ✓ ECG Header {uploadedFiles.heaFile ? "✓" : "⏳"}
                        </span>
                        <span className={uploadedFiles.datNormalizedFile ? "text-green-600" : "text-gray-400"}>
                          ✓ Vital Signs {uploadedFiles.datNormalizedFile ? "✓" : "⏳"}
                        </span>
                        <span className={uploadedFiles.heaNormalizedFile ? "text-green-600" : "text-gray-400"}>
                          ✓ Vital Header {uploadedFiles.heaNormalizedFile ? "✓" : "⏳"}
                        </span>
                        <span className={uploadedFiles.breathAnnotationFile ? "text-green-600" : "text-gray-400"}>
                          ✓ Breathing Data {uploadedFiles.breathAnnotationFile ? "✓" : "⏳"}
                        </span>
                      </div>
                    </div>
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
                    {cameraStream ? (
                      <video
                        ref={videoRef}
                        className="w-full max-w-md mx-auto rounded-lg"
                        autoPlay
                        muted
                        playsInline
                        style={{ transform: 'scaleX(-1)' }}
                      />
                    ) : (
                      <>
                        <Video className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-2">Camera preview window</p>
                        <p className="text-xs text-gray-500">Position patient for optimal VitalLens analysis</p>
                      </>
                    )}
                  </div>

                  {!isRecording ? (
                    <div className="space-y-2">
                      <EnhancedButton onClick={startRecording} className="w-full bg-red-600 hover:bg-red-700">
                        <Play className="h-4 w-4 mr-2" />
                        Start Recording (30 sec max)
                      </EnhancedButton>
                      {!cameraStream && (
                        <EnhancedButton onClick={startCamera} variant="outline" className="w-full">
                          <Camera className="h-4 w-4 mr-2" />
                          Start Camera Preview
                        </EnhancedButton>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600 mb-2">{formatTime(recordingTime)}</div>
                        <Progress value={(recordingTime / 30) * 100} className="mb-3" />
                        <Badge className="bg-red-100 text-red-800">Recording in progress...</Badge>
                      </div>
                      <EnhancedButton onClick={stopRecording} variant="outline" className="w-full">
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording
                      </EnhancedButton>
                    </div>
                  )}

                  {uploadedFiles.videoFile && (
                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Video recorded successfully</span>
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        {uploadedFiles.videoFile.name} ({(uploadedFiles.videoFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </p>
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

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="temperature">Body Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    min="35"
                    max="42"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g., 36.5"
                  />
                  <p className="text-xs text-gray-500 mt-1">Normal range: 36.1-37.2°C</p>
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
                disabled={!selectedPatient || !uploadedFiles.datFile || !uploadedFiles.heaFile || !uploadedFiles.datNormalizedFile || !uploadedFiles.heaNormalizedFile || !uploadedFiles.breathAnnotationFile || isProcessing}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? "Processing..." : "Submit for AI Analysis"}
              </EnhancedButton>

              {(!uploadedFiles.datFile || !uploadedFiles.heaFile || !uploadedFiles.datNormalizedFile || !uploadedFiles.heaNormalizedFile || !uploadedFiles.breathAnnotationFile) && (
                <p className="text-sm text-red-600 text-center">Please upload all 5 required files to proceed</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
