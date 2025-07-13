"use client"

import type React from "react"
import Link from "next/link"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { HeartPulse, LogOut, Users } from "lucide-react"
import { SpecialistName } from "@/components/specialist/specialist-header"
import { logout } from "@/lib/client-auth"

export default function SpecialistDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-gradient-to-br from-neutral-50 to-white">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/95 backdrop-blur-sm px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/specialist/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-trust-blue"
          >
            <div className="feature-icon health w-8 h-8">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-h3">VitalSense Specialist</span>
          </Link>
          <Link
            href="/specialist/dashboard"
            className="text-neutral-700 transition-colors hover:text-trust-blue font-medium"
          >
            Dashboard
          </Link>
          <Link href="#" className="text-neutral-700 transition-colors hover:text-trust-blue font-medium">
            Reports
          </Link>
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-4">
            <div className="inline-flex items-center px-4 py-2 bg-calm-purple/10 text-calm-purple rounded-pill text-body-sm font-medium">
              <Users className="w-4 h-4 mr-2" />
              Medical Specialist
            </div>
            <SpecialistName />
            <EnhancedButton 
              variant="ghost" 
              size="icon-sm" 
              className="text-neutral-600 hover:text-neutral-900"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Sign Out</span>
            </EnhancedButton>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  )
}
