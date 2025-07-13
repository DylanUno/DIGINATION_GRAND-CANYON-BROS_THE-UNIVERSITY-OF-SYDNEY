"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Eye, RefreshCw, Clock, CheckCircle, AlertTriangle, Loader } from "lucide-react"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/client-auth"

interface QueueItem {
  id: string
  patientName: string
  patientId: string
  uploadTime: string
  status: string
  aiRiskLevel: string | null
  estimatedCompletion: string | null
  progress: number
}

async function fetchQueueData(): Promise<QueueItem[]> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return []
    }
    
    const response = await fetch('/api/health-worker/queue', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch queue data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching queue data:', error)
    return []
  }
}

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
  const [queueData, setQueueData] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function loadQueueData() {
      setLoading(true)
      const data = await fetchQueueData()
      setQueueData(data)
      setLoading(false)
    }
    
    loadQueueData()
  }, [])

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

  const handleRefresh = async () => {
    setLoading(true)
    const data = await fetchQueueData()
    setQueueData(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading queue data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Patient Analysis Queue</h1>
        <Button variant="outline" size="icon" onClick={handleRefresh}>
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
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                        No queue items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
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
                        <TableCell className="hidden lg:table-cell text-sm">
                          {item.estimatedCompletion || 'N/A'}
                        </TableCell>
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
                    ))
                  )}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
