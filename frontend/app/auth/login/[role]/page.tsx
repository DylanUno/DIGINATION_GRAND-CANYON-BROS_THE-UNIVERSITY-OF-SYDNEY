"use client"

import { useState, use } from "react"
import { useRouter } from "next/navigation"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HeartPulse, Shield } from "lucide-react"
import Link from "next/link"

// Database authentication function
async function authenticateUser(role: string, identifier: string, password: string) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, identifier, password })
    })
    
    if (response.ok) {
      const data = await response.json()
      return { success: true, user: data.user }
    } else {
      const error = await response.json()
      return { success: false, error: error.message || 'Authentication failed' }
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    return { success: false, error: 'Unable to connect to authentication service' }
  }
}

const roleConfig = {
  "health-worker": {
    title: "Health Worker Portal",
    description: "Access your community health center dashboard and patient management tools.",
    fields: [
      { id: "identifier", label: "Email or Phone", type: "text", placeholder: "maria@puskesmas.com or +6281234567890" },
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
      { id: "identifier", label: "Email Address", type: "email", placeholder: "dr.sarah@hospital.com" },
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
      { id: "identifier", label: "Phone Number", type: "tel", placeholder: "+6281987654321" },
      { id: "password", label: "Password", type: "password" },
    ],
    redirectPath: "/patient/dashboard",
    badge: "Community Health",
    showLicenseStatus: false,
  },
}

export default function RoleLoginPage({ params }: { params: Promise<{ role: string }> }) {
  const [formData, setFormData] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  
  const { role } = use(params)
  const config = roleConfig[role as keyof typeof roleConfig]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Get the identifier based on role
      let identifier = ""
      if (role === "health-worker") {
        identifier = formData.identifier || ""
      } else if (role === "specialist") {
        identifier = formData.identifier || ""
      } else if (role === "patient") {
        identifier = formData.identifier || ""
      }

      const result = await authenticateUser(role, identifier, formData.password || "")

      if (result.success) {
        // Store authentication state with the actual user ID from database
        localStorage.setItem('userRole', role)
        localStorage.setItem('userId', result.user.id.toString()) // ✅ Use actual database user ID
        localStorage.setItem('isAuthenticated', 'true')
        
        router.push(config.redirectPath)
      } else {
        setError(result.error || "Login failed")
      }
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }))
  }

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

      <form onSubmit={handleSubmit} className="space-y-4">
        {config.fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-body font-medium text-neutral-700">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              required
              className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
            />
          </div>
        ))}

        {error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <EnhancedButton type="submit" size="full" className="mt-6" disabled={loading}>
          {loading ? "Authenticating..." : "Access Portal"}
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
