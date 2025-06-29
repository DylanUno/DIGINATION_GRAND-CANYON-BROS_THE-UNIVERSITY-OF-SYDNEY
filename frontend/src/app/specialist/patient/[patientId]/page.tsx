"use client" // Needed for params and potentially client-side interactions in panels

import { PatientInfoPanel } from "@/components/specialist/patient-info-panel"
import { VitalSignsPanel } from "@/components/specialist/vital-signs-panel"
import { DataVisualizationPanel } from "@/components/specialist/data-visualization-panel"
import { AiAssessmentPanel } from "@/components/specialist/ai-assessment-panel"
import { ConsultationWorkflowPanel } from "@/components/specialist/consultation-workflow-panel"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// In a real app, you'd fetch patient data based on params.patientId
// For now, we'll use a placeholder or assume components fetch their own data if needed.
// This page component itself might not need to know the full patient object,
// but the child components would. For simplicity, we'll assume the components
// can function with placeholder data or would be adapted to take an ID.

export default function SpecialistPatientDetailPage({ params }: { params: { patientId: string } }) {
  // You would use params.patientId to fetch specific patient data
  // For example: const patient = await getPatientById(params.patientId);

  if (!params.patientId) {
    // Or if patient data fetch fails
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-xl text-muted-foreground">Patient data not found.</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/specialist/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 md:text-3xl">
          Patient Analysis: <span className="text-primary">{params.patientId}</span>
        </h1>
        <Button asChild variant="outline">
          <Link href="/specialist/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* 
        The ScrollArea can wrap the entire content if it's expected to be very long,
        or individual panels can manage their own scrolling if they are independent.
        For a cohesive single-scroll experience for the whole detail page:
      */}
      <ScrollArea className="h-[calc(100vh-180px)]">
        {/* Adjust height based on header/footer */}
        <div className="space-y-6 pr-4">
          {/* Added pr-4 for scrollbar spacing */}
          <PatientInfoPanel /> {/* These components would ideally take patientId or fetched patientData as props */}
          <VitalSignsPanel />
          <AiAssessmentPanel />
          <DataVisualizationPanel />
          <ConsultationWorkflowPanel />
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  )
}
