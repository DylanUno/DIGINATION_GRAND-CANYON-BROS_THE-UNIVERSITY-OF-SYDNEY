"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, FileText, Download, Eye, Activity, Heart, Thermometer, Droplets } from "lucide-react"

const medicalHistory = [
  {
    id: 1,
    date: "2024-01-15",
    time: "10:30 AM",
    type: "Blood Test",
    doctor: "Dr. Sarah Johnson",
    facility: "Central Medical Lab",
    status: "completed",
    results: {
      hemoglobin: "14.2 g/dL",
      glucose: "95 mg/dL",
      cholesterol: "180 mg/dL",
    },
    notes: "All values within normal range. Continue current medication.",
  },
  {
    id: 2,
    date: "2024-01-08",
    time: "2:15 PM",
    type: "ECG Analysis",
    doctor: "Dr. Michael Chen",
    facility: "Heart Care Center",
    status: "completed",
    results: {
      heartRate: "72 bpm",
      rhythm: "Normal Sinus",
      intervals: "Normal",
    },
    notes: "Normal cardiac function. No abnormalities detected.",
  },
  {
    id: 3,
    date: "2023-12-20",
    time: "9:45 AM",
    type: "X-Ray Chest",
    doctor: "Dr. Emily Rodriguez",
    facility: "Imaging Center",
    status: "completed",
    results: {
      lungs: "Clear",
      heart: "Normal size",
      bones: "No fractures",
    },
    notes: "Chest X-ray shows no acute abnormalities.",
  },
  {
    id: 4,
    date: "2023-12-10",
    time: "11:20 AM",
    type: "Blood Pressure",
    doctor: "Dr. James Wilson",
    facility: "Primary Care Clinic",
    status: "completed",
    results: {
      systolic: "118 mmHg",
      diastolic: "76 mmHg",
      pulse: "68 bpm",
    },
    notes: "Blood pressure within optimal range.",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getTypeIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "blood test":
      return <Droplets className="h-4 w-4 text-red-500" />
    case "ecg analysis":
      return <Heart className="h-4 w-4 text-blue-500" />
    case "x-ray chest":
      return <Activity className="h-4 w-4 text-purple-500" />
    case "blood pressure":
      return <Thermometer className="h-4 w-4 text-orange-500" />
    default:
      return <FileText className="h-4 w-4 text-gray-500" />
  }
}

export default function MedicalHistoryPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Medical History</h1>
          <p className="text-gray-600 mt-2">Complete record of your medical tests and consultations</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export History
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Filter by Date
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {medicalHistory.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(record.type)}
                  <div>
                    <CardTitle className="text-lg">{record.type}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {record.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {record.time}
                      </span>
                    </CardDescription>
                  </div>
                </div>
                <Badge className={getStatusColor(record.status)}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Healthcare Provider</h4>
                  <p className="text-sm text-gray-600">{record.doctor}</p>
                  <p className="text-sm text-gray-500">{record.facility}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Test Results</h4>
                  <div className="space-y-1">
                    {Object.entries(record.results).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                <p className="text-sm text-gray-600">{record.notes}</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-3 w-3" />
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-3 w-3" />
                  Download Report
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {medicalHistory.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Medical History</h3>
            <p className="text-gray-600">Your medical history will appear here once you complete your first test.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
