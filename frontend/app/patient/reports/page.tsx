"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, FileText, TrendingUp, Activity, Heart, Droplets, Eye, Share2 } from "lucide-react"

const healthReports = [
  {
    id: 1,
    title: "Comprehensive Health Report",
    type: "summary",
    date: "2024-01-15",
    period: "Last 6 Months",
    status: "ready",
    size: "2.4 MB",
    pages: 12,
    description: "Complete overview of your health metrics, test results, and recommendations.",
    includes: ["Blood work analysis", "Vital signs trends", "Risk assessments", "Doctor recommendations"],
  },
  {
    id: 2,
    title: "Cardiovascular Health Report",
    type: "specialized",
    date: "2024-01-08",
    period: "Last 3 Months",
    status: "ready",
    size: "1.8 MB",
    pages: 8,
    description: "Detailed analysis of your heart health including ECG results and blood pressure trends.",
    includes: ["ECG analysis", "Blood pressure monitoring", "Heart rate variability", "Risk factors"],
  },
  {
    id: 3,
    title: "Blood Work Analysis",
    type: "laboratory",
    date: "2024-01-01",
    period: "Latest Results",
    status: "ready",
    size: "1.2 MB",
    pages: 6,
    description: "Complete blood panel results with reference ranges and trend analysis.",
    includes: ["Complete blood count", "Metabolic panel", "Lipid profile", "Glucose levels"],
  },
  {
    id: 4,
    title: "Monthly Health Summary",
    type: "summary",
    date: "2023-12-31",
    period: "December 2023",
    status: "processing",
    size: "Generating...",
    pages: "Est. 10",
    description: "Monthly compilation of your health data and progress tracking.",
    includes: ["Daily vitals", "Activity summary", "Medication adherence", "Health goals progress"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "ready":
      return "bg-green-100 text-green-800"
    case "processing":
      return "bg-yellow-100 text-yellow-800"
    case "error":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "summary":
      return <FileText className="h-5 w-5 text-blue-500" />
    case "specialized":
      return <Heart className="h-5 w-5 text-red-500" />
    case "laboratory":
      return <Droplets className="h-5 w-5 text-purple-500" />
    default:
      return <Activity className="h-5 w-5 text-gray-500" />
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
      return "General Report"
  }
}

export default function ReportsPage() {
  const readyReports = healthReports.filter((report) => report.status === "ready")
  const processingReports = healthReports.filter((report) => report.status === "processing")

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Health Reports</h1>
          <p className="text-gray-600 mt-2">Download and share your comprehensive health reports</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Report
          </Button>
          <Button size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="available" className="space-y-6">
        <TabsList>
          <TabsTrigger value="available">Available Reports ({readyReports.length})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({processingReports.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {readyReports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getTypeIcon(report.type)}
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{report.period}</span>
                        <span>•</span>
                        <span>Generated {report.date}</span>
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
                        <span className="font-medium">{report.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pages:</span>
                        <span className="font-medium">{report.pages}</span>
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
                        <span>{report.period}</span>
                        <span>•</span>
                        <span>Processing since {report.date}</span>
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
        </TabsContent>
      </Tabs>

      {healthReports.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Available</h3>
            <p className="text-gray-600 mb-4">Your health reports will appear here once your tests are processed.</p>
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Your First Test
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
