"use client"

import type React from "react"

import { useState } from "react"
import { getCurrentUserId } from "@/lib/client-auth"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Heart, AlertTriangle, Camera, Shield, CheckCircle } from "lucide-react"
import Link from "next/link"

const commonConditions = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "High Cholesterol",
  "Arthritis",
  "Kidney Disease",
  "Stroke History",
]

const commonAllergies = [
  "Penicillin",
  "Aspirin",
  "Sulfa drugs",
  "Iodine",
  "Latex",
  "Food allergies",
  "Environmental allergies",
]

export default function PatientRegistrationPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    phoneNumber: "",
    email: "",
    password: "",
    address: "",
    village: "",
    district: "",
    city: "",
    province: "",
    weight: "",
    height: "",
    emergencyContact: "",
    emergencyPhone: "",
    emergencyRelationship: "",
    knownConditions: [] as string[],
    currentMedications: "",
    allergies: [] as string[],
    otherAllergies: "",
    previousSurgeries: "",
    patientPhoto: null as File | null,
    createLogin: false,
    privacyConsent: false,
    dataUsageConsent: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")

  const handleConditionChange = (condition: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      knownConditions: checked
        ? [...prev.knownConditions, condition]
        : prev.knownConditions.filter((c) => c !== condition),
    }))
  }

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      allergies: checked ? [...prev.allergies, allergy] : prev.allergies.filter((a) => a !== allergy),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage("")

    try {
      const currentUserId = getCurrentUserId()
      if (!currentUserId) {
        setSubmitMessage("❌ Please log in as a health worker to register patients.")
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/health-worker/register-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': currentUserId
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          age: parseInt(formData.age),
          gender: formData.gender,
          phoneNumber: formData.phoneNumber,
          email: formData.email || null,
          password: formData.password,
          address: formData.address,
          village: formData.village,
          district: formData.district,
          city: formData.city,
          province: formData.province,
          weight: formData.weight ? parseFloat(formData.weight) : null,
          height: formData.height ? parseFloat(formData.height) : null,
          emergencyContactName: formData.emergencyContact,
          emergencyContactPhone: formData.emergencyPhone,
          emergencyContactRelationship: formData.emergencyRelationship,
          knownConditions: formData.knownConditions.join(', '),
          currentMedications: formData.currentMedications,
          allergies: [...formData.allergies, formData.otherAllergies].filter(Boolean).join(', '),
          previousSurgeries: formData.previousSurgeries,
          createLogin: formData.createLogin,
          privacyConsent: formData.privacyConsent,
          dataUsageConsent: formData.dataUsageConsent
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setSubmitMessage(`✅ Patient registered successfully! Patient ID: ${result.patientId}`)
        // Reset form
        setFormData({
          fullName: "",
          age: "",
          gender: "",
          phoneNumber: "",
          email: "",
          password: "",
          address: "",
          village: "",
          district: "",
          city: "",
          province: "",
          weight: "",
          height: "",
          emergencyContact: "",
          emergencyPhone: "",
          emergencyRelationship: "",
          knownConditions: [],
          currentMedications: "",
          allergies: [],
          otherAllergies: "",
          previousSurgeries: "",
          patientPhoto: null,
          createLogin: false,
          privacyConsent: false,
          dataUsageConsent: false,
        })
      } else {
        const error = await response.json()
        setSubmitMessage(`❌ Registration failed: ${error.error}`)
      }
    } catch (error) {
      setSubmitMessage("❌ Registration failed. Please try again.")
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <EnhancedButton asChild variant="outline" size="icon">
          <Link href="/health-worker/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </EnhancedButton>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
          <p className="text-gray-600">Add a new patient to the health center system</p>
        </div>
      </div>

      {submitMessage && (
        <Alert className={submitMessage.includes('✅') ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
          <AlertDescription>{submitMessage}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Enter patient's full name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  placeholder="Age in years"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number *</Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+62 xxx-xxxx-xxxx"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Complete address"
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="village">Village/Kelurahan *</Label>
                <Input
                  id="village"
                  value={formData.village}
                  onChange={(e) => setFormData((prev) => ({ ...prev, village: e.target.value }))}
                  placeholder="Village name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="district">District/Kecamatan *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
                  placeholder="District name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="city">City/Kabupaten *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="City name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="province">Province *</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) => setFormData((prev) => ({ ...prev, province: e.target.value }))}
                  placeholder="Province name"
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="Weight in kilograms"
                  step="0.1"
                  min="1"
                  max="300"
                />
              </div>
              <div>
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  placeholder="Height in centimeters"
                  min="50"
                  max="250"
                />
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Emergency contact person"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
                  placeholder="+62 xxx-xxxx-xxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyRelationship">Relationship *</Label>
                <Select
                  value={formData.emergencyRelationship}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, emergencyRelationship: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spouse">Spouse</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="sibling">Sibling</SelectItem>
                    <SelectItem value="relative">Other Relative</SelectItem>
                    <SelectItem value="friend">Friend</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Patient Photo (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Upload patient photo for identification</p>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="patient-photo"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setFormData((prev) => ({ ...prev, patientPhoto: file }))
                  }}
                />
                <EnhancedButton
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("patient-photo")?.click()}
                >
                  Choose Photo
                </EnhancedButton>
                {formData.patientPhoto && (
                  <p className="text-sm text-green-600 mt-2">✓ Photo uploaded: {formData.patientPhoto.name}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-green-600" />
              Medical History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Known Conditions</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {commonConditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={formData.knownConditions.includes(condition)}
                      onCheckedChange={(checked) => handleConditionChange(condition, checked as boolean)}
                    />
                    <Label htmlFor={condition} className="text-sm">
                      {condition}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="currentMedications">Current Medications</Label>
              <Textarea
                id="currentMedications"
                value={formData.currentMedications}
                onChange={(e) => setFormData((prev) => ({ ...prev, currentMedications: e.target.value }))}
                placeholder="List current medications with dosages (e.g., Lisinopril 10mg daily, Metformin 500mg twice daily)"
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Allergies</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {commonAllergies.map((allergy) => (
                  <div key={allergy} className="flex items-center space-x-2">
                    <Checkbox
                      id={allergy}
                      checked={formData.allergies.includes(allergy)}
                      onCheckedChange={(checked) => handleAllergyChange(allergy, checked as boolean)}
                    />
                    <Label htmlFor={allergy} className="text-sm">
                      {allergy}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Label htmlFor="otherAllergies">Other Allergies</Label>
                <Input
                  id="otherAllergies"
                  value={formData.otherAllergies}
                  onChange={(e) => setFormData((prev) => ({ ...prev, otherAllergies: e.target.value }))}
                  placeholder="Specify other allergies"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="previousSurgeries">Previous Surgeries/Hospitalizations</Label>
              <Textarea
                id="previousSurgeries"
                value={formData.previousSurgeries}
                onChange={(e) => setFormData((prev) => ({ ...prev, previousSurgeries: e.target.value }))}
                placeholder="List any previous surgeries or major hospitalizations with dates"
                className="min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Account Creation */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" />
              Account Creation & Consent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-l-4 border-l-blue-500 bg-blue-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="createLogin"
                      checked={formData.createLogin}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({ ...prev, createLogin: checked as boolean }))
                      }
                    />
                    <Label htmlFor="createLogin" className="text-sm font-medium">
                      Create patient login credentials for accessing health records
                    </Label>
                  </div>
                  <p className="text-xs text-gray-600 ml-6">
                    Patient will be able to log in using their phone number and password to view their health screening results and reports
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            {formData.createLogin && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <Label htmlFor="loginPhone">Login Phone Number *</Label>
                    <Input
                      id="loginPhone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+62 xxx-xxxx-xxxx"
                      required={formData.createLogin}
                      readOnly
                    />
                    <p className="text-xs text-gray-600 mt-1">Patient will use this phone number to log in</p>
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter secure password"
                      required={formData.createLogin}
                      minLength={6}
                    />
                    <p className="text-xs text-gray-600 mt-1">Password must be at least 6 characters long</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Alert className="border-l-4 border-l-green-500 bg-green-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p className="font-medium text-sm">Privacy Consent & Data Usage Agreement</p>

                  <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacyConsent"
                        checked={formData.privacyConsent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, privacyConsent: checked as boolean }))
                        }
                        required
                      />
                      <Label htmlFor="privacyConsent" className="text-sm">
                        I consent to the processing of health data for medical analysis and treatment purposes *
                      </Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="dataUsageConsent"
                        checked={formData.dataUsageConsent}
                        onCheckedChange={(checked) =>
                          setFormData((prev) => ({ ...prev, dataUsageConsent: checked as boolean }))
                        }
                      />
                      <Label htmlFor="dataUsageConsent" className="text-sm">
                        I allow anonymized data to be used for medical research and AI model improvement
                      </Label>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card>
          <CardContent className="pt-6">
            <EnhancedButton
              type="submit"
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={
                isSubmitting || 
                !formData.privacyConsent || 
                !formData.fullName || 
                !formData.age || 
                !formData.gender || 
                !formData.phoneNumber || 
                !formData.address || 
                !formData.village || 
                !formData.district || 
                !formData.city || 
                !formData.province ||
                !formData.emergencyContact || 
                !formData.emergencyPhone || 
                !formData.emergencyRelationship ||
                (formData.createLogin && (!formData.phoneNumber || !formData.password))
              }
            >
              {isSubmitting ? "Registering Patient..." : "Register Patient"}
            </EnhancedButton>
            {!formData.privacyConsent && (
              <p className="text-sm text-red-600 text-center mt-2">
                Privacy consent is required to register the patient
              </p>
            )}
            {formData.createLogin && (!formData.phoneNumber || !formData.password) && (
              <p className="text-sm text-red-600 text-center mt-2">
                Phone number and password are required when creating login credentials
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
