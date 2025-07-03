import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import {
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Search,
  Eye,
  Bell,
  Calendar,
  TrendingUp,
  Shield,
  Activity,
  Target,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

// Mock data
const stats = {
  patientsProcessed: 24,
  pendingReviews: 8,
  urgentCases: 3,
  averageProcessingTime: "12 minutes",
}

const patientQueue = [
  {
    id: "P001",
    name: "John Doe",
    time: "09:15",
    status: "Results Ready",
    riskLevel: "Medium",
  },
  {
    id: "P002",
    name: "Mary Smith",
    time: "09:30",
    status: "Specialist Review",
    riskLevel: "High",
  },
  {
    id: "P003",
    name: "Robert Johnson",
    time: "10:00",
    status: "AI Analyzing",
    riskLevel: "Low",
  },
  {
    id: "P004",
    name: "Sarah Wilson",
    time: "10:15",
    status: "Data Uploaded",
    riskLevel: "Medium",
  },
]

const urgentAlerts = [
  { type: "High-risk case", message: "Patient P002 requires immediate attention", time: "10 mins ago" },
  { type: "Results ready", message: "3 patients ready for notification", time: "25 mins ago" },
  { type: "System update", message: "AI model updated - improved accuracy", time: "1 hour ago" },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Results Ready":
      return "completed"
    case "Specialist Review":
      return "processing"
    case "AI Analyzing":
      return "processing"
    case "Data Uploaded":
      return "urgent"
    default:
      return "completed"
  }
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case "High":
      return "high-risk"
    case "Medium":
      return "medium-risk"
    case "Low":
      return "low-risk"
    default:
      return "completed"
  }
}

export default function HealthWorkerDashboard() {
  const staffName = "Dr. Sarah Johnson"
  const puskesmasLocation = "Karimunjawa"
  const currentTime = new Date().getHours()
  const greeting = currentTime < 12 ? "Good Morning" : currentTime < 17 ? "Good Afternoon" : "Good Evening"

  return (
    <div className="space-y-6">
      {/* Daily Overview */}
      <div className="bg-gradient-to-r from-health-teal/10 to-blue-50 rounded-xl p-6 border border-health-teal/20">
        <h1 className="text-display font-bold text-neutral-900">
          {greeting}, {staffName} - Puskesmas {puskesmasLocation}
        </h1>
        <p className="text-body-lg text-neutral-600 mt-2">
          Today:{" "}
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Today's Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-body font-medium text-neutral-700">Patients Processed</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{stats.patientsProcessed}</div>
            <p className="text-body-sm text-neutral-500">Today</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-body font-medium text-neutral-700">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-status-processing" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-status-processing">{stats.pendingReviews}</div>
            <p className="text-body-sm text-neutral-500">Awaiting specialist</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-body font-medium text-neutral-700">Urgent Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-status-urgent" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-status-urgent">{stats.urgentCases}</div>
            <p className="text-body-sm text-neutral-500">Require attention</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-body font-medium text-neutral-700">Avg Processing Time</CardTitle>
            <Activity className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-h1 font-bold text-trust-blue">{stats.averageProcessingTime}</div>
            <p className="text-body-sm text-neutral-500">Per patient</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <EnhancedButton asChild size="xl" className="bg-health-teal hover:bg-teal-600 flex-shrink-0">
              <Link href="/health-worker/patients/register">
                <UserPlus className="h-6 w-6 mr-2" />
                Register New Patient
              </Link>
            </EnhancedButton>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                placeholder="Search existing patient by name or ID..."
                className="pl-10 h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <EnhancedButton asChild variant="outline" size="lg" className="flex-shrink-0">
              <Link href="/health-worker/queue">View Today's Queue</Link>
            </EnhancedButton>
          </div>
        </CardContent>
      </Card>

      {/* Patient Queue Management Table */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h2 text-neutral-900">Patient Queue Management</CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Real-time status of today's patient processing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-body font-medium text-neutral-700">Patient Name</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Time</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Status</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Risk Level</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientQueue.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-neutral-50">
                  <TableCell className="font-medium text-body text-neutral-900">{patient.name}</TableCell>
                  <TableCell className="text-body text-neutral-700">{patient.time}</TableCell>
                  <TableCell>
                    <StatusIndicator
                      status={getStatusColor(patient.status) as any}
                      label={patient.status}
                      showIcon={false}
                    />
                  </TableCell>
                  <TableCell>
                    <StatusIndicator
                      status={getRiskColor(patient.riskLevel) as any}
                      label={`${patient.riskLevel} Risk`}
                      showIcon={false}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EnhancedButton size="sm" variant="outline">
                        <Eye className="h-3 w-3 mr-1" />
                        View Results
                      </EnhancedButton>
                      <EnhancedButton size="sm" variant="outline">
                        <Bell className="h-3 w-3 mr-1" />
                        Notify Patient
                      </EnhancedButton>
                      <EnhancedButton size="sm" variant="outline">
                        <Calendar className="h-3 w-3 mr-1" />
                        Schedule Follow-up
                      </EnhancedButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Urgent Alerts Panel */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-urgent" />
              Urgent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {urgentAlerts.map((alert, index) => (
              <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="font-medium text-body text-neutral-900">{alert.type}</p>
                    <p className="text-body-sm text-neutral-600">{alert.message}</p>
                    <p className="text-body-sm text-neutral-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quality Assurance Panel */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-health-teal" />
              Quality Assurance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Metrics</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-neutral-600">Data Quality Score</span>
                  <span className="text-body-sm font-medium text-health-teal">96.3%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-body-sm text-neutral-600">AI-Specialist Agreement</span>
                  <span className="text-body-sm font-medium text-health-teal">94.7%</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Status</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-health-teal" />
                  <span className="text-body-sm text-neutral-600">Equipment calibrated</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-alert-orange" />
                  <span className="text-body-sm text-neutral-600">Training update due next week</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Population Health Panel */}
        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-health-teal" />
              Population Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Trends</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-trust-blue" />
                  <span className="text-body-sm text-neutral-600">Hypertension cases +15% this month</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-alert-orange" />
                  <span className="text-body-sm text-neutral-600">Respiratory symptoms increasing</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Planning</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-health-teal" />
                  <span className="text-body-sm text-neutral-600">Peak hours: 9-11 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-trust-blue" />
                  <span className="text-body-sm text-neutral-600">Optimal staffing: 3 workers</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 