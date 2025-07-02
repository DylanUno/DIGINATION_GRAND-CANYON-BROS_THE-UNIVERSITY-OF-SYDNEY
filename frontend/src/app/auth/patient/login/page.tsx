"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HeartPulse } from "lucide-react"

export default function PatientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("patient@example.com")
  const [password, setPassword] = useState("password123")
  const [error, setError] = useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Hardcoded credentials check
    if (email === "patient@example.com" && password === "password123") {
      // Simulate login success - redirect to patient dashboard
      router.push("/patient/dashboard")
    } else {
      setError("Invalid credentials. Try the default: patient@example.com / password123")
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Patient Login</h1>
        <p className="text-sm text-gray-600">Access your health dashboard and analysis history.</p>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="patient@example.com" 
            required 
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/auth/patient/register" className="font-medium text-primary hover:underline">
          Register here
        </Link>
      </p>
    </div>
  )
}
