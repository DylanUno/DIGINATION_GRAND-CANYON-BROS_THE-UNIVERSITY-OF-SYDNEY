import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Download,
  Printer,
  MapPin,
  Calendar,
  Heart,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  FileText,
} from "lucide-react"

export default function PatientResultsPage() {
  const analysisDate = "15 Desember 2024"
  const puskesmasLocation = "Puskesmas Karimunjawa"
  const overallStatus = "Medium" // Green/Yellow/Red
  const doctorName = "Dr. Sarah Wijaya"

  const vitalSigns = [
    { name: "Ritme Jantung", status: "normal", description: "Ritme jantung Anda normal dan teratur" },
    { name: "Tekanan Darah", status: "elevated", description: "Tekanan darah sedikit tinggi, perlu dipantau" },
    { name: "Pola Pernapasan", status: "normal", description: "Pola pernapasan stabil dan normal" },
    { name: "Saturasi Oksigen", status: "normal", description: "Kadar oksigen dalam darah baik" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-risk-low"
      case "elevated":
        return "text-risk-medium"
      case "high":
        return "text-risk-high"
      default:
        return "text-neutral-600"
    }
  }

  const getTrafficLightColor = (status: string) => {
    switch (status) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-neutral-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Summary */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-h2 text-neutral-900">Ringkasan Analisis Kesehatan</CardTitle>
              <CardDescription className="text-body text-neutral-600 mt-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Analisis selesai {analysisDate}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>di {puskesmasLocation}</span>
                </div>
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <EnhancedButton variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Cetak Ringkasan
              </EnhancedButton>
              <EnhancedButton size="sm">
                <Download className="h-4 w-4 mr-2" />
                Unduh Laporan Lengkap
              </EnhancedButton>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {/* Traffic Light System */}
          <div className="flex items-center justify-center mb-6">
            <div className="text-center">
              <div
                className={`w-20 h-20 rounded-full ${getTrafficLightColor(overallStatus)} flex items-center justify-center mb-4`}
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                  <span className="text-h2 font-bold text-neutral-900">
                    {overallStatus === "Low" ? "✓" : overallStatus === "Medium" ? "!" : "⚠"}
                  </span>
                </div>
              </div>
              <h3 className="text-h2 font-bold text-neutral-900">Status Kesehatan: {overallStatus}</h3>
              <p className="text-body text-neutral-600 mt-1">
                {overallStatus === "Low" && "Kondisi kesehatan Anda baik"}
                {overallStatus === "Medium" && "Perlu perhatian dan pemantauan"}
                {overallStatus === "High" && "Memerlukan tindakan medis segera"}
              </p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-h3 text-neutral-900 mb-2">Temuan Utama</h4>
            <p className="text-body text-neutral-700">
              Pemeriksaan menunjukkan tekanan darah yang sedikit meningkat. Kondisi jantung dan pernapasan dalam keadaan
              normal. Disarankan untuk melakukan perubahan gaya hidup dan pemantauan rutin.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Overview */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-health-teal" />
            Ringkasan Tanda Vital
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {vitalSigns.map((vital, index) => (
              <div key={index} className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-body text-neutral-900">{vital.name}</h4>
                  <StatusIndicator
                    status={
                      vital.status === "normal" ? "completed" : vital.status === "elevated" ? "processing" : "urgent"
                    }
                    label={vital.status === "normal" ? "Normal" : vital.status === "elevated" ? "Perhatian" : "Tinggi"}
                    showIcon={false}
                  />
                </div>
                <p className={`text-body-sm ${getStatusColor(vital.status)}`}>{vital.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Specialist Recommendations */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-health-teal" />
            Rekomendasi Dokter Spesialis
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Saran dari {doctorName}, Spesialis Jantung dan Pembuluh Darah
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Next Steps */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-3 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-health-teal" />
              Langkah Selanjutnya
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-6 h-6 bg-trust-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <p className="text-body text-neutral-700">Kontrol rutin dalam 2 minggu untuk memantau tekanan darah</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-6 h-6 bg-trust-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <p className="text-body text-neutral-700">Lakukan pemeriksaan laboratorium darah lengkap</p>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-6 h-6 bg-trust-blue text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <p className="text-body text-neutral-700">Konsultasi dengan ahli gizi untuk perencanaan diet</p>
              </div>
            </div>
          </div>

          {/* Lifestyle Advice */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-health-teal" />
              Saran Gaya Hidup
            </h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Diet & Nutrisi</h5>
                <ul className="text-body-sm text-neutral-700 space-y-1">
                  <li>• Kurangi konsumsi garam (maksimal 1 sendok teh/hari)</li>
                  <li>• Perbanyak sayuran dan buah-buahan</li>
                  <li>• Hindari makanan berlemak tinggi</li>
                </ul>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Aktivitas Fisik</h5>
                <ul className="text-body-sm text-neutral-700 space-y-1">
                  <li>• Jalan kaki 30 menit setiap hari</li>
                  <li>• Olahraga ringan 3x seminggu</li>
                  <li>• Hindari aktivitas berat berlebihan</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Warning Signs */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-semibold text-h3 text-neutral-900 mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-risk-high" />
              Tanda Bahaya - Segera Hubungi Dokter
            </h4>
            <div className="grid gap-2 md:grid-cols-2">
              <ul className="text-body-sm text-neutral-700 space-y-1">
                <li>• Nyeri dada yang tidak hilang</li>
                <li>• Sesak napas berat</li>
                <li>• Pusing berlebihan atau pingsan</li>
              </ul>
              <ul className="text-body-sm text-neutral-700 space-y-1">
                <li>• Sakit kepala hebat mendadak</li>
                <li>• Mual dan muntah terus-menerus</li>
                <li>• Penglihatan kabur atau ganda</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-health-teal" />
            Analisis Tren Kesehatan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Progress Timeline */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-4">Timeline Kemajuan Kesehatan</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-body-sm text-neutral-600 w-24">Des 2024</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body font-medium">Tekanan Darah</span>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                      Meningkat
                    </Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-body-sm text-neutral-600 w-24">Nov 2024</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-body font-medium">Tekanan Darah</span>
                    <Badge className="bg-green-100 text-green-700">Normal</Badge>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factor Monitoring */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-4">Pemantauan Faktor Risiko</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Tekanan Darah Tinggi</h5>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={70} className="flex-1 h-2" />
                  <span className="text-body-sm text-neutral-600">70%</span>
                </div>
                <p className="text-body-sm text-neutral-600">Risiko sedang - perlu pemantauan rutin</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Kesehatan Jantung</h5>
                <div className="flex items-center gap-2 mb-2">
                  <Progress value={85} className="flex-1 h-2" />
                  <span className="text-body-sm text-neutral-600">85%</span>
                </div>
                <p className="text-body-sm text-neutral-600">Kondisi baik - pertahankan gaya hidup sehat</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personalized Care Plan */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-health-teal" />
            Rencana Perawatan Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step-by-step Health Improvement Guide */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-4">Panduan Peningkatan Kesehatan</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-8 h-8 bg-trust-blue text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-body text-neutral-900 mb-1">Minggu 1-2: Penyesuaian Diet</h5>
                  <p className="text-body-sm text-neutral-600">
                    Mulai kurangi garam dan perbanyak sayuran dalam menu harian
                  </p>
                  <div className="mt-2">
                    <Progress value={0} className="h-2" />
                    <span className="text-body-sm text-neutral-500 mt-1">Belum dimulai</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <div className="w-8 h-8 bg-neutral-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h5 className="font-medium text-body text-neutral-900 mb-1">Minggu 3-4: Aktivitas Fisik Rutin</h5>
                  <p className="text-body-sm text-neutral-600">Tambahkan jalan kaki 30 menit setiap hari</p>
                  <div className="mt-2">
                    <Progress value={0} className="h-2" />
                    <span className="text-body-sm text-neutral-500 mt-1">Menunggu tahap sebelumnya</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Milestone Tracking */}
          <div>
            <h4 className="font-semibold text-h3 text-neutral-900 mb-4">Pencapaian Target Kesehatan</h4>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-gradient-to-r from-neutral-50 to-blue-50 rounded-lg border border-neutral-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Target Tekanan Darah</h5>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-body-sm text-neutral-600">Saat ini: 140/90</span>
                  <span className="text-body-sm text-neutral-600">→</span>
                  <span className="text-body-sm text-trust-blue font-medium">Target: 120/80</span>
                </div>
                <Progress value={40} className="h-2" />
                <span className="text-body-sm text-neutral-500 mt-1">40% menuju target</span>
              </div>
              <div className="p-4 bg-gradient-to-r from-neutral-50 to-blue-50 rounded-lg border border-neutral-200">
                <h5 className="font-medium text-body text-neutral-900 mb-2">Target Berat Badan</h5>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-body-sm text-neutral-600">Saat ini: 75 kg</span>
                  <span className="text-body-sm text-neutral-600">→</span>
                  <span className="text-body-sm text-trust-blue font-medium">Target: 70 kg</span>
                </div>
                <Progress value={0} className="h-2" />
                <span className="text-body-sm text-neutral-500 mt-1">Belum dimulai</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 