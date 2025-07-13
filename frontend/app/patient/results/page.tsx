"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  MapPin,
  Calendar,
  Heart,
  Activity,
  Droplets,
  Thermometer,
  Download,
  Printer,
  CheckCircle,
  AlertTriangle,
  Clock,
  User,
  Stethoscope,
} from "lucide-react"
import { getCurrentUserId } from "@/lib/client-auth"

interface ResultsData {
  latestScreening: {
    id: number
    screening_date: string
    overall_status: string
    overall_notes: string
    facility_name: string
    health_worker_first_name: string
    health_worker_last_name: string
  } | null
  vitalSigns: Array<{
    measurement_type: string
    value_text: string
    value_numeric: number | null
    unit: string
    status: string
    reference_range: string
  }>
  recommendations: Array<{
    category: string
    recommendation: string
    priority: string
  }>
}

async function fetchResultsData(): Promise<ResultsData | null> {
  try {
    const userId = getCurrentUserId()
    if (!userId) {
      console.error('No user ID found in session')
      return null
    }
    
    const response = await fetch('/api/patient/results', {
      headers: {
        'x-user-id': userId // Get actual logged-in user ID
      }
    })
    if (!response.ok) {
      throw new Error('Failed to fetch results data')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching results data:', error)
    return null
  }
}

export default function PatientResults() {
  const [resultsData, setResultsData] = useState<ResultsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadResults() {
      setLoading(true)
      const data = await fetchResultsData()
      setResultsData(data)
      setLoading(false)
    }
    
    loadResults()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!resultsData || !resultsData.latestScreening) {
    return (
      <div className="flex-1 space-y-6 p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Health Analysis Results</h1>
          <p className="text-neutral-600">Your health screening results will appear here</p>
        </div>
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Results Available</h3>
            <p className="text-gray-600">Complete your first health screening to see your results here.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { latestScreening, vitalSigns, recommendations } = resultsData

  // Helper functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-base px-3 py-1">
            <CheckCircle className="h-4 w-4 mr-2" />
            Healthy - No Immediate Concerns
          </Badge>
        )
      case 'attention_needed':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200 text-base px-3 py-1">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Attention Needed
          </Badge>
        )
      case 'urgent':
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200 text-base px-3 py-1">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Urgent - Requires Attention
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200 text-base px-3 py-1">
            Results Available
          </Badge>
        )
    }
  }

  const getStatusBorderColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
        return 'border-l-green-500'
      case 'attention_needed':
        return 'border-l-yellow-500'
      case 'urgent':
        return 'border-l-red-500'
      default:
        return 'border-l-gray-500'
    }
  }

  const getVitalSignData = (type: string) => {
    return vitalSigns.find(vs => vs.measurement_type === type)
  }

  const getVitalSignIcon = (type: string) => {
    switch (type) {
      case 'heart_rate':
      case 'blood_pressure':
        return <Heart className="h-5 w-5 text-red-500" />
      case 'respiratory_rate':
        return <Activity className="h-5 w-5 text-blue-500" />
      case 'oxygen_saturation':
        return <Droplets className="h-5 w-5 text-cyan-500" />
      case 'temperature':
        return <Thermometer className="h-5 w-5 text-orange-500" />
      default:
        return <Activity className="h-5 w-5 text-gray-500" />
    }
  }

  const getVitalSignStatus = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">Normal</Badge>
      case 'attention':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">Attention</Badge>
      case 'abnormal':
        return <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">Abnormal</Badge>
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>
    }
  }
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Latest Health Analysis Results</h1>
        <p className="text-neutral-600">Comprehensive health screening results and recommendations</p>
      </div>

      {/* Analysis Summary */}
      <Card className={`border-l-4 ${getStatusBorderColor(latestScreening.overall_status)}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-green-600" />
            Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-neutral-500" />
              <span className="text-sm">
                <strong>Date:</strong> {formatDate(latestScreening.screening_date)}, {formatTime(latestScreening.screening_date)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-500" />
              <span className="text-sm">
                <strong>Location:</strong> {latestScreening.facility_name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(latestScreening.overall_status)}
          </div>

          <p className="text-neutral-700">
            {latestScreening.overall_notes || 'Your comprehensive health screening has been completed successfully. Please review the detailed results below and follow any recommendations provided.'}
          </p>
        </CardContent>
      </Card>

      {/* Vital Signs Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Vital Signs Overview
          </CardTitle>
          <CardDescription>Detailed analysis of your key health indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Heart Rate & Blood Pressure */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getVitalSignIcon('heart_rate')}
                <h3 className="font-semibold">Heart Health</h3>
              </div>
              {(() => {
                const heartRate = getVitalSignData('heart_rate')
                const bloodPressure = getVitalSignData('blood_pressure')
                const primaryVital = heartRate || bloodPressure
                return (
                  <>
                    {primaryVital ? getVitalSignStatus(primaryVital.status) : <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">No Data</Badge>}
                    <div className="text-sm text-neutral-600 space-y-1">
                      {heartRate && (
                        <p>Heart Rate: {heartRate.value_text || (heartRate.value_numeric ? `${heartRate.value_numeric} ${heartRate.unit}` : 'N/A')}</p>
                      )}
                      {bloodPressure && (
                        <p>Blood Pressure: {bloodPressure.value_text || 'N/A'}</p>
                      )}
                      {!heartRate && !bloodPressure && <p>No heart health data available</p>}
                    </div>
                  </>
                )
              })()}
            </div>

            {/* Respiratory */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getVitalSignIcon('respiratory_rate')}
                <h3 className="font-semibold">Respiratory</h3>
              </div>
              {(() => {
                const respiratory = getVitalSignData('respiratory_rate')
                return (
                  <>
                    {respiratory ? getVitalSignStatus(respiratory.status) : <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">No Data</Badge>}
                    <p className="text-sm text-neutral-600">
                      {respiratory ? (
                        `Respiratory Rate: ${respiratory.value_text || (respiratory.value_numeric ? `${respiratory.value_numeric} ${respiratory.unit}` : 'N/A')}`
                      ) : (
                        'No respiratory data available'
                      )}
                    </p>
                  </>
                )
              })()}
            </div>

            {/* Blood Oxygen */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getVitalSignIcon('oxygen_saturation')}
                <h3 className="font-semibold">Blood Oxygen</h3>
              </div>
              {(() => {
                const oxygen = getVitalSignData('oxygen_saturation')
                return (
                  <>
                    {oxygen ? getVitalSignStatus(oxygen.status) : <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">No Data</Badge>}
                    <p className="text-sm text-neutral-600">
                      {oxygen ? (
                        `Oxygen Saturation: ${oxygen.value_text || (oxygen.value_numeric ? `${oxygen.value_numeric}${oxygen.unit}` : 'N/A')}`
                      ) : (
                        'No oxygen saturation data available'
                      )}
                    </p>
                  </>
                )
              })()}
            </div>

            {/* Body Temperature */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {getVitalSignIcon('temperature')}
                <h3 className="font-semibold">Temperature</h3>
              </div>
              {(() => {
                const temperature = getVitalSignData('temperature')
                return (
                  <>
                    {temperature ? getVitalSignStatus(temperature.status) : <Badge variant="secondary" className="bg-gray-100 text-gray-800 border-gray-200">No Data</Badge>}
                    <p className="text-sm text-neutral-600">
                      {temperature ? (
                        `Body Temperature: ${temperature.value_text || (temperature.value_numeric ? `${temperature.value_numeric}${temperature.unit}` : 'N/A')}`
                      ) : (
                        'No temperature data available'
                      )}
                    </p>
                  </>
                )
              })()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Overall Health Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className={
            latestScreening.overall_status === 'urgent' ? 'border-red-200 bg-red-50' :
            latestScreening.overall_status === 'attention_needed' ? 'border-yellow-200 bg-yellow-50' :
            'border-green-200 bg-green-50'
          }>
            {latestScreening.overall_status === 'urgent' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertDescription>
              <strong>
                {latestScreening.overall_status === 'healthy' ? 'Good Health Status: ' :
                 latestScreening.overall_status === 'attention_needed' ? 'Health Monitoring Required: ' :
                 latestScreening.overall_status === 'urgent' ? 'Urgent Medical Attention Required: ' :
                 'Health Assessment: '}
              </strong>
              {latestScreening.overall_notes || 'Your health screening has been completed. Please review the detailed results and follow any recommendations provided by your healthcare provider.'}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Specialist Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Health Recommendations
          </CardTitle>
          <CardDescription>Professional guidance based on your screening results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {recommendations.length > 0 ? (
            <>
              {/* Group recommendations by category */}
              {['medical_followup', 'diet_nutrition', 'physical_activity', 'lifestyle'].map(category => {
                const categoryRecommendations = recommendations.filter(rec => rec.category === category)
                if (categoryRecommendations.length === 0) return null

                const getCategoryTitle = (cat: string) => {
                  switch (cat) {
                    case 'medical_followup': return 'Medical Follow-up'
                    case 'diet_nutrition': return 'Diet & Nutrition'
                    case 'physical_activity': return 'Physical Activity'
                    case 'lifestyle': return 'Lifestyle'
                    default: return cat.replace('_', ' ').toUpperCase()
                  }
                }

                const getCategoryIcon = (cat: string) => {
                  switch (cat) {
                    case 'medical_followup': return <Clock className="h-4 w-4" />
                    case 'diet_nutrition': return <Droplets className="h-4 w-4" />
                    case 'physical_activity': return <Activity className="h-4 w-4" />
                    case 'lifestyle': return <Heart className="h-4 w-4" />
                    default: return <CheckCircle className="h-4 w-4" />
                  }
                }

                return (
                  <div key={category}>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      {getCategoryIcon(category)}
                      {getCategoryTitle(category)}
                    </h3>
                    <ul className="space-y-2 text-sm text-neutral-700">
                      {categoryRecommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          {rec.priority === 'urgent' ? (
                            <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          ) : rec.priority === 'high' ? (
                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          )}
                          <span className={rec.priority === 'urgent' ? 'text-red-700 font-medium' : rec.priority === 'high' ? 'text-yellow-700 font-medium' : ''}>
                            {rec.recommendation}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {category !== 'lifestyle' && <Separator className="mt-4" />}
                  </div>
                )
              })}
            </>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Specific Recommendations</h3>
              <p className="text-gray-600">Your screening results don't require any specific recommendations at this time. Continue maintaining your current healthy lifestyle.</p>
            </div>
          )}

          {/* Warning Signs */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              When to Seek Immediate Medical Attention
            </h3>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Contact emergency services (119) immediately if you experience:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• Severe chest pain or pressure</li>
                  <li>• Difficulty breathing or shortness of breath</li>
                  <li>• Sudden severe headache or dizziness</li>
                  <li>• Persistent high fever (above 39°C)</li>
                  <li>• Any symptoms that concern you significantly</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Download Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download Options
          </CardTitle>
          <CardDescription>Save or print your health reports for your records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <EnhancedButton variant="default" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Full Report (PDF)
            </EnhancedButton>
            <EnhancedButton variant="outline" className="flex-1">
              <Printer className="h-4 w-4 mr-2" />
              Print Summary Report
            </EnhancedButton>
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            Full report includes detailed medical data and technical measurements. Summary report provides key
            information in simplified format for home reference.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
