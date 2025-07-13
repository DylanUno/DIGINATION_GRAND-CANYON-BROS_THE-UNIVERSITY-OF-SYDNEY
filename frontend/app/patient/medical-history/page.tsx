"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Download, Eye, Activity, Heart, Thermometer, Droplets, Share2, TrendingUp } from "lucide-react"
import { getCurrentUserId } from "@/lib/client-auth"

interface MedicalHistoryRecord {
  id: number
  screening_date: string
  overall_status: string
  overall_notes: string
  health_worker_first_name: string
  health_worker_last_name: string
  facility_name: string
  vital_signs: Array<{
    measurement_type: string
    value_text: string
    value_numeric: number | null
    unit: string
    status: string
    reference_range: string
  }>
}

interface HealthReport {
  id: number
  title: string
  type: string
  description: string
  status: string
  generated_at: string
  period_description: string
  file_size: string
  page_count: number
  includes: string[]
  screening_date?: string
  overall_status?: string
  screening_id?: number
}

async function fetchMedicalHistory(): Promise<MedicalHistoryRecord[]> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return []
    }
    
    const response = await fetch('/api/patient/medical-history', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch medical history')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching medical history:', error)
    return []
  }
}

async function fetchReportsData(): Promise<HealthReport[]> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return []
    }
    
    const response = await fetch('/api/patient/reports', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch reports data')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching reports:', error)
    return []
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
    case "ready":
    case "final":
      return "bg-green-100 text-green-800"
    case "pending":
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
    case "error":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "blood test":
      return <Droplets className="h-4 w-4 text-red-500" />
    case "ecg analysis":
      return <Heart className="h-4 w-4 text-blue-500" />
    case "x-ray chest":
      return <Activity className="h-4 w-4 text-purple-500" />
    case "blood pressure":
      return <Thermometer className="h-4 w-4 text-orange-500" />
    case "summary":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "specialized":
      return <Heart className="h-5 w-5 text-red-500" />
    case "laboratory":
      return <Droplets className="h-5 w-5 text-purple-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

const getTypeLabel = (type: string) => {
  switch (type) {
    case "summary":
      return "Health Summary"
    case "specialized":
      return "Specialized Report"
    case "laboratory":
      return "Lab Results"
    default:
      return "5-Modal Report"
  }
}

export default function MedicalHistoryPage() {
  const [screeningHistory, setScreeningHistory] = useState<MedicalHistoryRecord[]>([])
  const [healthReports, setHealthReports] = useState<HealthReport[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("history")

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      const [history, reports] = await Promise.all([
        fetchMedicalHistory(),
        fetchReportsData()
      ])
      setScreeningHistory(history)
      setHealthReports(reports)
      setLoading(false)
    }
    
    loadData()
  }, [])

  const readyReports = healthReports.filter((report) => report.status === "final")
  const processingReports = healthReports.filter((report) => report.status === "processing")

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading your health data...</p>
        </div>
      </div>
    )
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Medical History & Reports</h1>
          <p className="text-gray-600 mt-2">Complete record of your 5-modal health screenings and downloadable reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export All
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Screening History ({screeningHistory.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports & Documents ({readyReports.length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({processingReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-6">
          <div className="grid gap-6">
            {screeningHistory.map((record: any) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Activity className="h-6 w-6 text-blue-500" />
                      <div>
                        <CardTitle className="text-lg">5-Modal Vital Signs Screening</CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(record.screening_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(record.screening_date)}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.overall_status || 'completed')}>
                      {record.overall_status ? record.overall_status.replace('_', ' ').toUpperCase() : 'COMPLETED'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Healthcare Provider</h4>
                      <p className="text-sm text-gray-600">
                        {record.health_worker_first_name && record.health_worker_last_name 
                          ? `${record.health_worker_first_name} ${record.health_worker_last_name}`
                          : 'Health Worker'
                        }
                      </p>
                      <p className="text-sm text-gray-500">{record.facility_name}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Vital Signs Results</h4>
                      <div className="space-y-1">
                        {record.vital_signs && record.vital_signs[0] ? (
                          record.vital_signs
                            .filter((vs: any) => vs.measurement_type) // Filter out null entries
                            .map((vitalSign: any, index: number) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span className="text-gray-600 capitalize">
                                  {vitalSign.measurement_type.replace('_', ' ')}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    {vitalSign.value_text || (vitalSign.value_numeric ? `${vitalSign.value_numeric} ${vitalSign.unit}` : 'N/A')}
                                  </span>
                                  {vitalSign.status && vitalSign.status !== 'normal' && (
                                    <Badge 
                                      variant="secondary" 
                                      className={
                                        vitalSign.status === 'abnormal' ? 'bg-red-100 text-red-800' :
                                        vitalSign.status === 'attention' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                      }
                                    >
                                      {vitalSign.status}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            ))
                        ) : (
                          <p className="text-sm text-gray-500">No vital signs data available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                    <p className="text-sm text-gray-600">
                      {record.overall_notes || 'Health screening completed successfully. All vital signs recorded.'}
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-3 w-3" />
                      Download Report
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-3 w-3" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {screeningHistory.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Screening History</h3>
                <p className="text-gray-600">Your health screening history will appear here once you complete your first 5-modal vital signs assessment.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          {readyReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(report.type)}
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{report.period_description}</span>
                        <span>•</span>
                        <span>Generated {new Date(report.generated_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                    <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{report.description}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Report Details</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">File Size:</span>
                        <span className="font-medium">{report.file_size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium">{report.page_count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Format:</span>
                        <span className="font-medium">PDF</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Includes</h4>
                    <ul className="space-y-1 text-sm">
                      {report.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-gray-600">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm">
                    <Download className="mr-2 h-3 w-3" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-3 w-3" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {readyReports.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
                <p className="text-gray-600 mb-4">Your health reports will appear here once your screening sessions are processed.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="processing" className="space-y-4">
          {processingReports.map((report) => (
            <Card key={report.id} className="opacity-75">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(report.type)}
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{report.period_description}</span>
                        <span>•</span>
                        <span>Processing since {new Date(report.generated_at).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(report.status)}>Processing...</Badge>
                    <Badge variant="outline">{getTypeLabel(report.type)}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{report.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="h-4 w-4 animate-pulse" />
                  <span>Report generation in progress. You'll be notified when it's ready.</span>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button size="sm" disabled>
                    <Download className="mr-2 h-3 w-3" />
                    Processing...
                  </Button>
                  <Button variant="outline" size="sm" disabled>
                    <Eye className="mr-2 h-3 w-3" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {processingReports.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <TrendingUp className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Processing Reports</h3>
                <p className="text-gray-600">Reports currently being processed will appear here.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
