import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileCheck, 
  UploadCloud, 
  ListChecks, 
  Video, 
  Send, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Heart,
  Activity,
  Smartphone,
  Camera,
  Wifi
} from "lucide-react"
import Link from "next/link"

export default function NewAnalysisPage() {
  const analysisSteps = [
    {
      step: 1,
      title: "Persiapan Analisis",
      description: "Siapkan perangkat dan baca petunjuk lengkap",
      icon: ListChecks,
      status: "ready",
      estimatedTime: "5 menit"
    },
    {
      step: 2,
      title: "Pengumpulan Data Vital",
      description: "Gunakan toolkit untuk mengumpulkan data ECG, PPG, dan SpO2",
      icon: Heart,
      status: "pending",
      estimatedTime: "8 menit"
    },
    {
      step: 3,
      title: "Upload Data Medis",
      description: "Unggah file data (.dat dan .hea) dari toolkit",
      icon: UploadCloud,
      status: "pending",
      estimatedTime: "3 menit"
    },
    {
      step: 4,
      title: "Rekam Video Pernapasan",
      description: "Rekam video untuk analisis pola pernapasan",
      icon: Video,
      status: "pending",
      estimatedTime: "2 menit"
    },
    {
      step: 5,
      title: "Kirim untuk Analisis",
      description: "Tinjau data dan kirim untuk analisis AI",
      icon: Send,
      status: "pending",
      estimatedTime: "2 menit"
    }
  ]

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle className="h-5 w-5 text-health-teal" />
      case "pending":
        return <Clock className="h-5 w-5 text-neutral-400" />
      case "completed":
        return <CheckCircle className="h-5 w-5 text-risk-low" />
      default:
        return <Clock className="h-5 w-5 text-neutral-400" />
    }
  }

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-health-teal/10 border-health-teal/20"
      case "pending":
        return "bg-neutral-50 border-neutral-200"
      case "completed":
        return "bg-green-50 border-green-200"
      default:
        return "bg-neutral-50 border-neutral-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-xl p-6 border border-health-teal/20">
        <h1 className="text-display font-bold text-neutral-900">Analisis Kesehatan Baru</h1>
        <p className="text-body text-neutral-600 mt-2">
          Ikuti langkah-langkah berikut untuk melakukan analisis kesehatan lengkap dengan teknologi AI multi-modal
        </p>
        <div className="flex items-center gap-4 mt-4">
          <Badge variant="outline" className="text-trust-blue border-trust-blue">
            Total waktu: ~20 menit
          </Badge>
          <Badge variant="outline" className="text-health-teal border-health-teal">
            5 Modalitas Vital Sign
          </Badge>
        </div>
      </div>

      {/* Requirements Check */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-health-teal" />
            Persyaratan Sebelum Memulai
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Pastikan Anda memiliki semua yang dibutuhkan untuk analisis yang akurat
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="h-5 w-5 text-trust-blue" />
                <h4 className="font-medium text-body text-neutral-900">Perangkat</h4>
              </div>
              <ul className="text-body-sm text-neutral-700 space-y-1">
                <li>• Smartphone dengan kamera</li>
                <li>• Toolkit sensor medis</li>
                <li>• Ruangan dengan pencahayaan cukup</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Wifi className="h-5 w-5 text-trust-blue" />
                <h4 className="font-medium text-body text-neutral-900">Koneksi</h4>
              </div>
              <ul className="text-body-sm text-neutral-700 space-y-1">
                <li>• Koneksi internet stabil</li>
                <li>• Bandwidth minimal 1 Mbps</li>
                <li>• File upload hingga 50MB</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="h-5 w-5 text-trust-blue" />
                <h4 className="font-medium text-body text-neutral-900">Kondisi</h4>
              </div>
              <ul className="text-body-sm text-neutral-700 space-y-1">
                <li>• Istirahat 5 menit sebelum mulai</li>
                <li>• Hindari kafein 2 jam sebelumnya</li>
                <li>• Posisi duduk yang nyaman</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Steps */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900">Langkah-langkah Analisis</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Proses komprehensif untuk analisis kesehatan multi-modal dengan AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {analysisSteps.map((step, index) => (
            <div key={step.step} className={`p-4 rounded-lg border ${getStepStatusColor(step.status)}`}>
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-trust-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                  <step.icon className="h-6 w-6 text-trust-blue" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-body text-neutral-900">{step.title}</h4>
                    <div className="flex items-center gap-2">
                      {getStepStatusIcon(step.status)}
                      <span className="text-body-sm text-neutral-600">{step.estimatedTime}</span>
                    </div>
                  </div>
                  <p className="text-body-sm text-neutral-700 mb-3">{step.description}</p>
                  {step.status === "ready" ? (
                    <EnhancedButton size="sm" className="bg-health-teal hover:bg-teal-600">
                      Mulai Langkah Ini
                    </EnhancedButton>
                  ) : (
                    <EnhancedButton size="sm" variant="outline" disabled>
                      Menunggu
                    </EnhancedButton>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-alert-orange" />
            Catatan Penting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-semibold text-body text-neutral-900 mb-2">Keamanan Data</h4>
            <p className="text-body-sm text-neutral-700">
              Semua data kesehatan Anda dienkripsi dan disimpan dengan standar keamanan tinggi. Data hanya dapat 
              diakses oleh tenaga medis yang berwenang dan tidak akan dibagikan kepada pihak ketiga.
            </p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-body text-neutral-900 mb-2">Waktu Pemrosesan</h4>
            <p className="text-body-sm text-neutral-700">
              Hasil analisis awal akan tersedia dalam 15 menit. Validasi dokter spesialis akan selesai dalam 24 jam.
              Anda akan menerima notifikasi ketika hasil sudah siap.
            </p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-body text-neutral-900 mb-2">Kondisi Darurat</h4>
            <p className="text-body-sm text-neutral-700">
              Jika Anda mengalami gejala darurat (nyeri dada, sesak napas berat, pusing parah), segera hubungi 
              layanan gawat darurat atau datang ke fasilitas kesehatan terdekat.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <EnhancedButton asChild variant="outline" size="lg">
          <Link href="/patient/dashboard">
            Kembali ke Dashboard
          </Link>
        </EnhancedButton>
        <EnhancedButton size="lg" className="bg-health-teal hover:bg-teal-600">
          Mulai Analisis Sekarang
        </EnhancedButton>
      </div>
    </div>
  )
}
