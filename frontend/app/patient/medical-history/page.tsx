"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  const [selectedReport, setSelectedReport] = useState<HealthReport | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<MedicalHistoryRecord | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

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

  const handleViewReport = (report: HealthReport) => {
    setSelectedReport(report)
    setShowReportModal(true)
  }

  const renderReportContent = (report: HealthReport) => {
    if (report.type === "summary" && report.title.includes("5-Modal Screening Report")) {
      // Find matching screening for vital signs data
      const matchingScreening = screeningHistory.find(s => 
        s.screening_date === report.screening_date
      )
      
      return (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">5-Modal Screening Summary</h3>
            <p className="text-gray-600 mb-4">Complete vital signs analysis and health assessment from your screening session.</p>
          </div>
          
          {matchingScreening && (
            <>
              <div>
                <h4 className="font-medium mb-2">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-4">
                  {matchingScreening.vital_signs.map((vital, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{vital.measurement_type.replace('_', ' ').toUpperCase()}</span>
                        <Badge variant={vital.status === 'normal' ? 'default' : 'secondary'}>
                          {vital.status}
                        </Badge>
                      </div>
                      <p className="text-lg font-semibold mt-1">{vital.value_text}</p>
                      <p className="text-xs text-gray-500">Normal: {vital.reference_range}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Overall Assessment</h4>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">{matchingScreening.overall_notes}</p>
                </div>
              </div>
            </>
          )}
          
          <div>
            <h4 className="font-medium mb-2">Health Worker Information</h4>
            <p className="text-sm text-gray-600">
              Conducted by: {report.screening_id ? `${screeningHistory.find(s => s.id === report.screening_id)?.health_worker_first_name} ${screeningHistory.find(s => s.id === report.screening_id)?.health_worker_last_name}` : 'Health Worker'}
            </p>
            <p className="text-sm text-gray-600">
              Facility: {report.screening_id ? screeningHistory.find(s => s.id === report.screening_id)?.facility_name : 'Health Center'}
            </p>
          </div>
        </div>
      )
    }
    
    if (report.type === "specialized" && report.title.includes("Detailed Analysis")) {
      return (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-3">Detailed Clinical Analysis</h3>
            <p className="text-gray-600 mb-4">In-depth analysis of your screening results with clinical insights and recommendations.</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">AI Clinical Findings</h4>
            <div className="space-y-2">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-yellow-800">Elevated respiratory rate</span>
                  <Badge variant="outline" className="text-xs">Pulmonology AI</Badge>
                </div>
                <p className="text-xs text-yellow-600">Confidence: 85%</p>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-sm font-medium text-blue-800">Fatigue pattern consistent with systemic stress</span>
                  <Badge variant="outline" className="text-xs">Internal Medicine AI</Badge>
                </div>
                <p className="text-xs text-blue-600">Confidence: 75%</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Risk Assessment</h4>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                Overall risk level: <span className="font-semibold">Low to Medium</span>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Regular monitoring recommended with follow-up in 2-4 weeks.
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                Continue current medication regimen as prescribed
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                Schedule follow-up appointment within 2-3 weeks
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full mt-2"></div>
                Monitor symptoms and report any worsening conditions
              </li>
            </ul>
          </div>
        </div>
      )
    }
    
    return (
      <div className="space-y-4">
        <p className="text-gray-600">{report.description}</p>
        <div>
          <h4 className="font-medium mb-2">Report Contents</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            {report.includes.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
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
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedRecord(record)
                        setShowDetailsModal(true)
                      }}
                    >
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
                  <Button size="sm" disabled>
                    <Download className="mr-2 h-3 w-3" />
                    Download PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                    <Eye className="mr-2 h-3 w-3" />
                    View Report
                  </Button>
                  <Button variant="outline" size="sm" disabled>
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

      {/* Report Modal */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedReport?.title}</DialogTitle>
            <DialogDescription>
              {selectedReport && `Generated on ${formatDate(selectedReport.generated_at)} • ${selectedReport.period_description}`}
            </DialogDescription>
          </DialogHeader>
          {selectedReport && renderReportContent(selectedReport)}
        </DialogContent>
      </Dialog>

      {/* Record Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Health Screening Details</DialogTitle>
            <DialogDescription>
              {selectedRecord && `Screening completed on ${formatDate(selectedRecord.screening_date)} at ${selectedRecord.facility_name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-6">
              {/* Screening Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Screening Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date</label>
                      <p className="text-sm font-medium">{formatDate(selectedRecord.screening_date)}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <Badge className={getStatusColor(selectedRecord.overall_status)}>
                        {selectedRecord.overall_status}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Health Worker</label>
                      <p className="text-sm font-medium">
                        {selectedRecord.health_worker_first_name} {selectedRecord.health_worker_last_name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Facility</label>
                      <p className="text-sm font-medium">{selectedRecord.facility_name}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Clinical Notes</label>
                    <p className="text-sm text-gray-700 mt-1">
                      {selectedRecord.overall_notes || 'Health screening completed successfully. All vital signs recorded.'}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Vital Signs Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Vital Signs Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedRecord.vital_signs.map((vital, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{vital.measurement_type}</h4>
                          <Badge className={getStatusColor(vital.status)}>
                            {vital.status}
                          </Badge>
                        </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {vital.value_text || `${vital.value_numeric} ${vital.unit}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Reference: {vital.reference_range}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  {selectedRecord.vital_signs.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No detailed vital signs data available for this screening.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
