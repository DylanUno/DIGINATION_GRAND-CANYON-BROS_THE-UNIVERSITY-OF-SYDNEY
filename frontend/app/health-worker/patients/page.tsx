"use client"

import { useState, useEffect } from "react"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Search, UserPlus, Eye, Upload, Users } from "lucide-react"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/client-auth"

interface Patient {
  patient_id: string
  full_name: string
  date_of_birth: string
  gender: string
  phone_number: string
  last_screening_date?: string | null
  status: string
  age: number
}

async function fetchPatients(): Promise<Patient[]> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return []
    }
    
    const response = await fetch('/api/health-worker/patients-list', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch patients')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching patients:', error)
    return []
  }
}

const getStatusIndicator = (status: string) => {
  switch (status) {
    case "Active":
      return <StatusIndicator status="completed" label="Active" showIcon={false} />
    case "Pending Review":
      return <StatusIndicator status="processing" label="Pending Review" showIcon={false} />
    case "Inactive":
      return <StatusIndicator status="urgent" label="Inactive" showIcon={false} />
    default:
      return <StatusIndicator status="completed" label={status} showIcon={false} />
  }
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPatients() {
      setLoading(true)
      
      // Check if user is authenticated
      const userId = getCurrentUserId()
      if (!userId) {
        console.error('No user ID found, redirecting to login')
        window.location.href = '/auth/login/health-worker'
        return
      }
      
      const patientsData = await fetchPatients()
      setPatients(patientsData)
      setLoading(false)
    }
    
    loadPatients()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading patients...</p>
        </div>
      </div>
    )
  }

  if (patients.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load patients</p>
          <p className="text-gray-600 mb-4">This might be due to authentication issues.</p>
          <div className="space-y-2">
            <EnhancedButton onClick={() => window.location.reload()} className="mr-2">
              Try Again
            </EnhancedButton>
            <EnhancedButton 
              variant="outline" 
              onClick={() => window.location.href = '/auth/login/health-worker'}
            >
              Go to Login
            </EnhancedButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display font-bold text-neutral-900">Patient Management</h1>
          <p className="text-body-lg text-neutral-600 mt-2">Manage community health records and patient information</p>
        </div>
        <EnhancedButton asChild className="bg-health-teal hover:bg-teal-600">
          <Link href="/health-worker/patients/register">
            <UserPlus className="mr-2 h-4 w-4" />
            Register New Patient
          </Link>
        </EnhancedButton>
      </div>

      <Card className="shadow-soft border-neutral-200">
        <CardHeader className="bg-gradient-to-r from-neutral-50 to-blue-50">
          <CardTitle className="text-h2 text-neutral-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-health-teal" />
            Patient Search & Management
          </CardTitle>
          <CardDescription className="text-body text-neutral-600">
            Find and manage patient records in your community
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-500" />
              <Input
                type="search"
                placeholder="Search by name, phone, or patient ID..."
                className="pl-10 h-12 rounded-lg border-neutral-300 focus:border-trust-blue focus:ring-trust-blue"
              />
            </div>
            <EnhancedButton variant="outline">Filter</EnhancedButton>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-body font-medium text-neutral-700">Patient ID</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Full Name</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Age</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Gender</TableHead>
                <TableHead className="hidden md:table-cell text-body font-medium text-neutral-700">Phone</TableHead>
                <TableHead className="hidden lg:table-cell text-body font-medium text-neutral-700">
                  Last Visit
                </TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Status</TableHead>
                <TableHead className="text-body font-medium text-neutral-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient: Patient) => (
                <TableRow key={patient.patient_id} className="hover:bg-neutral-50">
                  <TableCell className="font-medium text-body text-neutral-900">{patient.patient_id}</TableCell>
                  <TableCell className="text-body text-neutral-900">{patient.full_name}</TableCell>
                  <TableCell className="text-body text-neutral-700">{patient.age}</TableCell>
                  <TableCell className="text-body text-neutral-700">{patient.gender}</TableCell>
                  <TableCell className="hidden md:table-cell text-body text-neutral-700">{patient.phone_number}</TableCell>
                  <TableCell className="hidden lg:table-cell text-body text-neutral-700">
                    {patient.last_screening_date || 'Never'}
                  </TableCell>
                  <TableCell>{getStatusIndicator(patient.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <EnhancedButton asChild size="sm" variant="outline">
                        <Link href={`/health-worker/patients/${patient.patient_id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Link>
                      </EnhancedButton>
                      <EnhancedButton asChild size="sm" variant="outline">
                        <Link href={`/health-worker/upload?patient=${patient.patient_id}`}>
                          <Upload className="h-3 w-3 mr-1" />
                          Upload
                        </Link>
                      </EnhancedButton>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
