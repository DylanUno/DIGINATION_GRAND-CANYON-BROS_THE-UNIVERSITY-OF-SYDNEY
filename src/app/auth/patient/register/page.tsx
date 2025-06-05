import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HeartPulse } from "lucide-react"

export default function PatientRegisterPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Patient Registration</h1>
        <p className="text-sm text-gray-600">Create your account to start your health analysis.</p>
      </div>
      {/* Form will be more detailed as per spec, this is a placeholder */}
      <div className="text-center py-8">
        <p className="text-gray-700 mb-4">Patient registration form with biodata collection will be here.</p>
        <Button asChild className="w-full bg-brand-medical-green hover:bg-brand-medical-green/90">
          <Link href="/auth/patient/register/biodata">Proceed to Biodata Form</Link>
        </Button>
      </div>
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/auth/patient/login" className="font-medium text-primary hover:underline">
          Login here
        </Link>
      </p>
    </div>
  )
}
