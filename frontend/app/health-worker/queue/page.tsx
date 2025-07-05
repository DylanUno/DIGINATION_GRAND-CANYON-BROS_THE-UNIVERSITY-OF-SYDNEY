"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Eye, RefreshCw, Clock, CheckCircle, AlertTriangle, Loader } from "lucide-react"
import Link from "next/link"

// Mock queue data
const queueData = [
  {
    id: "Q001",
    patientName: "John Doe",
    patientId: "P001",
    uploadTime: "2025-01-03 14:30",
    status: "Processing",
    aiRiskLevel: null,
    estimatedCompletion: "2025-01-03 15:00",
    progress: 65,
  },
  {
    id: "Q002",
    patientName: "Mary Smith",
    patientId: "P002",
    uploadTime: "2025-01-03 13:45",
    status: "Completed",
    aiRiskLevel: "Medium",
    estimatedCompletion: "2025-01-03 14:15",
    progress: 100,
  },
  {
    id: "Q003",
    patientName: "Robert Johnson",
    patientId: "P003",
    uploadTime: "2025-01-03 13:20",
    status: "Urgent Review",
    aiRiskLevel: "High",
    estimatedCompletion: "2025-01-03 13:50",
    progress: 100,
  },
  {
    id: "Q004",
    patientName: "Sarah Wilson",
    patientId: "P004",
    uploadTime: "2025-01-03 12:15",
    status: "Completed",
    aiRiskLevel: "Low",
    estimatedCompletion: "2025-01-03 12:45",
    progress: 100,
  },
  {
    id: "Q005",
    patientName: "Michael Brown",
    patientId: "P005",
    uploadTime: "2025-01-03 11:30",
    status: "Processing",
    aiRiskLevel: null,
    estimatedCompletion: "2025-01-03 12:00",
    progress: 25,
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Processing":
      return <Loader className="h-4 w-4 animate-spin text-blue-500" />
    case "Completed":
      return <CheckCircle className="h-4 w-4 text-brand-medical-green" />
    case "Urgent Review":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    default:
      return <Clock className="h-4 w-4 text-gray-500" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "Processing":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
          Processing
        </Badge>
      )
    case "Completed":
      return <Badge className="bg-brand-medical-green text-white">Completed</Badge>
    case "Urgent Review":
      return <Badge variant="destructive">Urgent Review</Badge>
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

const getRiskBadge = (riskLevel: string | null) => {
  if (!riskLevel) return <span className="text-gray-400">Pending</span>

  switch (riskLevel) {
    case "High":
      return <Badge variant="destructive">High Risk</Badge>
    case "Medium":
      return (
        <Badge variant="secondary" className="bg-orange-400 text-white">
          Medium Risk
        </Badge>
      )
    case "Low":
      return <Badge className="bg-brand-medical-green text-white">Low Risk</Badge>
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
        <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Patient Analysis Queue</h1>
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Queue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total in Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{queueData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{getTabCount("Processing")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brand-medical-green">{getTabCount("Completed")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Urgent Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{getTabCount("Urgent Review")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Management */}
      <Card>
        <CardHeader>
          <CardTitle>Analysis Queue</CardTitle>
          <CardDescription>Monitor and manage patient analysis requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">All ({queueData.length})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({getTabCount("Processing")})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({getTabCount("Completed")})</TabsTrigger>
                <TabsTrigger value="urgent">Urgent ({getTabCount("Urgent Review")})</TabsTrigger>
              </TabsList>

              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <TabsContent value={activeTab} className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Upload Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>AI Risk Level</TableHead>
                    <TableHead className="hidden lg:table-cell">Est. Completion</TableHead>
                    <TableHead className="hidden md:table-cell">Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.patientName}</div>
                          <div className="text-sm text-gray-500">{item.patientId}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{item.uploadTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(item.aiRiskLevel)}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{item.estimatedCompletion}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{item.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.status === "Completed" || item.status === "Urgent Review" ? (
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/health-worker/queue/${item.id}/results`}>
                              <Eye className="h-3 w-3 mr-1" />
                              View Results
                            </Link>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Processing...
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
