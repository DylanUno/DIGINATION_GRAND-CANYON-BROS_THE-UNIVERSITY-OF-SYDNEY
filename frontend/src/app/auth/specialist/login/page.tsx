"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { HeartPulse } from "lucide-react"

export default function SpecialistLoginPage() {
  const router = useRouter()
  const [credentials, setCredentials] = useState("doctor123")
  const [password, setPassword] = useState("spec456")
  const [error, setError] = useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Hardcoded credentials check
    if (credentials === "doctor123" && password === "spec456") {
      // Simulate login success - redirect to specialist dashboard
      router.push("/specialist/dashboard")
    } else {
      setError("Invalid credentials. Try the default: doctor123 / spec456")
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-2">
        <HeartPulse className="h-10 w-10 text-primary" />
        <h1 className="text-2xl font-bold tracking-tight text-gray-800">Specialist Login</h1>
        <p className="text-sm text-gray-600">Access the specialist dashboard and patient queue.</p>
        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="credentials">Professional Credentials</Label>
          <Input 
            id="credentials" 
            type="text" 
            value={credentials}
            onChange={(e) => setCredentials(e.target.value)}
            placeholder="Your professional ID" 
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
      <p className="text-center text-sm text-muted-foreground">
        <span className="text-gray-600">Default login: </span>
        <span className="font-medium text-primary">doctor123 / spec456</span>
      </p>
      <p className="text-center text-sm text-gray-600">This is a secure portal for authorized medical specialists.</p>
    </div>
  )
}
