"use client"

import { PatientBiodataForm } from "@/components/patient-biodata-form"
import { HeartPulse } from "lucide-react"
import Link from "next/link"

export default function PatientBiodataPage() {
  const handleFormSubmit = (data: any) => {
    // In a real app, you might redirect or perform other actions
    console.log("Biodata form submitted, redirecting (simulated)...", data)
    // router.push('/patient/dashboard'); // Example redirect using Next.js router
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2 text-center">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Complete Your Profile</h1>
        <p className="text-sm text-gray-600 max-w-sm">
          Please provide your biodata. This information is crucial for accurate health analysis and specialist
          consultations.
        </p>
      </div>
      <PatientBiodataForm onSubmitSuccess={handleFormSubmit} />
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link href="/auth/patient/login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  )
}
