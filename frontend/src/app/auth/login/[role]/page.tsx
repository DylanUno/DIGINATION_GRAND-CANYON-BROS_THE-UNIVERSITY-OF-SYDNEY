"use client"

import { useState } from "react"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HeartPulse, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type RoleType = "health-worker" | "specialist" | "patient"

// Hardcoded credentials for development
const CREDENTIALS: Record<RoleType, { username: string; password: string }> = {
  "health-worker": { username: "worker@puskesmas.com", password: "worker123" },
  specialist: { username: "doctor@hospital.com", password: "doctor123" },
  patient: { username: "patient@example.com", password: "patient123" },
}

type RoleConfigType = {
  title: string;
  description: string;
  fields: Array<{
    id: string;
    label: string;
    type: string;
    placeholder?: string;
  }>;
  redirectPath: string;
  badge: string;
  showLicenseStatus?: boolean;
}

const roleConfig: Record<RoleType, RoleConfigType> = {
  "health-worker": {
    title: "Health Worker Portal",
    description: "Access your community health center dashboard and patient management tools.",
    fields: [
      { id: "email", label: "Email or Phone", type: "text", placeholder: "worker@healthcenter.com" },
      { id: "password", label: "Password", type: "password" },
    ],
    redirectPath: "/health-worker/dashboard",
    badge: "Community Service",
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
  },
}

export default function RoleLoginPage({ params }: { params: { role: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const [error, setError] = useState("")
  const role = params.role as RoleType
  const config = roleConfig[role]

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // For development, display the expected credentials in console
    console.log(`Expected credentials for ${role}:`, CREDENTIALS[role])
    
    const validCredentials = CREDENTIALS[role]
    
    if (formData.username === validCredentials.username && 
        formData.password === validCredentials.password) {
      // Success! Redirect to appropriate dashboard
      router.push(config.redirectPath)
    } else {
      // Show error
      setError("Invalid credentials. Please try again.")
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="username" className="text-body font-medium text-neutral-700">
            {config.fields[0].label}
          </Label>
          <Input
            id="username"
            name="username"
            type={config.fields[0].type}
            placeholder={config.fields[0].placeholder}
            required
            value={formData.username}
            onChange={handleChange}
            className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-body font-medium text-neutral-700">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
            value={formData.password}
            onChange={handleChange}
            className="h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
          />
        </div>

        {/* Development credential info */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-sm">
          <p><strong>Development Credentials:</strong></p>
          <p>Username: {CREDENTIALS[role].username}</p>
          <p>Password: {CREDENTIALS[role].password}</p>
        </div>

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