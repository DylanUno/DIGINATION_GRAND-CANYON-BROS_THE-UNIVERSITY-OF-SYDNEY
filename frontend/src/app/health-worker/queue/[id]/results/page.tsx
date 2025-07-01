import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { ArrowLeft, Download, Share, AlertTriangle, CheckCircle, Heart, Activity, ArrowRight, FileCheck, User, Upload } from "lucide-react"
import Link from "next/link"

// Mock analysis results data - Indonesian context
const analysisResults = {
  id: "A001",
  patientName: "Ahmad Wijaya",
  patientId: "P001",
  analysisDate: "2025-01-02",
  analysisTime: "14:30",
  overallRisk: "Medium",
  confidence: 87,
  vitalSigns: {
    heartRate: { value: 78, unit: "bpm", status: "normal", range: "60-100" },
    bloodPressure: { systolic: 145, diastolic: 92, unit: "mmHg", status: "elevated", range: "120/80" },
    respiratoryRate: { value: 18, unit: "napas/menit", status: "normal", range: "12-20" },
    spO2: { value: 97, unit: "%", status: "normal", range: "95-100" },
    temperature: { value: 36.8, unit: "°C", status: "normal", range: "36.1-37.2" },
  },
  aiFindings: [
    {
      category: "Kardiovaskular",
      finding: "Tekanan darah tinggi terdeteksi",
      severity: "Moderate",
      confidence: 92,
    },
    {
      category: "Ritme Jantung",
      finding: "Kontraksi ventrikel prematur sesekali (PVC)",
      severity: "Mild",
      confidence: 78,
    },
    {
      category: "Pernapasan",
      finding: "Pola pernapasan normal teramati",
      severity: "Normal",
      confidence: 95,
    },
    {
      category: "Metabolik",
      finding: "Indikasi kontrol gula darah yang membaik",
      severity: "Normal",
      confidence: 89,
    },
  ],
  recommendations: [
    "Pantau tekanan darah secara teratur",
    "Pertimbangkan modifikasi gaya hidup (diet, olahraga)",
    "Janji temu lanjutan dalam 2 minggu",
    "Lanjutkan pengobatan diabetes saat ini",
    "Kurangi asupan garam dalam makanan",
  ],
  specialistNotes:
    "Pasien menunjukkan tanda-tanda hipertensi progresif. Rekomendasikan konsultasi kardiologi jika tekanan darah tetap tinggi. Perlu evaluasi faktor risiko tambahan.",
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-health-teal"
    case "elevated":
    case "high":
      return "text-critical-red"
    case "low":
      return "text-trust-blue"
    default:
      return "text-neutral-500"
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "Normal":
      return <StatusIndicator status="completed" label="Normal" showIcon={false} />
    case "Mild":
      return <StatusIndicator status="warning" label="Ringan" showIcon={false} />
    case "Moderate":
      return <StatusIndicator status="processing" label="Sedang" showIcon={false} />
    case "Severe":
      return <StatusIndicator status="urgent" label="Parah" showIcon={false} />
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "border-critical-red bg-red-50"
    case "Medium":
      return "border-alert-orange bg-orange-50"
    case "Low":
      return "border-health-teal bg-green-50"
    default:
      return "border-neutral-300 bg-neutral-50"
  }
}

export default function AnalysisResultsPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <EnhancedButton asChild variant="outline" size="sm">
          <Link href="/health-worker/queue">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </EnhancedButton>
        <div className="flex-1">
          <h1 className="text-display font-bold text-neutral-900">Hasil Analisis AI</h1>
          <p className="text-body text-neutral-600">
            {analysisResults.patientName} ({analysisResults.patientId}) • {analysisResults.analysisDate} pukul{" "}
            {analysisResults.analysisTime}
          </p>
        </div>
        <div className="flex gap-2">
          <EnhancedButton variant="outline" size="sm">
            <Share className="mr-2 h-4 w-4" />
            Bagikan
          </EnhancedButton>
          <EnhancedButton variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Ekspor
          </EnhancedButton>
        </div>
      </div>

      {/* Overall Risk Assessment */}
      <Card className={`border-2 shadow-soft ${getRiskColor(analysisResults.overallRisk)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
              {analysisResults.overallRisk === "High" && <AlertTriangle className="h-6 w-6 text-critical-red" />}
              {analysisResults.overallRisk === "Medium" && <AlertTriangle className="h-6 w-6 text-alert-orange" />}
              {analysisResults.overallRisk === "Low" && <CheckCircle className="h-6 w-6 text-health-teal" />}
              Penilaian Risiko Keseluruhan
            </CardTitle>
            <Badge variant="outline" className="text-body-sm border-trust-blue text-trust-blue">
              Kepercayaan: {analysisResults.confidence}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-h1 font-bold mb-2">
              {analysisResults.overallRisk === "High" && <span className="text-critical-red">Risiko Tinggi</span>}
              {analysisResults.overallRisk === "Medium" && <span className="text-alert-orange">Risiko Sedang</span>}
              {analysisResults.overallRisk === "Low" && <span className="text-health-teal">Risiko Rendah</span>}
            </div>
            <p className="text-body-sm text-neutral-600">
              Berdasarkan analisis AI terhadap tanda vital, data EKG, dan pola pernapasan
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Vital Signs Summary */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-health-teal" />
              Ringkasan Tanda Vital
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {Object.entries(analysisResults.vitalSigns).map(([key, vital]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <div>
                  <p className="text-body font-medium text-neutral-900 capitalize">
                    {key === "heartRate" && "Detak Jantung"}
                    {key === "bloodPressure" && "Tekanan Darah"}
                    {key === "respiratoryRate" && "Laju Pernapasan"}
                    {key === "spO2" && "Saturasi Oksigen"}
                    {key === "temperature" && "Suhu Tubuh"}
                  </p>
                  <p className="text-body-sm text-neutral-500">Normal: {vital.range}</p>
                </div>
                <div className="text-right">
                  <p className={`text-h3 font-bold ${getStatusColor(vital.status)}`}>
                    {"systolic" in vital ? `${vital.systolic}/${vital.diastolic}` : vital.value} {vital.unit}
                  </p>
                  <p className={`text-body-sm capitalize ${getStatusColor(vital.status)}`}>
                    {vital.status === "normal" && "Normal"}
                    {vital.status === "elevated" && "Tinggi"}
                    {vital.status === "high" && "Sangat Tinggi"}
                    {vital.status === "low" && "Rendah"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* AI Findings */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-health-teal" />
              Temuan Klinis AI
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {analysisResults.aiFindings.map((finding, index) => (
              <div key={index} className="p-3 border border-neutral-200 rounded-lg bg-white">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-body font-semibold text-neutral-900">{finding.category}</p>
                    <p className="text-body-sm text-neutral-700">{finding.finding}</p>
                  </div>
                  {getSeverityBadge(finding.severity)}
                </div>
                <div className="flex justify-between items-center text-body-sm text-neutral-500">
                  <span>Kepercayaan: {finding.confidence}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Rekomendasi & Langkah Selanjutnya</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Rekomendasi yang dibuat AI berdasarkan hasil analisis
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {analysisResults.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <CheckCircle className="h-5 w-5 text-trust-blue mt-0.5 flex-shrink-0" />
                <p className="text-body-sm text-neutral-800">{recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialist Notes */}
      {analysisResults.specialistNotes && (
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-yellow-50">
            <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-alert-orange" />
              Catatan Tinjauan Spesialis
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-body text-neutral-800">{analysisResults.specialistNotes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <EnhancedButton asChild className="bg-health-teal hover:bg-teal-600">
          <Link href={`/health-worker/patients/${analysisResults.patientId}`}>
            <User className="mr-2 h-4 w-4" />
            Lihat Profil Pasien
          </Link>
        </EnhancedButton>
        <EnhancedButton asChild variant="outline">
          <Link href={`/health-worker/upload?patient=${analysisResults.patientId}`}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Data Baru
          </Link>
        </EnhancedButton>
        <EnhancedButton asChild variant="outline">
          <Link href={`/specialist/patient/${analysisResults.patientId}`}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Rujuk ke Spesialis
          </Link>
        </EnhancedButton>
      </div>
    </div>
  )
} 