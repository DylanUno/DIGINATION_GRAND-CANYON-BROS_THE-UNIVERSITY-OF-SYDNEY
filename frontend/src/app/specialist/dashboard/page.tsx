"use client"

import Link from "next/link"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Filter,
  Search,
  Users,
  AlertOctagon,
  Clock,
  Heart,
  TrendingUp,
  BookOpen,
  GraduationCap,
  BarChart3,
  Activity,
  MapPin,
  Calendar,
} from "lucide-react"

// Mock data for patient queue
const patientQueue = [
  {
    id: "P001",
    initials: "J.D.",
    age: 45,
    gender: "Male",
    location: "Puskesmas Karimunjawa",
    submissionTime: "2025-01-03 09:15",
    riskLevel: "High",
    symptomSummary: "Chest pain, shortness of breath",
    priority: 1,
  },
  {
    id: "P002",
    initials: "A.S.",
    age: 62,
    gender: "Female",
    location: "Puskesmas Semarang Utara",
    submissionTime: "2025-01-03 08:30",
    riskLevel: "Medium",
    symptomSummary: "Fatigue, irregular heartbeat",
    priority: 2,
  },
  {
    id: "P003",
    initials: "R.B.",
    age: 33,
    gender: "Male",
    location: "Puskesmas Jepara",
    submissionTime: "2025-01-02 17:45",
    riskLevel: "Low",
    symptomSummary: "Routine check-up, mild headache",
    priority: 3,
  },
  {
    id: "P004",
    initials: "M.K.",
    age: 58,
    gender: "Female",
    location: "Puskesmas Kudus",
    submissionTime: "2025-01-02 16:20",
    riskLevel: "High",
    symptomSummary: "Severe chest pain, dizziness",
    priority: 1,
  },
  {
    id: "P005",
    initials: "T.W.",
    age: 29,
    gender: "Male",
    location: "Puskesmas Demak",
    submissionTime: "2025-01-02 14:10",
    riskLevel: "Medium",
    symptomSummary: "Palpitations, anxiety",
    priority: 2,
  },
]

const getRiskStatus = (riskLevel: string) => {
  if (riskLevel === "High") return "high-risk"
  if (riskLevel === "Medium") return "medium-risk"
  return "low-risk"
}

const getRiskColor = (riskLevel: string) => {
  if (riskLevel === "High") return "text-red-600"
  if (riskLevel === "Medium") return "text-orange-600"
  return "text-green-600"
}

export default function SpecialistDashboardPage() {
  const doctorName = "Dr. Emily Carter"
  const specialty = "Cardiology"
  const hospital = "Jakarta Heart Center"
  const totalCases = patientQueue.length
  const highPriorityCases = patientQueue.filter((p) => p.riskLevel === "High").length

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar - Patient Queue */}
      <div className="w-80 border-r border-neutral-200 bg-gradient-to-b from-neutral-50 to-white">
        <div className="p-4 border-b border-neutral-200">
          <h2 className="text-h2 font-semibold text-neutral-900 mb-2">Patient Queue</h2>
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-trust-blue border-trust-blue">
              {totalCases} Total Cases
            </Badge>
            <Badge variant="destructive">{highPriorityCases} High Priority</Badge>
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input type="search" placeholder="Search patients..." className="pl-10 h-10 text-sm" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="risk">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="risk">Sort by Risk</SelectItem>
                  <SelectItem value="time">Sort by Time</SelectItem>
                  <SelectItem value="location">Sort by Location</SelectItem>
                </SelectContent>
              </Select>
              <EnhancedButton variant="outline" size="sm">
                <Filter className="h-3 w-3" />
              </EnhancedButton>
            </div>
          </div>
        </div>

        {/* Patient List */}
        <div className="overflow-y-auto h-full">
          {patientQueue
            .sort((a, b) => a.priority - b.priority)
            .map((patient) => (
              <div
                key={patient.id}
                className="p-4 border-b border-neutral-100 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-body text-neutral-900">{patient.initials}</span>
                      <Badge variant="outline" className="text-xs">
                        {patient.age}y {patient.gender}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-neutral-500" />
                      <span className="text-xs text-neutral-600">{patient.location}</span>
                    </div>
                  </div>
                  <StatusIndicator
                    status={getRiskStatus(patient.riskLevel) as any}
                    label={patient.riskLevel}
                    showIcon={false}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-neutral-500" />
                    <span className="text-xs text-neutral-600">{patient.submissionTime}</span>
                  </div>
                  <p className="text-xs text-neutral-700 line-clamp-2">{patient.symptomSummary}</p>
                </div>

                <EnhancedButton
                  asChild
                  size="sm"
                  className="w-full mt-3"
                  variant={patient.riskLevel === "High" ? "destructive" : "outline"}
                >
                  <Link href={`/specialist/patient/${patient.id}`}>
                    {patient.riskLevel === "High" ? "Review Urgent" : "Review Case"}
                  </Link>
                </EnhancedButton>
              </div>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-blue-50">
          <h1 className="text-display font-bold text-neutral-900">
            {doctorName}, {specialty}
          </h1>
          <p className="text-body-lg text-neutral-600 mt-1">{hospital}</p>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-trust-blue" />
              <span className="text-body text-neutral-700">{totalCases} cases in queue</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-4 w-4 text-red-500" />
              <span className="text-body text-neutral-700">{highPriorityCases} high-priority cases</span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Advanced Analytics Panel */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-trust-blue" />
                Advanced Analytics Panel
              </CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Population health insights, AI performance metrics, and clinical research dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-3">
                {/* Population Health Insights */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-neutral-900 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-health-teal" />
                    Population Health Insights
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-h2 font-bold text-trust-blue">23%</div>
                      <p className="text-body-sm text-neutral-600">Hypertension prevalence increase</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-h2 font-bold text-health-teal">87%</div>
                      <p className="text-body-sm text-neutral-600">Early detection success rate</p>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="text-h2 font-bold text-alert-orange">15</div>
                      <p className="text-body-sm text-neutral-600">High-risk cases this week</p>
                    </div>
                  </div>
                </div>

                {/* AI Performance Metrics */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-neutral-900 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-calm-purple" />
                    AI Performance Metrics
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-h2 font-bold text-calm-purple">96.3%</div>
                      <p className="text-body-sm text-neutral-600">AI-Specialist Agreement</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-h2 font-bold text-trust-blue">3.2 min</div>
                      <p className="text-body-sm text-neutral-600">Average analysis time</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-h2 font-bold text-health-teal">99.1%</div>
                      <p className="text-body-sm text-neutral-600">System accuracy rate</p>
                    </div>
                  </div>
                </div>

                {/* Clinical Research Dashboard */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-neutral-900 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-record-pink" />
                    Clinical Research Dashboard
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-pink-50 rounded-lg border border-pink-200">
                      <div className="text-h2 font-bold text-record-pink">2,847</div>
                      <p className="text-body-sm text-neutral-600">Cases contributed to research</p>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="text-h2 font-bold text-warm-amber">12</div>
                      <p className="text-body-sm text-neutral-600">Active research studies</p>
                    </div>
                    <div className="p-3 bg-teal-50 rounded-lg border border-teal-200">
                      <div className="text-h2 font-bold text-health-teal">5</div>
                      <p className="text-body-sm text-neutral-600">Publications this year</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Participation */}
              <div className="mt-6 p-4 bg-gradient-to-r from-trust-blue/10 to-calm-purple/10 rounded-lg border border-trust-blue/20">
                <h4 className="font-semibold text-h3 text-neutral-900 mb-2">Active Research Participation</h4>
                <p className="text-body text-neutral-600 mb-3">
                  Your anonymized case reviews contribute to advancing cardiovascular AI research and improving rural
                  healthcare outcomes.
                </p>
                <EnhancedButton variant="outline" size="sm">
                  View Research Impact
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>

          {/* Professional Development */}
          <Card className="shadow-soft border-neutral-200">
            <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
              <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-calm-purple" />
                Professional Development
              </CardTitle>
              <CardDescription className="text-body text-neutral-600">
                Continuing education, peer consultation network, and clinical guidelines
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Continuing Education */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-neutral-900 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-trust-blue" />
                    Continuing Education
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-medium text-body text-neutral-900 mb-1">
                        Advanced ECG Interpretation in Rural Settings
                      </h4>
                      <p className="text-body-sm text-neutral-600 mb-2">CME Credits: 4.5 | Duration: 3 hours</p>
                      <EnhancedButton size="sm" variant="outline">
                        Start Course
                      </EnhancedButton>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-medium text-body text-neutral-900 mb-1">
                        AI-Assisted Diagnosis: Best Practices
                      </h4>
                      <p className="text-body-sm text-neutral-600 mb-2">CME Credits: 2.0 | Duration: 1.5 hours</p>
                      <EnhancedButton size="sm" variant="outline">
                        Continue Course
                      </EnhancedButton>
                    </div>
                  </div>
                </div>

                {/* Peer Consultation & Guidelines */}
                <div className="space-y-4">
                  <h3 className="text-h3 font-semibold text-neutral-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-health-teal" />
                    Peer Consultation Network
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <h4 className="font-medium text-body text-neutral-900 mb-1">Cardiology Specialist Network</h4>
                      <p className="text-body-sm text-neutral-600 mb-2">
                        47 specialists online | 3 pending consultations
                      </p>
                      <EnhancedButton size="sm" variant="outline">
                        Join Discussion
                      </EnhancedButton>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-medium text-body text-neutral-900 mb-1">Clinical Guidelines Database</h4>
                      <p className="text-body-sm text-neutral-600 mb-2">Latest AHA/ESC guidelines | Updated weekly</p>
                      <EnhancedButton size="sm" variant="outline">
                        Access Guidelines
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-6 flex flex-wrap gap-3">
                <EnhancedButton variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Peer Review
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Access Medical Library
                </EnhancedButton>
                <EnhancedButton variant="outline" size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Join Case Discussion
                </EnhancedButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
