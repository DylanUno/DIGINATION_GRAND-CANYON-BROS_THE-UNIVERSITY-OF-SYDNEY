import { StatusIndicator } from "@/components/ui/status-indicator"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartPulse, Shield } from "lucide-react"
import Link from "next/link"

const roleConfig = {
  "health-worker": {
    title: "Health Worker Portal",
    description: "Access your community health center dashboard and patient management tools.",
    fields: [
      { id: "email", label: "Email or Phone", type: "text", placeholder: "worker@healthcenter.com" },
      { id: "password", label: "Password", type: "password" },
    ],
    redirectPath: "/health-worker/dashboard",
    badge: "Community Service",
    showLicenseStatus: false,
  },
  specialist: {
    title: "Specialist Medical Portal",
    description: "Access the specialist dashboard and provide expert medical consultations remotely.",
    fields: [
      { id: "credentials", label: "Professional Credentials", type: "text", placeholder: "Your professional ID" },
      { id: "password", label: "Password", type: "password" },
    ],
    redirectPath: "/specialist/dashboard",
    showLicenseStatus: true,
    badge: "Medical Professional",
  },
  patient: {
    title: "Patient Access Portal",
    description: "Access your health dashboard and screening history.",
    fields: [
      { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 123-4567" },
      { id: "password", label: "Password", type: "password" },
    ],
    redirectPath: "/patient/dashboard",
    badge: "Community Health",
    showLicenseStatus: false,
  },
}

export default async function RoleLoginPage({ params }: { params: Promise<{ role: string }> }) {
  const { role } = await params
  const config = roleConfig[role as keyof typeof roleConfig]

  if (!config) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-blue-50 p-4">
        <Card className="w-full max-w-md shadow-strong">
          <CardHeader className="text-center">
            <CardTitle className="text-risk-high">Invalid Access Type</CardTitle>
            <CardDescription>The requested portal does not exist.</CardDescription>
          </CardHeader>
          <CardContent>
            <EnhancedButton asChild size="full">
              <Link href="/">Return to Home</Link>
            </EnhancedButton>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="feature-icon health">
          <HeartPulse className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-h1 font-bold tracking-tight text-neutral-900">{config.title}</h1>
          <p className="text-body text-neutral-600 mt-2">{config.description}</p>
        </div>

        <div className="inline-flex items-center px-4 py-2 bg-health-teal/10 text-health-teal rounded-pill text-body-sm font-medium">
          <Shield className="w-4 h-4 mr-2" />
          {config.badge}
        </div>

        {config.showLicenseStatus && (
          <StatusIndicator status="completed" label="Medical License Verified" icon={Shield} className="mt-2" />
        )}
      </div>

      <form className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-body font-medium text-neutral-700">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              required
              className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
            />
          </div>
        ))}

        <EnhancedButton type="submit" size="full" className="mt-6">
          Access Portal
        </EnhancedButton>
      </form>

      <div className="text-center">
        <Link href="/" className="text-body-sm text-trust-blue hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}
