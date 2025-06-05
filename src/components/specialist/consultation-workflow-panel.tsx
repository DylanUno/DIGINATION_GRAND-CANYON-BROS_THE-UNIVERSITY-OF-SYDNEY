import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilePlus, MessageSquare, Send, Share2, ShieldAlert } from "lucide-react"

const icd10Codes = [
  { code: "I10", description: "Essential (primary) hypertension" },
  { code: "R05", description: "Cough" },
  { code: "R06.0", description: "Dyspnea" },
  { code: "E11", description: "Type 2 diabetes mellitus" },
  { code: "J45", description: "Asthma" },
]

const treatmentTemplates = [
  "Advise lifestyle modifications (diet, exercise).",
  "Prescribe [Medication Name] [Dosage].",
  "Refer to cardiologist for further evaluation.",
  "Schedule follow-up appointment in [Timeframe].",
  "Recommend home monitoring of [Vital Sign].",
]

export function ConsultationWorkflowPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary flex items-center">
          <FilePlus className="mr-2 h-5 w-5" />
          Consultation & Recommendations
        </CardTitle>
        <CardDescription>Finalize your assessment and plan for the patient.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="specialist-notes" className="font-semibold text-gray-700">
            Specialist Notes & Observations
          </Label>
          <Textarea
            id="specialist-notes"
            placeholder="Enter your detailed notes, differential diagnosis, and rationale..."
            className="mt-1 min-h-[120px]"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="diagnosis-code" className="font-semibold text-gray-700">
              Diagnosis Code (ICD-10)
            </Label>
            <Select>
              <SelectTrigger id="diagnosis-code" className="mt-1">
                <SelectValue placeholder="Select ICD-10 code" />
              </SelectTrigger>
              <SelectContent>
                {icd10Codes.map((item) => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code} - {item.description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="treatment-template" className="font-semibold text-gray-700">
              Treatment Recommendation Templates
            </Label>
            <Select>
              <SelectTrigger id="treatment-template" className="mt-1">
                <SelectValue placeholder="Select a template or write custom" />
              </SelectTrigger>
              <SelectContent>
                {treatmentTemplates.map((template, index) => (
                  <SelectItem key={index} value={template}>
                    {template}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="custom-recommendations" className="font-semibold text-gray-700">
            Custom Treatment Plan & Patient Instructions
          </Label>
          <Textarea
            id="custom-recommendations"
            placeholder="Detail specific treatment plans, medication adjustments, lifestyle advice, and follow-up instructions for the patient..."
            className="mt-1 min-h-[100px]"
          />
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Common Actions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <Button variant="outline" size="sm">
              <FilePlus className="mr-2 h-4 w-4" /> Request Additional Tests
            </Button>
            <Button variant="outline" size="sm">
              <Send className="mr-2 h-4 w-4" /> Schedule Follow-up
            </Button>
            <Button variant="destructive" size="sm">
              <ShieldAlert className="mr-2 h-4 w-4" /> Refer to Emergency Care
            </Button>
            <Button variant="outline" size="sm">
              Routine Monitoring
            </Button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-700 mb-2">Communication</h4>
          <div className="flex gap-2">
            <Button className="flex-1 bg-brand-medical-green hover:bg-brand-medical-green/90 text-white">
              <MessageSquare className="mr-2 h-4 w-4" /> Send Secure Message to Patient
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="mr-2 h-4 w-4" /> Share Report with Rural Provider
            </Button>
          </div>
        </div>
        <div className="pt-4 border-t">
          <Button size="lg" className="w-full">
            Finalize & Submit Consultation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
