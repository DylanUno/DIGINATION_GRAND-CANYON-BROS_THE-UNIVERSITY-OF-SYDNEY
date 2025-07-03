import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Lightbulb, ListChecks } from "lucide-react"

// Placeholder data
const aiAssessment = {
  overallRisk: "Medium",
  confidenceScore: 85, // Percentage
  clinicalFindings: [
    { finding: "Elevated resting pulse rate", severity: "Moderate" },
    { finding: "Slight decrease in HRV (SDNN)", severity: "Mild" },
    { finding: "Occasional ectopic beats on PPG (needs ECG confirmation)", severity: "Moderate" },
  ],
  preliminarySuggestions: [
    { suggestion: "Consider 24-hour Holter monitoring for arrhythmia assessment.", confidence: 70 },
    { suggestion: "Lifestyle modification advice for stress and activity levels.", confidence: 90 },
  ],
  monitoringRecommendations: "Follow-up in 2 weeks. Advise patient to monitor symptoms and report any worsening.",
  followUpTimeframe: "2 weeks",
}

const getRiskColor = (risk: string) => {
  if (risk === "High") return "text-red-600 bg-red-100 border-red-500"
  if (risk === "Medium") return "text-orange-600 bg-orange-100 border-orange-500"
  return "text-brand-medical-green bg-green-100 border-green-500"
}

const getSeverityBadge = (severity: string) => {
  if (severity === "High") return "destructive"
  if (severity === "Moderate") return "secondary" // Orange-like
  return "default" // Mild - green
}

export function AiAssessmentPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center">
          <Lightbulb className="mr-2 h-5 w-5" />
          AI Assessment & Insights
        </CardTitle>
        <CardDescription>
          Automated analysis and preliminary findings based on submitted data for specialist review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-4 rounded-lg border ${getRiskColor(aiAssessment.overallRisk)}`}>
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold">Overall Risk Assessment</h4>
            {aiAssessment.overallRisk === "High" && <AlertTriangle className="h-6 w-6" />}
            {aiAssessment.overallRisk === "Medium" && <AlertTriangle className="h-6 w-6" />}
            {aiAssessment.overallRisk === "Low" && <CheckCircle className="h-6 w-6" />}
          </div>
          <p className="text-3xl font-bold mt-1">{aiAssessment.overallRisk} Risk</p>
          <p className="text-sm">Confidence Score: {aiAssessment.confidenceScore}%</p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <ListChecks className="mr-2 h-5 w-5 text-primary" />
            AI-Identified Clinical Findings
          </h4>
          <ul className="space-y-2">
            {aiAssessment.clinicalFindings.map((item, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">{item.finding}</span>
                  <Badge
                    variant={getSeverityBadge(item.severity)}
                    className={
                      item.severity === "Mild"
                        ? "bg-brand-medical-green text-white"
                        : item.severity === "Moderate"
                          ? "bg-orange-400 text-white"
                          : ""
                    }
                  >
                    {item.severity}
                  </Badge>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-primary" />
            Preliminary Diagnostic Suggestions
          </h4>
          <ul className="space-y-2">
            {aiAssessment.preliminarySuggestions.map((item, index) => (
              <li key={index} className="p-3 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-sm text-gray-700">{item.suggestion}</p>
                <p className="text-xs text-muted-foreground">Confidence: {item.confidence}%</p>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-1 flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-primary" />
            Monitoring Recommendations
          </h4>
          <p className="text-sm text-gray-600 p-3 bg-blue-50 border border-blue-200 rounded-md">
            {aiAssessment.monitoringRecommendations} (Follow-up in: {aiAssessment.followUpTimeframe})
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
