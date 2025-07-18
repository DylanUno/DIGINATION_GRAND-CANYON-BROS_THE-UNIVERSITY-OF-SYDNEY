"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  LineChart, 
  BarChart, 
  Activity, 
  Heart, 
  AirVentIcon as Lung, 
  TrendingUp, 
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader2
} from "lucide-react"

interface MedicalPlotsProps {
  patientId: string
}

interface PlotData {
  ecg_waveform?: string
  vital_signs_trend?: string
  respiratory_pattern?: string
  hrv_analysis?: string
  combined_dashboard?: string
}

interface PlotInfo {
  available_plots: string[]
  files_info: Record<string, { path: string; exists: boolean }>
  total_plots_available: number
}

export function MedicalPlotsPanel({ patientId }: MedicalPlotsProps) {
  const [plots, setPlots] = useState<PlotData>({})
  const [plotInfo, setPlotInfo] = useState<PlotInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const plotTypes = [
    {
      key: 'ecg_waveform',
      title: 'ECG Waveform',
      description: 'Real-time electrocardiogram signals',
      icon: Activity,
      color: 'text-red-600'
    },
    {
      key: 'respiratory_pattern',
      title: 'Respiratory Pattern',
      description: 'Breathing waveform and rate analysis',
      icon: Lung,
      color: 'text-green-600'
    },
    {
      key: 'combined_dashboard',
      title: 'Combined Dashboard',
      description: 'Comprehensive vital signs overview',
      icon: BarChart,
      color: 'text-orange-600'
    }
  ]

  const fetchPlotInfo = async () => {
    try {
      const response = await fetch(`/api/plots/plot-info/${patientId}`)
      if (!response.ok) throw new Error('Failed to fetch plot info')
      const data = await response.json()
      setPlotInfo(data)
    } catch (err) {
      console.error('Error fetching plot info:', err)
      setError('Failed to load plot information')
    }
  }

  const fetchPlots = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/plots/patient-plots/${patientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch plots')
      }

      const data = await response.json()
      setPlots(data.plots || {})
      
      console.log(`📊 Loaded ${Object.keys(data.plots || {}).length} plots for patient ${patientId}`)
      
    } catch (err) {
      console.error('Error fetching plots:', err)
      setError(err instanceof Error ? err.message : 'Failed to load plots')
    } finally {
      setLoading(false)
    }
  }

  const refreshPlots = async () => {
    setRefreshing(true)
    await fetchPlots()
    setRefreshing(false)
  }

  useEffect(() => {
    if (patientId) {
      fetchPlotInfo()
      fetchPlots()
    }
  }, [patientId])

  const downloadPlot = (plotKey: string, plotTitle: string) => {
    const plotData = plots[plotKey as keyof PlotData]
    if (!plotData) return

    // Create download link
    const link = document.createElement('a')
    link.href = plotData
    link.download = `${patientId}_${plotKey}_${new Date().toISOString().split('T')[0]}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Medical Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Generating medical plots...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5 text-blue-600" />
            Medical Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refreshPlots} className="mt-4" variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  const availablePlots = plotTypes.filter(plot => plots[plot.key as keyof PlotData])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-blue-600" />
              Medical Data Visualization
            </CardTitle>
            <CardDescription>
              Interactive plots and analysis from patient physiological data
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {availablePlots.length} plots available
            </Badge>
            <Button 
              onClick={refreshPlots} 
              variant="outline" 
              size="sm"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {availablePlots.length === 0 ? (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              No plots available for this patient. This may be due to missing data files or processing errors.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue={availablePlots[0]?.key} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              {availablePlots.map((plot) => {
                const Icon = plot.icon
                return (
                  <TabsTrigger key={plot.key} value={plot.key} className="flex items-center gap-1">
                    <Icon className={`h-4 w-4 ${plot.color}`} />
                    <span className="hidden sm:inline">{plot.title}</span>
                  </TabsTrigger>
                )
              })}
            </TabsList>
            
            {availablePlots.map((plot) => {
              const plotData = plots[plot.key as keyof PlotData]
              const Icon = plot.icon
              
              return (
                <TabsContent key={plot.key} value={plot.key} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${plot.color}`} />
                      <div>
                        <h3 className="font-semibold">{plot.title}</h3>
                        <p className="text-sm text-gray-600">{plot.description}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => downloadPlot(plot.key, plot.title)}
                      variant="outline" 
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg p-4 bg-white">
                    {plotData ? (
                      <div className="w-full overflow-x-auto">
                        <img 
                          src={plotData} 
                          alt={plot.title}
                          className="w-full h-auto max-w-none"
                          style={{ minWidth: '800px' }}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center py-8 text-gray-500">
                        <AlertTriangle className="h-6 w-6 mr-2" />
                        Plot not available
                      </div>
                    )}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        )}
        
        {/* File Status Information */}
        {plotInfo && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Data Files Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {Object.entries(plotInfo.files_info).map(([fileType, info]) => (
                <div key={fileType} className="flex items-center gap-2">
                  {info.exists ? (
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                  )}
                  <span className={info.exists ? 'text-green-700' : 'text-red-700'}>
                    {fileType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 