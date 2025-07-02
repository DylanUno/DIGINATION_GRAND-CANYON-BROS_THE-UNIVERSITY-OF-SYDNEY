import { EnhancedButton } from "@/components/ui/enhanced-button"
import { HeartPulse, Users } from "lucide-react"
import Link from "next/link"

export default function PatientRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="feature-icon health">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-neutral-900">Join Our Community</h1>
          <p className="text-body text-neutral-600 mt-2">
            Create your account to access community health screenings and connect with healthcare specialists.
          </p>
        </div>

        <div className="inline-flex items-center px-4 py-2 bg-health-teal/10 text-health-teal rounded-pill text-body-sm font-medium">
          <Users className="w-4 h-4 mr-2" />
          Community Health Access
        </div>
      </div>

      <div className="text-center py-8 space-y-6">
        <div className="p-6 bg-gradient-to-br from-neutral-50 to-blue-50 rounded-xl border border-neutral-200">
          <h3 className="text-h3 font-semibold text-neutral-900 mb-2">Complete Health Profile</h3>
          <p className="text-body text-neutral-600 mb-4">
            We'll collect your basic health information to provide personalized care and connect you with the right
            specialists when needed.
          </p>
        </div>

        <EnhancedButton asChild size="full" className="bg-health-teal hover:bg-teal-600">
          <Link href="/auth/patient/register/biodata">Continue to Health Profile</Link>
        </EnhancedButton>
      </div>

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
