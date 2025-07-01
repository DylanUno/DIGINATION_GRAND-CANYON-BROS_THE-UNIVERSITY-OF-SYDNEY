import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { CheckCircle, Clock, AlertTriangle, XCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const statusIndicatorVariants = cva(
  "inline-flex items-center gap-2 px-3 py-1 rounded-full text-caption font-medium",
  {
    variants: {
      status: {
        completed: "bg-green-100 text-green-700",
        processing: "bg-blue-100 text-blue-700",
        urgent: "bg-red-100 text-red-700",
        warning: "bg-orange-100 text-orange-700",
        neutral: "bg-gray-100 text-gray-700",
      },
    },
    defaultVariants: {
      status: "neutral",
    },
  }
)

const statusIcons = {
  completed: CheckCircle,
  processing: Clock,
  urgent: AlertTriangle,
  warning: AlertTriangle,
  neutral: Clock,
}

export interface StatusIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusIndicatorVariants> {
  label: string
  showIcon?: boolean
  icon?: LucideIcon
}

const StatusIndicator = React.forwardRef<HTMLDivElement, StatusIndicatorProps>(
  ({ className, status, label, showIcon = true, icon, ...props }, ref) => {
    const Icon = icon || (status ? statusIcons[status] : statusIcons.neutral)

    return (
      <div
        className={cn(statusIndicatorVariants({ status, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && <Icon className="w-3 h-3" />}
        <span>{label}</span>
      </div>
    )
  }
)
StatusIndicator.displayName = "StatusIndicator"

export { StatusIndicator, statusIndicatorVariants } 