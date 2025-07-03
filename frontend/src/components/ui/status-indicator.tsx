import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatusIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  status: "processing" | "completed" | "urgent" | "high-risk" | "medium-risk" | "low-risk"
  icon?: LucideIcon
  label: string
  showIcon?: boolean
}

const statusConfig = {
  processing: {
    className: "status-badge processing",
    iconColor: "text-blue-600",
  },
  completed: {
    className: "status-badge completed",
    iconColor: "text-green-600",
  },
  urgent: {
    className: "status-badge urgent",
    iconColor: "text-red-600",
  },
  "high-risk": {
    className: "status-badge high-risk",
    iconColor: "text-red-600",
  },
  "medium-risk": {
    className: "status-badge medium-risk",
    iconColor: "text-orange-600",
  },
  "low-risk": {
    className: "status-badge low-risk",
    iconColor: "text-green-600",
  },
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, icon: Icon, label, showIcon = true, ...props }, ref) => {
    const config = statusConfig[status]

    return (
      <div ref={ref} className={cn(config.className, className)} {...props}>
        {showIcon && Icon && <Icon className={cn("w-4 h-4 mr-1.5", config.iconColor)} />}
        {label}
      </div>
    )
  },
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator } 