import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Minus, Heart, AirVentIcon as Lung, Activity, Thermometer, Droplet } from "lucide-react"

// Placeholder data
const vitalSigns = {
  heartRate: { value: 72, unit: "bpm", trend: "stable", normalRange: "60-100" },
  respiratoryRate: { value: 16, unit: "breaths/min", trend: "stable", normalRange: "12-20" },
  spO2: { value: 98, unit: "%", trend: "stable", normalRange: "95-100" },
  pulseRate: { value: 75, unit: "bpm", trend: "up", normalRange: "60-100" }, // Example of abnormal trend
  hrv: { value: 65, unit: "ms", trend: "down", normalRange: "50-100" }, // Example of abnormal trend
  temperature: { value: 36.8, unit: "°C", trend: "stable", normalRange: "36.1-37.2" },
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-red-500" />
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-blue-500" />
  return <Minus className="h-4 w-4 text-gray-500" />
}

const VitalSignItem = ({
  icon,
  label,
  data,
}: {
  icon: React.ElementType
  label: string
  data: { value: number; unit: string; trend: "up" | "down" | "stable"; normalRange: string }
}) => {
  const IconComponent = icon
  // Basic check for abnormality (simplified)
  const [min, max] = data.normalRange.split("-").map(Number)
  const isAbnormal = data.value < min || data.value > max || data.trend !== "stable"

  return (
    <div className={`p-3 rounded-lg border ${isAbnormal ? "border-orange-400 bg-orange-50" : "bg-gray-50"}`}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center">
          <IconComponent className={`h-5 w-5 mr-2 ${isAbnormal ? "text-orange-600" : "text-primary"}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <TrendIcon trend={data.trend} />
      </div>
      <div className="text-2xl font-bold text-gray-800">
        {data.value} <span className="text-sm font-normal text-gray-600">{data.unit}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        Normal: {data.normalRange} {data.unit}
      </p>
    </div>
  )
}

export function VitalSignsPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Vital Signs Summary</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <VitalSignItem icon={Heart} label="Heart Rate" data={vitalSigns.heartRate} />
        <VitalSignItem icon={Lung} label="Respiratory Rate" data={vitalSigns.respiratoryRate} />
        <VitalSignItem icon={Droplet} label="SpO2" data={vitalSigns.spO2} />
        <VitalSignItem icon={Activity} label="Pulse Rate" data={vitalSigns.pulseRate} />
        <VitalSignItem icon={Activity} label="HRV (SDNN)" data={vitalSigns.hrv} />
        <VitalSignItem icon={Thermometer} label="Temperature (Est.)" data={vitalSigns.temperature} />
      </CardContent>
    </Card>
  )
}
