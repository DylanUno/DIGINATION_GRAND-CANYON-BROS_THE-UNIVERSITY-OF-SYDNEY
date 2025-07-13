"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Upload, User, Phone, MapPin, Calendar, Weight, Ruler, Heart, Eye } from "lucide-react"
import Link from "next/link"
import { getCurrentUserId } from "@/lib/client-auth"

interface PatientData {
  id: string
  name: string
  dateOfBirth: string | null
  age: number
  gender: string
  phone: string
  email: string
  address: string
  village: string
  city: string
  province: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
  medicalInfo: {
    weight: number
    height: number
    bmi: number | null
    bloodType: string | null
    allergies: string[]
    conditions: string[]
  }
  registrationDate: string
  lastVisit: string | null
  healthCenterName: string
  medicalHistory: Array<{
    date: string
    type: string
    notes: string
    provider: string
  }>
  analysisHistory: Array<{
    id: string
    date: string
    time: string
    riskLevel: string
    status: string
    findings: string
  }>
}

async function fetchPatientData(patientId: string): Promise<PatientData | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    const response = await fetch(`/api/health-worker/patient/${patientId}`, {
      headers: {
        'x-user-id': userId
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch patient data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching patient data:', error)
    return null
  }
}

const getRiskBadge = (riskLevel: string) => {
  switch (riskLevel) {
    case "High":
      return <Badge variant="destructive">High Risk</Badge>
    case "Medium":
      return (
        <Badge variant="secondary" className="bg-orange-400 text-white">
          Medium Risk
        </Badge>
      )
    case "Low":
      return <Badge className="bg-brand-medical-green text-white">Low Risk</Badge>
    default:
      return <Badge variant="outline">{riskLevel}</Badge>
  }
}

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [patientData, setPatientData] = useState<PatientData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [patientId, setPatientId] = useState<string>('')

  useEffect(() => {
    // Unwrap the params promise
    async function unwrapParams() {
      const unwrappedParams = await params
      setPatientId(unwrappedParams.id)
    }
    unwrapParams()
  }, [params])

  useEffect(() => {
    if (!patientId) return

    async function loadPatientData() {
      setLoading(true)
      setError(null)
      const data = await fetchPatientData(patientId)
      if (data) {
        setPatientData(data)
      } else {
        setError('Patient not found or access denied')
      }
      setLoading(false)
    }
    
    loadPatientData()
  }, [patientId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading patient data...</p>
        </div>
      </div>
    )
  }

  if (error || !patientData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="icon">
            <Link href="/health-worker/patients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">Patient Not Found</h1>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon">
          <Link href="/health-worker/patients">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold md:text-3xl text-gray-800">{patientData.name}</h1>
          <p className="text-gray-600">Patient ID: {patientData.id}</p>
        </div>
        <Button asChild className="bg-brand-medical-green hover:bg-brand-medical-green/90">
          <Link href={`/health-worker/upload?patient=${patientData.id}`}>
            <Upload className="mr-2 h-4 w-4" />
            Upload New Data
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Patient Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Patient Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-gray-400" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="font-semibold text-lg">{patientData.name}</h3>
              <p className="text-gray-600">
                {patientData.age} years old • {patientData.gender}
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              {patientData.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Born: {new Date(patientData.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>{patientData.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <span>{[patientData.address, patientData.village, patientData.city, patientData.province].filter(Boolean).join(', ')}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-medium text-sm">Medical Information</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {patientData.medicalInfo.weight && (
                  <div className="flex items-center gap-1">
                    <Weight className="h-3 w-3 text-gray-500" />
                    <span>{patientData.medicalInfo.weight} kg</span>
                  </div>
                )}
                {patientData.medicalInfo.height && (
                  <div className="flex items-center gap-1">
                    <Ruler className="h-3 w-3 text-gray-500" />
                    <span>{patientData.medicalInfo.height} cm</span>
                  </div>
                )}
                {patientData.medicalInfo.bmi && (
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-gray-500" />
                    <span>BMI: {patientData.medicalInfo.bmi}</span>
                  </div>
                )}
                {patientData.medicalInfo.bloodType && (
                  <div className="text-xs text-gray-600">Blood: {patientData.medicalInfo.bloodType}</div>
                )}
              </div>
            </div>

            <Separator />

            {patientData.emergencyContact.name && (
              <>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Emergency Contact</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{patientData.emergencyContact.name}</p>
                    <p className="text-gray-600">{patientData.emergencyContact.relationship}</p>
                    <p className="text-gray-600">{patientData.emergencyContact.phone}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Medical History & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Medical Conditions & Allergies */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Conditions & Allergies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Known Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {patientData.medicalInfo.conditions.length > 0 ? (
                    patientData.medicalInfo.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No known conditions</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {patientData.medicalInfo.allergies.length > 0 ? (
                    patientData.medicalInfo.allergies.map((allergy, index) => (
                      <Badge key={index} variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {allergy}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No known allergies</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical History Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Medical History Timeline</CardTitle>
              <CardDescription>Past visits and medical events</CardDescription>
            </CardHeader>
            <CardContent>
              {patientData.medicalHistory.length > 0 ? (
                <div className="space-y-4">
                  {patientData.medicalHistory.map((event, index) => (
                    <div key={index} className="flex gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium">{event.type}</h4>
                          <span className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{event.notes}</p>
                        <p className="text-xs text-gray-500">Provider: {event.provider}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No medical history recorded</p>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis History */}
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis History</CardTitle>
              <CardDescription>Past health assessments and results</CardDescription>
            </CardHeader>
            <CardContent>
              {patientData.analysisHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Risk Level</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Key Findings</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientData.analysisHistory.map((analysis) => (
                      <TableRow key={analysis.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{new Date(analysis.date).toLocaleDateString()}</div>
                            <div className="text-gray-500">{analysis.time}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getRiskBadge(analysis.riskLevel)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            {analysis.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm truncate">{analysis.findings}</p>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-3 w-3" />
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-sm text-gray-500">No analysis history available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
