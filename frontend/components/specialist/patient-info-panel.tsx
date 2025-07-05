import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

// Placeholder data for a selected patient
const patientData = {
  id: "P001",
  name: "Johnathan Doe",
  age: 45,
  gender: "Male",
  dob: "1979-03-15",
  contact: "john.doe@example.com | (555) 123-4567",
  address: "123 Health St, Wellness City, HC 12345",
  medicalHistory: [
    "Hypertension (diagnosed 2015)",
    "Type 2 Diabetes (diagnosed 2018, diet-controlled)",
    "Seasonal Allergies",
  ],
  currentMedications: ["Lisinopril 10mg daily", "Metformin 500mg twice daily"],
  allergies: ["Penicillin (rash)"],
  chiefComplaint: "Persistent cough and occasional shortness of breath for the past 2 weeks.",
  currentSymptoms: ["Cough", "Shortness of breath", "Fatigue"],
  lastConsultation: "2024-11-20: Routine check-up, stable.",
  previousAnalyses: [
    { date: "2025-03-10", risk: "Low", summary: "Routine vitals check" },
    { date: "2024-09-05", risk: "Low", summary: "Post-flu recovery check" },
  ],
}

export function PatientInfoPanel() {
  if (!patientData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Patient Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a patient from the queue to view their details.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl text-primary">{patientData.name}</CardTitle>
            <CardDescription>Patient ID: {patientData.id}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm">
            {patientData.age} y.o. {patientData.gender}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Contact & Demographics</h4>
          <p className="text-sm text-gray-600">
            <strong>DOB:</strong> {patientData.dob}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Contact:</strong> {patientData.contact}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Address:</strong> {patientData.address}
          </p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Chief Complaint</h4>
          <p className="text-sm text-gray-600 bg-amber-50 p-3 rounded-md">{patientData.chiefComplaint}</p>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Current Symptoms</h4>
          <div className="flex flex-wrap gap-2">
            {patientData.currentSymptoms.map((symptom) => (
              <Badge key={symptom} variant="outline">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Medical History</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {patientData.medicalHistory.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Current Medications</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {patientData.currentMedications.map((med) => (
              <li key={med}>{med}</li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Allergies</h4>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            {patientData.allergies.map((allergy) => (
              <li key={allergy} className="text-red-600">
                {allergy}
              </li>
            ))}
          </ul>
        </div>
        <Separator />
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-700">Consultation & Analysis Timeline</h4>
          <p className="text-sm text-gray-600">
            <strong>Last Consultation:</strong> {patientData.lastConsultation}
          </p>
          {patientData.previousAnalyses.length > 0 && (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 mt-1">
              {patientData.previousAnalyses.map((analysis) => (
                <li key={analysis.date}>
                  {analysis.date} - Risk: {analysis.risk} ({analysis.summary})
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
