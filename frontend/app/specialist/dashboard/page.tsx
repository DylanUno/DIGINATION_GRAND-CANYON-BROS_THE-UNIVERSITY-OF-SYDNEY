"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  AlertTriangle,
  Clock,
  Filter,
  Search,
  MapPin,
  Calendar,
  Activity,
  User,
  Stethoscope,
  TrendingUp,
} from "lucide-react"

// Mock data
const specialistInfo = {
  name: "Dr. Sarah Johnson",
  specialty: "Cardiology",
  hospital: "Jakarta Heart Center",
}

const queueStats = {
  totalCases: 24,
  highPriorityCases: 6,
  averageReviewTime: 12,
}

const patientQueue = [
  {
    id: "P001",
    initials: "J.D.",
    age: 45,
    gender: "Male",
    location: "Puskesmas Karimunjawa",
    submissionTime: "09:15",
    riskLevel: "High",
    symptoms: "Chest pain, shortness of breath",
    waitTime: "2h 15m",
  },
  {
    id: "P002",
    initials: "M.S.",
    age: 62,
    gender: "Female",
    location: "Puskesmas Semarang Utara",
    submissionTime: "09:30",
    riskLevel: "High",
    symptoms: "Irregular heartbeat, dizziness",
    waitTime: "2h 00m",
  },
  {
    id: "P003",
    initials: "A.R.",
    age: 38,
    gender: "Male",
    location: "Puskesmas Demak",
    submissionTime: "10:00",
    riskLevel: "Medium",
    symptoms: "Fatigue, mild chest discomfort",
    waitTime: "1h 30m",
  },
  {
    id: "P004",
    initials: "L.W.",
    age: 55,
    gender: "Female",
    location: "Puskesmas Kudus",
    submissionTime: "10:15",
    riskLevel: "Medium",
    symptoms: "Palpitations, anxiety",
    waitTime: "1h 15m",
  },
  {
    id: "P005",
    initials: "R.H.",
    age: 29,
    gender: "Male",
    location: "Puskesmas Jepara",
    submissionTime: "10:45",
    riskLevel: "Low",
    symptoms: "Routine check-up, mild hypertension",
    waitTime: "45m",
  },
]

const getRiskBadge = (risk: string) => {
  switch (risk) {
    case "High":
      return <Badge variant="destructive">High Risk</Badge>
    case "Medium":
      return <Badge className="bg-orange-500 text-white">Medium Risk</Badge>
    case "Low":
      return <Badge className="bg-green-500 text-white">Low Risk</Badge>
    default:
      return <Badge variant="outline">{risk}</Badge>
  }
}

export default function SpecialistDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white">
      {/* Header */}
      <div className="border-b border-neutral-200 bg-white/95 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 flex items-center gap-2">
              <Stethoscope className="h-6 w-6 text-blue-600" />
              {specialistInfo.name}, {specialistInfo.specialty}
            </h1>
            <p className="text-neutral-600">{specialistInfo.hospital}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-neutral-600">Current Queue Status</p>
              <p className="text-lg font-semibold text-neutral-900">
                {queueStats.totalCases} cases • {queueStats.highPriorityCases} high-priority
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Total Cases Today</p>
                  <p className="text-3xl font-bold text-blue-600">{queueStats.totalCases}</p>
                </div>
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">High-Priority Cases</p>
                  <p className="text-3xl font-bold text-red-600">{queueStats.highPriorityCases}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-600">Average Review Time</p>
                  <p className="text-3xl font-bold text-green-600">
                    {queueStats.averageReviewTime} <span className="text-lg font-normal text-neutral-600">min</span>
                  </p>
                </div>
                <Clock className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Filters */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              Quick Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[300px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                  <Input placeholder="Search patients by initials, location, or symptoms..." className="pl-10" />
                </div>
              </div>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Cases" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cases</SelectItem>
                  <SelectItem value="high-risk">High-Risk Only</SelectItem>
                  <SelectItem value="medium-risk">Medium-Risk Only</SelectItem>
                  <SelectItem value="low-risk">Low-Risk Only</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="karimunjawa">Puskesmas Karimunjawa</SelectItem>
                  <SelectItem value="semarang">Puskesmas Semarang Utara</SelectItem>
                  <SelectItem value="demak">Puskesmas Demak</SelectItem>
                  <SelectItem value="kudus">Puskesmas Kudus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patient Queue - Now with Fixed Alignment */}
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="h-6 w-6 text-orange-600" />
              Patient Queue - Priority Sorted
            </CardTitle>
            <CardDescription>
              Patients awaiting specialist review, sorted by risk level and submission time
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-3 bg-neutral-100 rounded-lg font-medium text-sm text-neutral-700 mb-4">
              <div className="col-span-2">Patient</div>
              <div className="col-span-1">Age</div>
              <div className="col-span-1">Gender</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-1">Time</div>
              <div className="col-span-1">Waiting</div>
              <div className="col-span-2">Risk Level</div>
              <div className="col-span-1">Action</div>
            </div>

            {/* Patient Rows */}
            <div className="space-y-2">
              {patientQueue.map((patient) => (
                <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Patient */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-neutral-500" />
                          <span className="font-semibold text-neutral-900">{patient.initials}</span>
                        </div>
                        <p className="text-xs text-neutral-600 mt-1 line-clamp-1">{patient.symptoms}</p>
                      </div>

                      {/* Age */}
                      <div className="col-span-1">
                        <span className="text-sm text-neutral-700">{patient.age}y</span>
                      </div>

                      {/* Gender */}
                      <div className="col-span-1">
                        <span className="text-sm text-neutral-700">{patient.gender}</span>
                      </div>

                      {/* Location */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-neutral-500" />
                          <span className="text-sm text-neutral-700">{patient.location}</span>
                        </div>
                      </div>

                      {/* Time */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-neutral-500" />
                          <span className="text-sm text-neutral-700">{patient.submissionTime}</span>
                        </div>
                      </div>

                      {/* Waiting Time */}
                      <div className="col-span-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-neutral-500" />
                          <span className="text-sm text-neutral-700">{patient.waitTime}</span>
                        </div>
                      </div>

                      {/* Risk Level */}
                      <div className="col-span-2">{getRiskBadge(patient.riskLevel)}</div>

                      {/* Action */}
                      <div className="col-span-1">
                        <EnhancedButton size="sm" className="w-full">
                          Review
                        </EnhancedButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-l-4 border-l-teal-500">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Quick Actions & System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <EnhancedButton className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Emergency Cases</div>
                  <div className="text-sm opacity-80">View critical patients requiring immediate attention</div>
                </div>
              </EnhancedButton>
              <EnhancedButton variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Case Statistics</div>
                  <div className="text-sm opacity-80">Review daily and weekly performance metrics</div>
                </div>
              </EnhancedButton>
              <EnhancedButton variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">System Notifications</div>
                  <div className="text-sm opacity-80">Check system updates and announcements</div>
                </div>
              </EnhancedButton>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
