"use client"

import { PatientBiodataForm } from "@/components/patient-biodata-form"
import { HeartPulse, Shield } from "lucide-react"
import Link from "next/link"

export default function PatientBiodataPage() {
  const handleFormSubmit = (data: any) => {
    console.log("Health profile completed:", data)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="feature-icon health">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-neutral-900">Complete Your Health Profile</h1>
          <p className="text-body text-neutral-600 mt-2 max-w-md">
            This information helps our healthcare workers and specialists provide you with the best possible care and
            early health detection.
          </p>
        </div>

        <div className="inline-flex items-center px-4 py-2 bg-health-teal/10 text-health-teal rounded-pill text-body-sm font-medium">
          <Shield className="w-4 h-4 mr-2" />
          Privacy Protected
        </div>
      </div>

      <PatientBiodataForm onSubmitSuccess={handleFormSubmit} />

      <div className="text-center">
        <p className="text-body-sm text-neutral-600">
          Already have an account?{" "}
          <Link href="/auth/login/patient" className="font-medium text-trust-blue hover:underline">
            Access your portal here
          </Link>
        </p>
      </div>
    </div>
  )
}
