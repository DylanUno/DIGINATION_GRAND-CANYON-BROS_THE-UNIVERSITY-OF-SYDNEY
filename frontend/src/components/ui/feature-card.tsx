import * as React from "react"
import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  category: "health" | "records" | "specialist" | "alert"
  badge?: string
  className?: string
}

const categoryStyles = {
  health: "border-health-teal/20 bg-gradient-to-br from-health-teal/5 to-health-green/5",
  records: "border-record-pink/20 bg-gradient-to-br from-record-pink/5 to-soft-pink/5",
  specialist: "border-calm-purple/20 bg-gradient-to-br from-calm-purple/5 to-blue-500/5",
  alert: "border-alert-orange/20 bg-gradient-to-br from-alert-orange/5 to-warm-amber/5",
}

const iconStyles = {
  health: "text-health-teal",
  records: "text-record-pink",
  specialist: "text-calm-purple",
  alert: "text-alert-orange",
}

export function FeatureCard({ 
  icon: Icon, 
  title, 
  description, 
  category, 
  badge, 
  className 
}: FeatureCardProps) {
  return (
    <div className={cn(
      "relative p-6 rounded-lg border shadow-soft hover:shadow-medium transition-shadow duration-200",
      categoryStyles[category],
      className
    )}>
      {badge && (
        <div className="absolute top-4 right-4">
          <Badge variant="secondary" className="bg-white/80 text-neutral-700">
            {badge}
          </Badge>
        </div>
      )}
      
      <div className="space-y-4">
        <div className={cn(
          "w-12 h-12 rounded-lg border border-current/20 flex items-center justify-center",
          iconStyles[category]
        )}>
          <Icon className="w-6 h-6" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-h3 font-semibold text-neutral-900">{title}</h3>
          <p className="text-body text-neutral-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  )
} 