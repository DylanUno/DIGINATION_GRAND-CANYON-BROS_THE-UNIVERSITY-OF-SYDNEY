import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, User, Phone, MapPin, Calendar, Weight, Ruler, Heart, Eye } from "lucide-react"
import Link from "next/link"

// Mock patient data - in real app, this would be fetched based on params.id
const patientData = {
  id: "P001",
  name: "John Doe",
  dateOfBirth: "1979-03-15",
  age: 45,
  gender: "Male",
  phone: "+1 (555) 123-4567",
  address: "123 Health St, Wellness City, HC 12345",
  emergencyContact: {
    name: "Jane Doe",
    phone: "+1 (555) 123-4568",
    relationship: "Spouse",
  },
  medicalInfo: {
    weight: 75,
    height: 175,
    bmi: 24.5,
    bloodType: "O+",
    allergies: ["Penicillin", "Shellfish"],
    conditions: ["Hypertension", "Type 2 Diabetes"],
  },
  registrationDate: "2024-01-15",
  lastVisit: "2025-01-02",
}

const medicalHistory = [
  {
    date: "2025-01-02",
    type: "Routine Check-up",
    notes: "Blood pressure slightly elevated. Medication adjusted.",
    provider: "Dr. Sarah Johnson",
  },
  {
    date: "2024-11-15",
    type: "Follow-up",
    notes: "Diabetes management review. HbA1c levels improved.",
    provider: "Dr. Sarah Johnson",
  },
  {
    date: "2024-08-20",
    type: "Emergency Visit",
    notes: "Chest pain evaluation. ECG normal, stress-related.",
    provider: "Dr. Michael Chen",
  },
]

const analysisHistory = [
  {
    id: "A001",
    date: "2025-01-02",
    time: "14:30",
    riskLevel: "Medium",
    status: "Completed",
    findings: "Elevated blood pressure, irregular heart rhythm detected",
  },
  {
    id: "A002",
    date: "2024-11-15",
    time: "10:15",
    riskLevel: "Low",
    status: "Completed",
    findings: "All vital signs within normal range",
  },
  {
    id: "A003",
    date: "2024-08-20",
    time: "16:45",
    riskLevel: "High",
    status: "Completed",
    findings: "Significant cardiac irregularities, immediate specialist referral",
  },
]

const getRiskBadge = (riskLevel: string) => {
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

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/health-worker/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">{patientData.name}</h1>
          <p className="text-gray-600">Patient ID: {patientData.id}</p>
        </div>
        <Button asChild className="bg-brand-medical-green hover:bg-brand-medical-green/90">
          <Link href={`/health-worker/upload?patient=${patientData.id}`}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Data
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg">{patientData.name}</h3>
              <p className="text-gray-600">
                {patientData.age} years old • {patientData.gender}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>Born: {patientData.dateOfBirth}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{patientData.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span>{patientData.address}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Medical Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <Weight className="h-3 w-3 text-gray-500" />
                  <span>{patientData.medicalInfo.weight} kg</span>
                </div>
                <div className="flex items-center gap-1">
                  <Ruler className="h-3 w-3 text-gray-500" />
                  <span>{patientData.medicalInfo.height} cm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3 text-gray-500" />
                  <span>BMI: {patientData.medicalInfo.bmi}</span>
                </div>
                <div className="text-xs text-gray-600">Blood: {patientData.medicalInfo.bloodType}</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Emergency Contact</h4>
              <div className="text-sm space-y-1">
                <p className="font-medium">{patientData.emergencyContact.name}</p>
                <p className="text-gray-600">{patientData.emergencyContact.relationship}</p>
                <p className="text-gray-600">{patientData.emergencyContact.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Conditions & Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions & Allergies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium text-sm mb-2">Known Conditions</h4>
                  <div className="space-y-1">
                    {patientData.medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="mr-1">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Allergies</h4>
                  <div className="space-y-1">
                    {patientData.medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="mr-1">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Medical History Timeline</CardTitle>
              <CardDescription>Past visits and medical events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicalHistory.map((event, index) => (
                  <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">{event.type}</h4>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{event.notes}</p>
                      <p className="text-xs text-gray-500">Provider: {event.provider}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis History</CardTitle>
              <CardDescription>Past health assessments and results</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Key Findings</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisHistory.map((analysis) => (
                    <TableRow key={analysis.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{analysis.date}</div>
                          <div className="text-sm text-gray-500">{analysis.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getRiskBadge(analysis.riskLevel)}</TableCell>
                      <TableCell>
                        <Badge className="bg-brand-medical-green text-white">{analysis.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-sm truncate">{analysis.findings}</p>
                      </TableCell>
                      <TableCell>
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/health-worker/queue/${analysis.id}/results`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 