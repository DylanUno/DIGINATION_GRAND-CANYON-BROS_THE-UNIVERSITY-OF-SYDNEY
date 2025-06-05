import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AnalysisHistoryPage() {
  const analyses = [
    { id: "1", date: "2025-05-28", riskLevel: "Medium", summary: "Slight irregularities detected in HRV." },
    { id: "2", date: "2025-04-15", riskLevel: "Low", summary: "All vital signs within normal parameters." },
    {
      id: "3",
      date: "2025-03-01",
      riskLevel: "High",
      summary: "Significant concerns in respiratory patterns, specialist review advised.",
    },
  ]

  const getRiskBadgeVariant = (riskLevel: string) => {
    if (riskLevel === "High") return "destructive"
    if (riskLevel === "Medium") return "secondary" // Using secondary for orange-like
    return "default" // Using default for green (Low)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold md:text-3xl text-gray-800 mb-6">Analysis History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Past Analyses</CardTitle>
          <CardDescription>Review details and results from your previous health assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          {analyses.length > 0 ? (
            <div className="space-y-4">
              {analyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className="p-4 border rounded-lg flex justify-between items-center hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <p className="font-semibold text-gray-700">Analysis Date: {analysis.date}</p>
                    <p className="text-sm text-gray-600">{analysis.summary}</p>
                  </div>
                  <Badge
                    variant={getRiskBadgeVariant(analysis.riskLevel)}
                    className={
                      analysis.riskLevel === "Low"
                        ? "bg-brand-medical-green text-white"
                        : analysis.riskLevel === "Medium"
                          ? "bg-orange-400 text-white"
                          : ""
                    }
                  >
                    {analysis.riskLevel} Risk
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No analysis history found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
