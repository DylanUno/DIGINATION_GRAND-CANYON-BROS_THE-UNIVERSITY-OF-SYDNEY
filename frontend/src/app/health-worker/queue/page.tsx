"use client"

import { useState } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

import { Input } from "@/components/ui/input"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Search, Eye, RefreshCw, Clock, CheckCircle, AlertTriangle, Loader, Activity, Users } from "lucide-react"
import Link from "next/link"

// Mock queue data - Indonesian context
const queueData = [
  {
    id: "Q001",
    patientName: "Ahmad Wijaya",
    patientId: "P001",
    uploadTime: "2025-01-03 14:30",
    status: "Processing",
    aiRiskLevel: null,
    estimatedCompletion: "2025-01-03 15:00",
    progress: 65,
  },
  {
    id: "Q002", 
    patientName: "Siti Nurhaliza",
    patientId: "P002",
    uploadTime: "2025-01-03 13:45",
    status: "Completed",
    aiRiskLevel: "Medium",
    estimatedCompletion: "2025-01-03 14:15",
    progress: 100,
  },
  {
    id: "Q003",
    patientName: "Budi Santoso",
    patientId: "P003",
    uploadTime: "2025-01-03 13:20",
    status: "Urgent Review",
    aiRiskLevel: "High",
    estimatedCompletion: "2025-01-03 13:50",
    progress: 100,
  },
  {
    id: "Q004",
    patientName: "Dewi Sartika",
    patientId: "P004",
    uploadTime: "2025-01-03 12:15",
    status: "Completed",
    aiRiskLevel: "Low",
    estimatedCompletion: "2025-01-03 12:45",
    progress: 100,
  },
  {
    id: "Q005",
    patientName: "Eko Prasetyo",
    patientId: "P005",
    uploadTime: "2025-01-03 11:30",
    status: "Processing",
    aiRiskLevel: null,
    estimatedCompletion: "2025-01-03 12:00",
    progress: 25,
  },
  {
    id: "Q006",
    patientName: "Rini Susanti",
    patientId: "P006",
    uploadTime: "2025-01-03 10:45",
    status: "Completed",
    aiRiskLevel: "Low",
    estimatedCompletion: "2025-01-03 11:15",
    progress: 100,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Processing":
      return <Loader className="h-4 w-4 animate-spin text-trust-blue" />
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-health-teal" />
    case "Urgent Review":
      return <AlertTriangle className="h-4 w-4 text-critical-red" />
    default:
      return <Clock className="h-4 w-4 text-neutral-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Processing":
      return <StatusIndicator status="processing" label="Memproses" showIcon={false} />
    case "Completed":
      return <StatusIndicator status="completed" label="Selesai" showIcon={false} />
    case "Urgent Review":
      return <StatusIndicator status="urgent" label="Review Mendesak" showIcon={false} />
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getRiskBadge = (riskLevel: string | null) => {
  if (!riskLevel) return <span className="text-neutral-400 text-body-sm">Menunggu</span>

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

export default function PatientQueuePage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = queueData.filter((item) => {
    const matchesSearch =
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patientId.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "processing") return matchesSearch && item.status === "Processing"
    if (activeTab === "completed") return matchesSearch && item.status === "Completed"
    if (activeTab === "urgent") return matchesSearch && item.status === "Urgent Review"

    return matchesSearch
  })

  const getTabCount = (status: string) => {
    if (status === "all") return queueData.length
    return queueData.filter((item) => item.status === status).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-bold text-neutral-900">Antrian Analisis Pasien</h1>
          <p className="text-body-lg text-neutral-600 mt-2">Monitor dan kelola permintaan analisis AI</p>
        </div>
        <EnhancedButton variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Perbarui
        </EnhancedButton>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-body font-medium text-neutral-700">Total Antrian</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{queueData.length}</div>
            <p className="text-body-sm text-neutral-500">Pasien dalam sistem</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-body font-medium text-neutral-700">Sedang Diproses</CardTitle>
            <Loader className="h-4 w-4 text-trust-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{getTabCount("Processing")}</div>
            <p className="text-body-sm text-neutral-500">Analisis berlangsung</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-body font-medium text-neutral-700">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-health-teal" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-health-teal">{getTabCount("Completed")}</div>
            <p className="text-body-sm text-neutral-500">Siap ditinjau</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-body font-medium text-neutral-700">Review Mendesak</CardTitle>
            <AlertTriangle className="h-4 w-4 text-critical-red" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-critical-red">{getTabCount("Urgent Review")}</div>
            <p className="text-body-sm text-neutral-500">Perlu perhatian segera</p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Management */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-health-teal" />
            Antrian Analisis
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Monitor dan kelola permintaan analisis pasien
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EnhancedButton
                  variant={activeTab === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("all")}
                  className={activeTab === "all" ? "bg-trust-blue hover:bg-blue-600" : ""}
                >
                  Semua ({queueData.length})
                </EnhancedButton>
                <EnhancedButton
                  variant={activeTab === "processing" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("processing")}
                  className={activeTab === "processing" ? "bg-trust-blue hover:bg-blue-600" : ""}
                >
                  Proses ({getTabCount("Processing")})
                </EnhancedButton>
                <EnhancedButton
                  variant={activeTab === "completed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("completed")}
                  className={activeTab === "completed" ? "bg-health-teal hover:bg-teal-600" : ""}
                >
                  Selesai ({getTabCount("Completed")})
                </EnhancedButton>
                <EnhancedButton
                  variant={activeTab === "urgent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveTab("urgent")}
                  className={activeTab === "urgent" ? "bg-critical-red hover:bg-red-600" : ""}
                >
                  Mendesak ({getTabCount("Urgent Review")})
                </EnhancedButton>
              </div>

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-3 h-4 w-4 text-neutral-500" />
                <Input
                  type="search"
                  placeholder="Cari pasien..."
                  className="pl-8 h-12 border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-body font-medium text-neutral-700">Pasien</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Waktu Upload</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Status</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Tingkat Risiko AI</TableHead>
                    <TableHead className="hidden lg:table-cell text-body font-medium text-neutral-700">Perkiraan Selesai</TableHead>
                    <TableHead className="hidden md:table-cell text-body font-medium text-neutral-700">Progress</TableHead>
                    <TableHead className="text-body font-medium text-neutral-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id} className="hover:bg-neutral-50">
                      <TableCell>
                        <div>
                          <div className="text-body font-medium text-neutral-900">{item.patientName}</div>
                          <div className="text-body-sm text-neutral-500">{item.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-body-sm text-neutral-700">{item.uploadTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(item.aiRiskLevel)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-body-sm text-neutral-700">{item.estimatedCompletion}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-neutral-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all ${
                                item.progress === 100 ? 'bg-health-teal' : 'bg-trust-blue'
                              }`}
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-body-sm text-neutral-500">{item.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === "Completed" || item.status === "Urgent Review" ? (
                          <EnhancedButton asChild size="sm" variant="outline">
                            <Link href={`/health-worker/queue/${item.id}/results`}>
                              <Eye className="h-3 w-3 mr-1" />
                              Lihat Hasil
                            </Link>
                          </EnhancedButton>
                        ) : (
                          <EnhancedButton size="sm" variant="outline" disabled>
                            <Loader className="h-3 w-3 mr-1 animate-spin" />
                            Memproses...
                          </EnhancedButton>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Updates Info */}
      <Card className="shadow-soft border-neutral-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-body-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-trust-blue rounded-full animate-pulse"></div>
              <span>Update otomatis setiap 30 detik</span>
            </div>
            <div className="h-4 w-px bg-neutral-300"></div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-neutral-500" />
              <span>Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 