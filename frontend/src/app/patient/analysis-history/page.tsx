import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Eye, 
  Download, 
  TrendingUp, 
  Activity,
  Heart,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from "lucide-react"
import Link from "next/link"

export default function AnalysisHistoryPage() {
  const analyses = [
    { 
      id: "A001", 
      date: "15 Desember 2024", 
      time: "14:30",
      riskLevel: "Medium", 
      status: "Completed",
      summary: "Tekanan darah sedikit meningkat, ritme jantung normal",
      specialist: "Dr. Sarah Wijaya",
      location: "Puskesmas Karimunjawa",
      findings: ["Hipertensi ringan", "ECG normal", "Saturasi oksigen baik"],
      nextAction: "Kontrol dalam 2 minggu"
    },
    { 
      id: "A002", 
      date: "28 November 2024", 
      time: "10:15",
      riskLevel: "Low", 
      status: "Completed",
      summary: "Semua tanda vital dalam batas normal",
      specialist: "Dr. Ahmad Santoso",
      location: "Puskesmas Karimunjawa",
      findings: ["Kondisi jantung baik", "Tekanan darah normal", "Pola pernapasan stabil"],
      nextAction: "Kontrol rutin 6 bulan"
    },
    {
      id: "A003",
      date: "10 Oktober 2024",
      time: "16:45", 
      riskLevel: "High",
      status: "Completed",
      summary: "Kelainan signifikan pada pola pernapasan, perlu konsultasi spesialis",
      specialist: "Dr. Emily Carter",
      location: "Puskesmas Karimunjawa",
      findings: ["Aritmia terdeteksi", "Sesak napas", "Saturasi oksigen rendah"],
      nextAction: "Rujukan ke rumah sakit"
    },
    {
      id: "A004",
      date: "22 September 2024",
      time: "09:20",
      riskLevel: "Low",
      status: "Completed", 
      summary: "Pemeriksaan rutin, kondisi stabil",
      specialist: "Dr. Sarah Wijaya",
      location: "Puskesmas Karimunjawa",
      findings: ["Kondisi umum baik", "Vital sign stabil", "Tidak ada keluhan"],
      nextAction: "Lanjutkan gaya hidup sehat"
    },
  ]

  const getRiskStatus = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "high-risk"
      case "Medium":
        return "medium-risk"
      case "Low":
        return "low-risk"
      default:
        return "completed"
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return "text-risk-high bg-red-50 border-red-200"
      case "Medium":
        return "text-risk-medium bg-yellow-50 border-yellow-200"
      case "Low":
        return "text-risk-low bg-green-50 border-green-200"
      default:
        return "text-neutral-600 bg-neutral-50 border-neutral-200"
    }
  }

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "High":
        return <AlertTriangle className="h-5 w-5 text-risk-high" />
      case "Medium":
        return <TrendingUp className="h-5 w-5 text-risk-medium" />
      case "Low":
        return <CheckCircle className="h-5 w-5 text-risk-low" />
      default:
        return <Activity className="h-5 w-5 text-neutral-500" />
    }
  }

  const getMonthSummary = () => {
    const thisMonth = analyses.filter(a => a.date.includes("Desember 2024"))
    const highRisk = analyses.filter(a => a.riskLevel === "High").length
    const totalAnalyses = analyses.length
    
    return {
      thisMonth: thisMonth.length,
      total: totalAnalyses,
      highRiskCount: highRisk,
      averageRisk: totalAnalyses > 0 ? "Medium" : "Low"
    }
  }

  const summary = getMonthSummary()

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-xl p-6 border border-health-teal/20">
        <h1 className="text-display font-bold text-neutral-900">Riwayat Analisis Medis</h1>
        <p className="text-body text-neutral-600 mt-2">
          Lihat semua hasil analisis kesehatan Anda dengan detail lengkap dan tren perkembangan
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-health-teal" />
              Total Analisis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{summary.total}</div>
            <p className="text-body-sm text-neutral-600">Sejak bergabung</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-health-teal" />
              Bulan Ini
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{summary.thisMonth}</div>
            <p className="text-body-sm text-neutral-600">Desember 2024</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-health-teal" />
              Risiko Tinggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-risk-high">{summary.highRiskCount}</div>
            <p className="text-body-sm text-neutral-600">Memerlukan perhatian</p>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-health-teal" />
              Rata-rata Risiko
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatusIndicator
              status={getRiskStatus(summary.averageRisk) as any}
              label={summary.averageRisk}
              showIcon={false}
              className="mb-2"
            />
            <p className="text-body-sm text-neutral-600">Tingkat risiko umum</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Filter className="h-6 w-6 text-health-teal" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                placeholder="Cari berdasarkan tanggal, dokter, atau temuan..."
                className="pl-10 h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Filter Risiko" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkat Risiko</SelectItem>
                <SelectItem value="high">Risiko Tinggi</SelectItem>
                <SelectItem value="medium">Risiko Sedang</SelectItem>
                <SelectItem value="low">Risiko Rendah</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="latest">
              <SelectTrigger className="w-full md:w-[200px] h-12">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Terbaru ke Lama</SelectItem>
                <SelectItem value="oldest">Lama ke Terbaru</SelectItem>
                <SelectItem value="risk-high">Risiko Tinggi Dulu</SelectItem>
                <SelectItem value="risk-low">Risiko Rendah Dulu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Analysis History List */}
      <div className="space-y-4">
        {analyses.map((analysis) => (
          <Card key={analysis.id} className={`shadow-soft border-2 ${getRiskColor(analysis.riskLevel)}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRiskIcon(analysis.riskLevel)}
                  <div>
                    <CardTitle className="text-h3 text-neutral-900">Analisis {analysis.id}</CardTitle>
                    <div className="flex items-center gap-4 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-neutral-500" />
                        <span className="text-body-sm text-neutral-600">{analysis.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-neutral-500" />
                        <span className="text-body-sm text-neutral-600">{analysis.time}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {analysis.location}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIndicator
                    status={getRiskStatus(analysis.riskLevel) as any}
                    label={`${analysis.riskLevel} Risk`}
                    showIcon={false}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary */}
              <div>
                <h4 className="font-semibold text-body text-neutral-900 mb-2">Ringkasan Hasil</h4>
                <p className="text-body text-neutral-700">{analysis.summary}</p>
              </div>

              {/* Findings */}
              <div>
                <h4 className="font-semibold text-body text-neutral-900 mb-2">Temuan Utama</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  {analysis.findings.map((finding, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 rounded">
                      <div className="w-2 h-2 bg-trust-blue rounded-full"></div>
                      <span className="text-body-sm text-neutral-700">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specialist and Next Action */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-semibold text-body text-neutral-900 mb-1">Dokter Spesialis</h4>
                  <p className="text-body-sm text-neutral-700">{analysis.specialist}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-body text-neutral-900 mb-1">Tindak Lanjut</h4>
                  <p className="text-body-sm text-neutral-700">{analysis.nextAction}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-neutral-200">
                <EnhancedButton asChild size="sm" variant="outline">
                  <Link href={`/patient/results?id=${analysis.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Lihat Detail
                  </Link>
                </EnhancedButton>
                <EnhancedButton size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Unduh Laporan
                </EnhancedButton>
                {analysis.riskLevel === "High" && (
                  <EnhancedButton size="sm" className="bg-risk-high hover:bg-red-600">
                    <Heart className="h-4 w-4 mr-2" />
                    Konsultasi Darurat
                  </EnhancedButton>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center pt-6">
        <div className="flex items-center gap-2">
          <EnhancedButton variant="outline" size="sm" disabled>
            Sebelumnya
          </EnhancedButton>
          <div className="flex items-center gap-1">
            <EnhancedButton size="sm" className="w-8 h-8">1</EnhancedButton>
            <EnhancedButton variant="outline" size="sm" className="w-8 h-8">2</EnhancedButton>
            <EnhancedButton variant="outline" size="sm" className="w-8 h-8">3</EnhancedButton>
          </div>
          <EnhancedButton variant="outline" size="sm">
            Selanjutnya
          </EnhancedButton>
        </div>
      </div>
    </div>
  )
}
