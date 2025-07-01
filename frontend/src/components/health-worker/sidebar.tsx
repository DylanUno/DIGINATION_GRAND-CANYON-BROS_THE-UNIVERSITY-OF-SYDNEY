"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Home, Users, Upload, TicketIcon as Queue, LogOut, HeartPulse, Bell } from "lucide-react"

const navItems = [
  { href: "/health-worker/dashboard", label: "Dashboard", icon: Home },
  { href: "/health-worker/patients", label: "Patients", icon: Users },
  { href: "/health-worker/upload", label: "Upload Data", icon: Upload },
  { href: "/health-worker/queue", label: "Patient Queue", icon: Queue },
]

export function HealthWorkerSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-neutral-200 bg-gradient-to-b from-neutral-50 to-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/health-worker/dashboard" className="flex items-center gap-2 font-semibold text-trust-blue">
            <div className="feature-icon health w-8 h-8">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-h3">VitalSense</span>
          </Link>
          <EnhancedButton variant="ghost" size="icon" className="ml-auto relative">
            <Bell className="h-4 w-4" />
            <StatusIndicator
              status="urgent"
              label="3"
              showIcon={false}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-risk-high text-white text-xs flex items-center justify-center"
            />
          </EnhancedButton>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-neutral-700 transition-all hover:text-trust-blue hover:bg-blue-50",
                  pathname === item.href && "bg-trust-blue/10 text-trust-blue font-semibold",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t border-neutral-200">
          <div className="mb-3 text-body-sm text-neutral-600">
            <p className="font-medium text-neutral-900">Rural Health Center</p>
            <p className="text-body-sm">Dr. Sarah Johnson</p>
          </div>
          <EnhancedButton variant="ghost" size="sm" className="w-full justify-start text-neutral-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </EnhancedButton>
        </div>
      </div>
    </div>
  )
} 