"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  category: "health" | "records" | "specialist" | "alert"
  badge?: string
  href?: string
  onClick?: () => void
}

const categoryStyles = {
  health: "feature-icon health",
  records: "feature-icon records",
  specialist: "feature-icon specialist",
  alert: "feature-icon alert",
}

const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, icon: Icon, title, description, category, badge, href, onClick, ...props }, ref) => {
    const Component = href ? "a" : "div"

    return (
      <Component
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          "group relative p-6 bg-white border border-neutral-200 rounded-xl shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]",
          className,
        )}
        {...props}
      >
        {badge && (
          <div className="absolute -top-2 -right-2 bg-risk-high text-white text-xs font-bold px-2 py-1 rounded-full shadow-soft">
            {badge}
          </div>
        )}

        <div className="flex items-start space-x-4">
          <div className={categoryStyles[category]}>
            <Icon className="w-6 h-6" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-h3 font-semibold text-neutral-900 mb-2 group-hover:text-trust-blue transition-colors">
              {title}
            </h3>
            <p className="text-body-sm text-neutral-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </Component>
    )
  },
)
FeatureCard.displayName = "FeatureCard"

export { FeatureCard }
