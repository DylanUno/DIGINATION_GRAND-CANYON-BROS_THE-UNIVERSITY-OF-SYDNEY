"use client"

import { PatientRegistrationForm } from "@/components/health-worker/patient-registration-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { PatientRegistrationFormValues } from "@/lib/schemas/patient-registration-schema"

export default function PatientRegistrationPage() {
  const router = useRouter()

  const handleSubmitSuccess = (data: PatientRegistrationFormValues) => {
    // In a real app, this would make an API call to save the patient
    console.log("Patient registered successfully:", data)
    
    // Redirect to patient list or dashboard after successful registration
    setTimeout(() => {
      router.push("/health-worker/patients")
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <EnhancedButton asChild variant="outline" size="sm">
          <Link href="/health-worker/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </EnhancedButton>
        <div>
          <h1 className="text-display font-bold text-neutral-900">Register New Patient</h1>
          <p className="text-body text-neutral-600">Add a new patient to the system for health screening</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-gradient-to-r from-health-teal/5 to-blue-50/50 rounded-xl p-6 border border-health-teal/10">
        <div className="flex items-center gap-3 mb-4">
          <div className="feature-icon health w-10 h-10">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-h2 font-semibold text-neutral-900">Patient Information</h2>
            <p className="text-body-sm text-neutral-600">Please fill in all required fields to register the patient</p>
          </div>
        </div>

        <PatientRegistrationForm onSubmitSuccess={handleSubmitSuccess} />
      </div>

      {/* Help Information */}
      <Card className="shadow-soft border-neutral-200">
        <CardHeader>
          <CardTitle className="text-h3 text-neutral-900">Registration Guidelines</CardTitle>
          <CardDescription>Important information for patient registration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Required Information</h4>
              <ul className="text-body-sm text-neutral-600 space-y-1">
                <li>• Full name and date of birth</li>
                <li>• Valid phone number for notifications</li>
                <li>• Complete address for location tracking</li>
                <li>• Emergency contact information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-body text-neutral-900 mb-2">Medical Information</h4>
              <ul className="text-body-sm text-neutral-600 space-y-1">
                <li>• Weight and height for BMI calculation</li>
                <li>• Known medical conditions and allergies</li>
                <li>• Information helps with AI analysis accuracy</li>
                <li>• All medical data is kept confidential</li>
              </ul>
            </div>
          </div>
          <div className="pt-4 border-t border-neutral-200">
            <p className="text-body-sm text-neutral-500">
              <strong>Privacy Notice:</strong> All patient information is encrypted and stored securely in compliance with healthcare data protection regulations. Only authorized healthcare personnel can access this information.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 