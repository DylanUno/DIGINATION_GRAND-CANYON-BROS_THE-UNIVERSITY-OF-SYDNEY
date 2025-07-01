import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { ArrowLeft, Upload, User, Phone, MapPin, Calendar, Weight, Ruler, Heart, Eye, Activity } from "lucide-react"
import Link from "next/link"

// Mock patient data - in real app, this would be fetched based on params.id
const patientData = {
  id: "P001",
  name: "Ahmad Wijaya",
  dateOfBirth: "1986-07-22",
  age: 38,
  gender: "Laki-laki",
  phone: "+62 812 3456 7890",
  address: "Jl. Kesehatan No. 45, Karimunjawa, Jepara, Jawa Tengah 59582",
  emergencyContact: {
    name: "Siti Wijaya",
    phone: "+62 813 4567 8901",
    relationship: "Istri",
  },
  medicalInfo: {
    weight: 72,
    height: 170,
    bmi: 24.9,
    bloodType: "A+",
    allergies: ["Penisilin", "Udang"],
    conditions: ["Hipertensi", "Diabetes Tipe 2"],
  },
  registrationDate: "2024-01-15",
  lastVisit: "2025-01-02",
}

const medicalHistory = [
  {
    date: "2025-01-02",
    type: "Pemeriksaan Rutin",
    notes: "Tekanan darah sedikit tinggi. Obat disesuaikan. Dianjurkan mengurangi konsumsi garam.",
    provider: "Dr. Sarah Indira, Sp.PD",
  },
  {
    date: "2024-11-15",
    type: "Kontrol Diabetes",
    notes: "Kadar HbA1c membaik. Kontrol gula darah baik. Lanjutkan pola makan sehat.",
    provider: "Dr. Sarah Indira, Sp.PD",
  },
  {
    date: "2024-08-20",
    type: "Kunjungan Darurat",
    notes: "Evaluasi nyeri dada. EKG normal, kemungkinan terkait stress. Dirujuk ke spesialis jantung.",
    provider: "Dr. Michael Hartono, Sp.JP",
  },
  {
    date: "2024-05-10",
    type: "Pemeriksaan Komprehensif",
    notes: "Pemeriksaan tahunan lengkap. Semua parameter dalam batas normal kecuali tekanan darah.",
    provider: "Dr. Sarah Indira, Sp.PD",
  },
]

const analysisHistory = [
  {
    id: "A001",
    date: "2025-01-02",
    time: "14:30",
    riskLevel: "Medium",
    status: "Completed",
    findings: "Tekanan darah tinggi terdeteksi, detak jantung tidak teratur",
  },
  {
    id: "A002",
    date: "2024-11-15",
    time: "10:15",
    riskLevel: "Low",
    status: "Completed",
    findings: "Semua tanda vital dalam batas normal",
  },
  {
    id: "A003",
    date: "2024-08-20",
    time: "16:45",
    riskLevel: "High",
    status: "Completed",
    findings: "Irregularitas jantung signifikan, perlu rujukan segera ke spesialis",
  },
  {
    id: "A004",
    date: "2024-05-10",
    time: "09:30",
    riskLevel: "Low",
    status: "Completed",
    findings: "Kadar gula darah terkontrol, tekanan darah borderline",
  },
]

const getRiskBadge = (riskLevel: string) => {
  switch (riskLevel) {
    case "High":
      return <StatusIndicator status="urgent" label="Risiko Tinggi" showIcon={false} />
    case "Medium":
      return <StatusIndicator status="processing" label="Risiko Sedang" showIcon={false} />
    case "Low":
      return <StatusIndicator status="completed" label="Risiko Rendah" showIcon={false} />
    default:
      return <Badge variant="outline">{riskLevel}</Badge>
  }
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <EnhancedButton asChild variant="outline" size="sm">
          <Link href="/health-worker/patients">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Link>
        </EnhancedButton>
        <div className="flex-1">
          <h1 className="text-display font-bold text-neutral-900">{patientData.name}</h1>
          <p className="text-body text-neutral-600">ID Pasien: {patientData.id}</p>
        </div>
        <EnhancedButton asChild className="bg-health-teal hover:bg-teal-600">
          <Link href={`/health-worker/upload?patient=${patientData.id}`}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Data Baru
          </Link>
        </EnhancedButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Profile Card */}
        <Card className="lg:col-span-1 shadow-soft border-neutral-200">
          <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
            <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
              <User className="h-5 w-5 text-health-teal" />
              Profil Pasien
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-health-teal to-trust-blue rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-white" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-h3 font-bold text-neutral-900">{patientData.name}</h3>
              <p className="text-body text-neutral-600">
                {patientData.age} tahun • {patientData.gender}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-body-sm text-neutral-700">
                <Calendar className="h-4 w-4 text-neutral-500" />
                <span>Lahir: {patientData.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-2 text-body-sm text-neutral-700">
                <Phone className="h-4 w-4 text-neutral-500" />
                <span>{patientData.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-body-sm text-neutral-700">
                <MapPin className="h-4 w-4 text-neutral-500 mt-0.5" />
                <span>{patientData.address}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-body font-semibold text-neutral-900">Informasi Medis</h4>
              <div className="grid grid-cols-2 gap-2 text-body-sm text-neutral-700">
                <div className="flex items-center gap-1">
                  <Weight className="h-3 w-3 text-neutral-500" />
                  <span>{patientData.medicalInfo.weight} kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-neutral-500" />
                  <span>{patientData.medicalInfo.height} cm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-neutral-500" />
                  <span>BMI: {patientData.medicalInfo.bmi}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-neutral-500" />
                  <span>{patientData.medicalInfo.bloodType}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="text-body font-semibold text-neutral-900">Kontak Darurat</h4>
              <div className="text-body-sm text-neutral-700 space-y-1">
                <p className="font-medium">{patientData.emergencyContact.name}</p>
                <p className="text-neutral-600">{patientData.emergencyContact.relationship}</p>
                <p className="text-neutral-600">{patientData.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Conditions & Allergies */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900">Kondisi Medis & Alergi</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-body font-semibold text-neutral-900 mb-2">Kondisi yang Diketahui</h4>
                  <div className="space-y-1">
                    {patientData.medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="mr-1 border-trust-blue text-trust-blue">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-body font-semibold text-neutral-900 mb-2">Alergi</h4>
                  <div className="space-y-1">
                    {patientData.medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} className="mr-1 bg-critical-red text-white">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Timeline */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900">Riwayat Medis</CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Kunjungan dan kejadian medis sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {medicalHistory.map((event, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                    <div className="flex-shrink-0 w-2 bg-health-teal rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-body font-semibold text-neutral-900">{event.type}</h4>
                        <span className="text-body-sm text-neutral-500">{event.date}</span>
                      </div>
                      <p className="text-body-sm text-neutral-700 mb-1">{event.notes}</p>
                      <p className="text-body-sm text-neutral-500">Penyedia: {event.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis History */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900">Riwayat Analisis AI</CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Asesmen kesehatan dan hasil analisis sebelumnya
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-body font-medium text-neutral-700">Tanggal & Waktu</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Tingkat Risiko</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Status</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Temuan Utama</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisHistory.map((analysis) => (
                    <TableRow key={analysis.id} className="hover:bg-neutral-50">
                      <TableCell>
                        <div>
                          <div className="text-body font-medium text-neutral-900">{analysis.date}</div>
                          <div className="text-body-sm text-neutral-500">{analysis.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(analysis.riskLevel)}</TableCell>
                      <TableCell>
                        <StatusIndicator status="completed" label={analysis.status} showIcon={false} />
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-body-sm text-neutral-700">{analysis.findings}</p>
                      </TableCell>
                      <TableCell>
                        <EnhancedButton asChild size="sm" variant="outline">
                          <Link href={`/health-worker/queue/${analysis.id}/results`}>
                            <Eye className="h-3 w-3 mr-1" />
                            Lihat
                          </Link>
                        </EnhancedButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900">Aksi Cepat</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Tindakan yang tersedia untuk pasien ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <EnhancedButton asChild variant="outline">
              <Link href={`/health-worker/upload?patient=${patientData.id}`}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data Medis
              </Link>
            </EnhancedButton>
            <EnhancedButton asChild variant="outline">
              <Link href={`/health-worker/patients/${patientData.id}/edit`}>
                <User className="h-4 w-4 mr-2" />
                Edit Profil
              </Link>
            </EnhancedButton>
            <EnhancedButton asChild variant="outline">
              <Link href={`/specialist/patient/${patientData.id}`}>
                <Activity className="h-4 w-4 mr-2" />
                Konsultasi Spesialis
              </Link>
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 