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
      id: "1",
      date: "2025-05-28",
      riskLevel: "Medium",
      summary: "Slight irregularities detected in heart rate variability.",
    },
    { id: "2", date: "2025-04-15", riskLevel: "Low", summary: "All vital signs within normal parameters." },
    {
      id: "3",
      date: "2025-03-01",
      riskLevel: "High",
      summary: "Significant concerns in respiratory patterns, specialist review completed.",
    },
  ]

  const getRiskStatus = (riskLevel: string) => {
    if (riskLevel === "High") return "high-risk"
    if (riskLevel === "Medium") return "medium-risk"
    return "low-risk"
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
      <div>
        <h1 className="text-display font-bold text-neutral-900">Screening History</h1>
        <p className="text-body-lg text-neutral-600 mt-2">
          Review your past health assessments and AI analysis results.
        </p>
      </div>

      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Your Health Screenings</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Track your health journey and see how your vital signs and risk assessments have changed over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-6 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer transition-all shadow-soft"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-h3 text-neutral-900">Screening Date: {analysis.date}</p>
                        <StatusIndicator
                          status={getRiskStatus(analysis.riskLevel) as any}
                          label={`${analysis.riskLevel} Risk`}
                          showIcon={false}
                        />
                      </div>
                      <p className="text-body text-neutral-600">{analysis.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-body text-neutral-500">
                No screening history found. Start your first health assessment today!
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
