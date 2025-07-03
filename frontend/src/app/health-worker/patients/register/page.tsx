"use client"

import { PatientRegistrationForm } from "@/components/health-worker/patient-registration-form"
import { ArrowLeft, Users, Shield, LinkIcon } from "lucide-react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function PatientRegistrationPage() {
  const handleFormSubmit = (data: any) => {
    console.log("Patient registered:", data)
    // In a real app, you might redirect to the patient's profile page
    // router.push(`/health-worker/patients/${newPatientId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <EnhancedButton asChild variant="outline" size="icon">
          <Link href="/health-worker/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </EnhancedButton>
        <div>
          <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Register New Patient</h1>
          <p className="text-gray-600">Add a new patient to the health center system</p>
        </div>
      </div>

      {/* Advanced Registration Features */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-health-teal" />
              Family Health Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-neutral-600 mb-3">
              Link family members to create comprehensive family health records and track hereditary conditions.
            </p>
            <EnhancedButton size="sm" variant="outline" className="w-full">
              <LinkIcon className="h-4 w-4 mr-2" />
              Link Family Members
            </EnhancedButton>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-health-teal" />
              BPJS Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-neutral-600 mb-3">
              Automatically integrate with national health insurance (BPJS) for seamless coverage verification.
            </p>
            <EnhancedButton size="sm" variant="outline" className="w-full">
              Verify BPJS Status
            </EnhancedButton>
          </CardContent>
        </Card>

        <Card className="shadow-soft border-neutral-200">
          <CardHeader>
            <CardTitle className="text-h3 text-neutral-900">Social Determinants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-neutral-600 mb-3">
              Track social determinants of health including housing, education, and economic factors (optional).
            </p>
            <EnhancedButton size="sm" variant="outline" className="w-full">
              Add Social Data
            </EnhancedButton>
          </CardContent>
        </Card>
      </div>

      <PatientRegistrationForm onSubmitSuccess={handleFormSubmit} />

      {/* Account Creation & Consent */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900">Account Creation & Consent</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-body text-neutral-900 mb-2">Patient Login Creation</h4>
            <p className="text-body-sm text-neutral-600 mb-3">
              Create a secure patient login with SMS verification for accessing health records and results.
            </p>
            <EnhancedButton size="sm" variant="outline">
              Send SMS Verification
            </EnhancedButton>
          </div>

          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-body text-neutral-900 mb-2">Data Usage & Privacy Consent</h4>
            <p className="text-body-sm text-neutral-600 mb-3">
              Capture patient consent for data usage, research participation, and privacy preferences.
            </p>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-body-sm text-neutral-700">Consent to health data processing</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-body-sm text-neutral-700">Allow anonymized data for research</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-neutral-300" />
                <span className="text-body-sm text-neutral-700">Receive health education materials</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 