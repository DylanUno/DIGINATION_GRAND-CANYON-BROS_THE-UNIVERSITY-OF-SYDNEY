"use client"

import { useState } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Search, Upload, FileCheck, Video, CheckCircle2, User, Clock, Wifi, WifiOff, AlertCircle, Activity } from "lucide-react"
import { useSearchParams } from "next/navigation"

// Mock patient data for search - Indonesian context
const mockPatients = [
  { id: "P001", name: "Ahmad Wijaya", phone: "+62 812 3456 7890", age: 38, lastVisit: "2025-01-02" },
  { id: "P002", name: "Siti Nurhaliza", phone: "+62 813 4567 8901", age: 29, lastVisit: "2024-12-30" },
  { id: "P003", name: "Budi Santoso", phone: "+62 814 5678 9012", age: 45, lastVisit: "2024-12-28" },
  { id: "P004", name: "Dewi Sartika", phone: "+62 815 6789 0123", age: 52, lastVisit: "2024-12-25" },
]

const chiefComplaints = [
  "Nyeri dada",
  "Sesak napas",
  "Kelelahan",
  "Pusing",
  "Jantung berdebar",
  "Sakit kepala",
  "Mual",
  "Demam",
  "Nyeri perut",
  "Lainnya",
]

const symptoms = [
  "Nyeri dada",
  "Sesak napas",
  "Kelelahan",
  "Pusing",
  "Jantung berdebar",
  "Sakit kepala",
  "Mual",
  "Berkeringat",
  "Lemas",
  "Detak jantung tidak teratur",
  "Bengkak",
  "Batuk",
  "Demam",
  "Nyeri sendi",
  "Gangguan tidur",
  "Kehilangan nafsu makan",
  "Nyeri punggung",
  "Konstipasi",
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
  const [processingStatus, setProcessingStatus] = useState("Menganalisis tanda vital... Perkiraan waktu: 3 menit")
  const [dataQuality, setDataQuality] = useState({ ecg: 95, video: 88, overall: 92 })

  const handleVitalSignChange = (field: string, value: string) => {
    setVitalSigns((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (type: "ecgData" | "ecgHeader" | "video", file: File) => {
    setUploadedFiles((prev) => ({ ...prev, [type]: file }))
    // Simulate data quality check
    if (type === "ecgData") {
      setDataQuality((prev) => ({ ...prev, ecg: Math.floor(Math.random() * 20) + 80 }))
    } else if (type === "video") {
      setDataQuality((prev) => ({ ...prev, video: Math.floor(Math.random() * 20) + 80 }))
    }
    // Update overall quality
    setTimeout(() => {
      setDataQuality((prev) => ({ 
        ...prev, 
        overall: Math.floor((prev.ecg + prev.video) / 2) 
      }))
    }, 500)
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
      alert("Silakan pilih pasien terlebih dahulu")
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
          alert("Data berhasil diunggah dan masuk antrian analisis AI!")
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-bold text-neutral-900">Upload & Pemrosesan Data</h1>
          <p className="text-body-lg text-neutral-600 mt-2">Unggah data medis untuk analisis AI comprehensive</p>
        </div>
        <div className="flex items-center gap-2">
          {isOffline ? (
            <Badge className="bg-critical-red text-white flex items-center gap-1">
              <WifiOff className="h-3 w-3" />
              Mode Offline
            </Badge>
          ) : (
            <Badge variant="outline" className="border-health-teal text-health-teal flex items-center gap-1">
              <Wifi className="h-3 w-3" />
              Online
            </Badge>
          )}
        </div>
      </div>

      {/* Patient Context */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <User className="h-5 w-5 text-health-teal" />
            Konteks Pasien
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Pilih pasien, verifikasi identitas, dan tinjau riwayat medis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-3 h-4 w-4 text-neutral-500" />
              <Input 
                type="search" 
                placeholder="Cari berdasarkan nama, telepon, atau ID pasien..." 
                className="pl-8 h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue" 
              />
            </div>
            <div className="grid gap-2">
              {mockPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedPatient?.id === patient.id
                      ? "border-trust-blue bg-trust-blue/5"
                      : "border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-body font-semibold text-neutral-900">{patient.name}</p>
                      <p className="text-body-sm text-neutral-600">
                        {patient.id} • Usia: {patient.age} • Kunjungan terakhir: {patient.lastVisit}
                      </p>
                      <p className="text-body-sm text-neutral-500">{patient.phone}</p>
                    </div>
                    {selectedPatient?.id === patient.id && <CheckCircle2 className="h-5 w-5 text-trust-blue" />}
                  </div>
                </div>
              ))}
            </div>

            {selectedPatient && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-body font-semibold text-neutral-900 mb-2">Ringkasan Riwayat Medis</h4>
                <p className="text-body-sm text-neutral-700">
                  Kondisi sebelumnya: Hipertensi, Diabetes Tipe 2
                  <br />
                  Obat saat ini: Lisinopril 10mg, Metformin 500mg
                  <br />
                  Alergi: Penisilin, Udang
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedPatient && (
        <>
          {/* Data Upload Section */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900">Bagian Upload Data</CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Unggah file tanda vital dengan validasi real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Data Validation Alerts */}
              <div className="grid gap-4 md:grid-cols-3">
                <div
                  className={`p-3 rounded-lg border ${dataQuality.ecg >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.ecg >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-body-sm font-medium text-neutral-900">Kualitas EKG: {dataQuality.ecg}%</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${dataQuality.video >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.video >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-body-sm font-medium text-neutral-900">Kualitas Video: {dataQuality.video}%</span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-lg border ${dataQuality.overall >= 90 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${dataQuality.overall >= 90 ? "bg-green-500" : "bg-yellow-500"}`}
                    ></div>
                    <span className="text-body-sm font-medium text-neutral-900">Keseluruhan: {dataQuality.overall}%</span>
                  </div>
                </div>
              </div>

              {/* File Upload Areas */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-body font-medium text-neutral-900">File Data EKG (.dat)</Label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-body-sm text-neutral-600 mb-2">Seret & letakkan file .dat di sini, atau klik untuk menjelajahi</p>
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
                    <EnhancedButton variant="outline" size="sm" onClick={() => document.getElementById("ecg-data")?.click()}>
                      Pilih File
                    </EnhancedButton>
                    {uploadedFiles.ecgData && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-health-teal">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-body-sm">{uploadedFiles.ecgData.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-body-sm text-neutral-500">Ukuran maksimal file: 50MB</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-body font-medium text-neutral-900">File Header EKG (.hea)</Label>
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-neutral-400 transition-colors">
                    <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-2" />
                    <p className="text-body-sm text-neutral-600 mb-2">Seret & letakkan file .hea di sini, atau klik untuk menjelajahi</p>
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
                    <EnhancedButton variant="outline" size="sm" onClick={() => document.getElementById("ecg-header")?.click()}>
                      Pilih File
                    </EnhancedButton>
                    {uploadedFiles.ecgHeader && (
                      <div className="mt-2 flex items-center justify-center gap-2 text-health-teal">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-body-sm">{uploadedFiles.ecgHeader.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-body-sm text-neutral-500">Ukuran maksimal file: 5MB</p>
                </div>
              </div>

              <Separator />

              {/* Video Recording/Upload */}
              <div className="space-y-4">
                <Label className="text-body font-medium text-neutral-900">Perekaman Video Langsung atau Upload</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <Video className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-body-sm text-neutral-600 mb-4">Rekam video langsung (timer 2 menit)</p>
                    {!isRecording ? (
                      <EnhancedButton onClick={startRecording} className="mb-2 bg-trust-blue hover:bg-blue-600">
                        <Video className="h-4 w-4 mr-2" />
                        Mulai Rekam
                      </EnhancedButton>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-h3 font-bold text-critical-red">
                          {Math.floor(recordingTime / 60)}:{(recordingTime % 60).toString().padStart(2, "0")}
                        </div>
                        <Progress value={(recordingTime / 120) * 100} className="w-full" />
                        <EnhancedButton variant="outline" onClick={() => setIsRecording(false)} className="border-critical-red text-critical-red">
                          Hentikan Rekam
                        </EnhancedButton>
                      </div>
                    )}
                  </div>

                  <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                    <Video className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-body-sm text-neutral-600 mb-4">Atau unggah file video</p>
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
                    <EnhancedButton variant="outline" onClick={() => document.getElementById("video-upload")?.click()}>
                      Pilih File Video
                    </EnhancedButton>
                    {uploadedFiles.video && (
                      <div className="mt-4 flex items-center justify-center gap-2 text-health-teal">
                        <FileCheck className="h-4 w-4" />
                        <span className="text-body-sm">{uploadedFiles.video.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Symptoms & Context Section */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900">Bagian Gejala & Konteks</CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Penilaian gejala detail dan konteks klinis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="chief-complaint" className="text-body font-medium text-neutral-900">Keluhan Utama</Label>
                  <Select value={chiefComplaint} onValueChange={setChiefComplaint}>
                    <SelectTrigger className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue">
                      <SelectValue placeholder="Pilih keluhan utama" />
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
                  <Label htmlFor="symptom-duration" className="text-body font-medium text-neutral-900">Durasi Gejala</Label>
                  <Input
                    id="symptom-duration"
                    placeholder="contoh: 3 hari, 2 minggu"
                    value={symptomDuration}
                    onChange={(e) => setSymptomDuration(e.target.value)}
                    className="h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                  />
                </div>
              </div>

              <div>
                <Label className="text-body font-medium text-neutral-900">Daftar Periksa Gejala</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  {symptoms.map((symptom) => (
                    <label key={symptom} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(symptom)}
                        onChange={() => handleSymptomToggle(symptom)}
                        className="rounded border-neutral-300 text-trust-blue focus:ring-trust-blue"
                      />
                      <span className="text-body-sm text-neutral-700">{symptom}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-body font-medium text-neutral-900">Skala Nyeri (0-10)</Label>
                <div className="mt-4 space-y-3">
                  <Slider 
                    value={painScale} 
                    onValueChange={setPainScale} 
                    max={10} 
                    min={0} 
                    step={1} 
                    className="w-full" 
                  />
                  <div className="flex justify-between text-body-sm text-neutral-500">
                    <span>Tidak nyeri (0)</span>
                    <span className="font-medium text-neutral-900">Saat ini: {painScale[0]}</span>
                    <span>Nyeri berat (10)</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="staff-notes" className="text-body font-medium text-neutral-900">Catatan Petugas</Label>
                <Textarea
                  id="staff-notes"
                  placeholder="Observasi tambahan, perilaku pasien, faktor lingkungan..."
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  className="min-h-[100px] mt-2 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                />
              </div>
            </CardContent>
          </Card>

          {/* Processing & Monitoring */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-health-teal" />
                Pemrosesan & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Real-Time Status */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-body font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                  <div className="w-3 h-3 bg-trust-blue rounded-full animate-pulse"></div>
                  Status Real-Time
                </h4>
                <p className="text-body-sm text-neutral-700">{processingStatus}</p>
              </div>

              {/* Queue Visibility */}
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="text-body font-semibold text-neutral-900 mb-2">Visibilitas Antrian</h4>
                <p className="text-body-sm text-neutral-700">
                  Pasien Anda adalah #{queuePosition} dalam antrian review spesialis.
                </p>
              </div>

              {/* Offline Mode Support */}
              {isOffline && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="text-body font-semibold text-neutral-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-alert-orange" />
                    Mode Offline Aktif
                  </h4>
                  <p className="text-body-sm text-neutral-700">
                    Pengumpulan data berlanjut offline. Akan sinkronisasi otomatis saat koneksi pulih.
                  </p>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-body-sm text-neutral-700">
                    <span>Mengunggah dan memproses...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              <EnhancedButton
                onClick={handleSubmit}
                disabled={isUploading || !selectedPatient}
                className="w-full bg-health-teal hover:bg-teal-600"
                size="full"
              >
                <Activity className="h-4 w-4 mr-2" />
                {isUploading ? "Memproses..." : "Kirim untuk Analisis AI"}
              </EnhancedButton>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 