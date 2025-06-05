import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CalendarDays, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function PatientDashboardPage() {
  // Placeholder data
  const patientName = "Jane Doe"
  const lastAnalysisDate = "2025-05-28"
  const lastAnalysisRiskLevel = "Medium" // Could be "Low", "Medium", "High"
  const riskLevelColor =
    lastAnalysisRiskLevel === "High"
      ? "text-red-500"
      : lastAnalysisRiskLevel === "Medium"
        ? "text-orange-500"
        : "text-brand-medical-green"

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Welcome, {patientName}!</h1>
        <Button asChild size="lg" className="bg-brand-medical-green hover:bg-brand-medical-green/90">
          <Link href="/patient/new-analysis">Start New Analysis</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Analysis Date</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{lastAnalysisDate || "N/A"}</div>
            <p className="text-xs text-muted-foreground">Date of your most recent health assessment.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Analysis Risk Level</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lastAnalysisRiskLevel ? riskLevelColor : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lastAnalysisRiskLevel ? riskLevelColor : "text-gray-700"}`}>
              {lastAnalysisRiskLevel || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">AI-assessed risk from your last analysis.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">5</div> {/* Placeholder */}
            <p className="text-xs text-muted-foreground">
              <Link href="/patient/analysis-history" className="text-primary hover:underline">
                View history
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/patient/profile-settings"
            className="block p-6 bg-brand-light-gray rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-primary">Update Profile</h3>
            <p className="text-sm text-gray-600">Keep your medical information up to date.</p>
          </Link>
          <Link
            href="/patient/help"
            className="block p-6 bg-brand-light-gray rounded-lg hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-primary">Get Help</h3>
            <p className="text-sm text-gray-600">Find instructions and support.</p>
          </Link>
        </div>
      </div>
    </>
  )
}
