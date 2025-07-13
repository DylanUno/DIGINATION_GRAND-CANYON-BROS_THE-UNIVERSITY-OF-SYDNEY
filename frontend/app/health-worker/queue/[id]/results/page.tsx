"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share, AlertTriangle, CheckCircle, Heart, Activity } from "lucide-react"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/client-auth"

interface AnalysisResults {
  id: string
  patientName: string
  patientId: string
  analysisDate: string
  analysisTime: string
  overallRisk: string
  confidence: number
  vitalSigns: any
  aiFindings: Array<{
    category: string
    finding: string
    severity: string
    confidence: number
  }>
  recommendations: string[]
  specialistNotes: string
}

async function fetchAnalysisResults(analysisId: string): Promise<AnalysisResults | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    // For now, return a "not implemented" message as this would require complex analysis data structure
    // In a real implementation, this would fetch from analysis_results or similar table
    return null
  } catch (error) {
    console.error('Error fetching analysis results:', error)
    return null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "normal":
      return "text-brand-medical-green"
    case "elevated":
    case "high":
      return "text-red-500"
    case "low":
      return "text-blue-500"
    default:
      return "text-gray-500"
  }
}

const getSeverityBadge = (severity: string) => {
  switch (severity) {
    case "Normal":
      return <Badge className="bg-brand-medical-green text-white">Normal</Badge>
    case "Mild":
      return (
        <Badge variant="secondary" className="bg-yellow-400 text-white">
          Mild
        </Badge>
      )
    case "Moderate":
      return (
        <Badge variant="secondary" className="bg-orange-400 text-white">
          Moderate
        </Badge>
      )
    case "Severe":
      return <Badge variant="destructive">Severe</Badge>
    default:
      return <Badge variant="outline">{severity}</Badge>
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "text-red-600 bg-red-100 border-red-500"
    case "Medium":
      return "text-orange-600 bg-orange-100 border-orange-500"
    case "Low":
      return "text-green-600 bg-green-100 border-green-500"
    default:
      return "text-gray-600 bg-gray-100 border-gray-500"
  }
}

export default function AnalysisResultsPage({ params }: { params: { id: string } }) {
  const [analysisResults, setAnalysisResults] = useState<AnalysisResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalysisResults() {
      setLoading(true)
      setError(null)
      const data = await fetchAnalysisResults(params.id)
      if (data) {
        setAnalysisResults(data)
      } else {
        setError('Analysis results not available yet. This feature requires the analysis system to be fully implemented.')
      }
      setLoading(false)
    }
    
    loadAnalysisResults()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  if (error || !analysisResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/health-worker/queue">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Analysis Results</h1>
            <p className="text-gray-600">Analysis ID: {params.id}</p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Analysis Results Not Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {error || 'The detailed analysis results feature is not yet available. This would typically show:'}
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
              <li>Comprehensive vital signs analysis</li>
              <li>AI-powered risk assessment</li>
              <li>Clinical findings and recommendations</li>
              <li>Specialist consultation notes</li>
              <li>Downloadable reports</li>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              This feature requires the full analysis pipeline to be implemented with the medical AI systems.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // This would be the full analysis results display when implemented
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/health-worker/queue">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Analysis Results</h1>
          <p className="text-gray-600">
            {analysisResults.patientName} ({analysisResults.patientId}) • {analysisResults.analysisDate} at{" "}
            {analysisResults.analysisTime}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Implementation would continue here with real data */}
    </div>
  )
}
