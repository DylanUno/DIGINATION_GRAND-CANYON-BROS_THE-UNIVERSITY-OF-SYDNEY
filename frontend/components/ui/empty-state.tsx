"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"
import { EnhancedButton } from "./enhanced-button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, actionLabel, onAction, actionHref, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("empty-state", className)} {...props}>
        <div className="empty-state-icon">
          <Icon className="w-full h-full" />
        </div>

        <h3 className="empty-state-title">{title}</h3>

        <p className="empty-state-description">{description}</p>

        {actionLabel && (onAction || actionHref) && (
          <EnhancedButton size="lg" onClick={onAction} asChild={!!actionHref} className="animate-fade-in">
            {actionHref ? <a href={actionHref}>{actionLabel}</a> : actionLabel}
          </EnhancedButton>
        )}
      </div>
    )
  },
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
