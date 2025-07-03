"use client"

import type React from "react"
import { HealthWorkerSidebar } from "@/components/health-worker/sidebar"
import { HeartPulse, Menu, LogOut, Bell } from "lucide-react"
import Link from "next/link"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function HealthWorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: "/health-worker/dashboard", label: "Dashboard" },
    { href: "/health-worker/patients", label: "Patients" },
    { href: "/health-worker/upload", label: "Upload Data" },
    { href: "/health-worker/queue", label: "Patient Queue" },
  ]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <HealthWorkerSidebar />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <EnhancedButton variant="outline" size="icon-sm" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </EnhancedButton>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4 text-trust-blue">
                  <div className="feature-icon health w-8 h-8">
                    <HeartPulse className="h-4 w-4" />
                  </div>
                  <span>VitalSense</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-neutral-700 hover:text-trust-blue hover:bg-blue-50"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                <div className="mb-3 text-body-sm text-neutral-600">
                  <p className="font-medium text-neutral-900">Rural Health Center</p>
                  <p className="text-body-sm">Dr. Sarah Johnson</p>
                </div>
                <EnhancedButton variant="ghost" size="sm" className="w-full justify-start text-neutral-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </EnhancedButton>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <h1 className="text-h3 font-semibold text-neutral-900">Rural Health Center</h1>
          </div>
          <EnhancedButton variant="ghost" size="icon-sm" className="relative">
            <Bell className="h-5 w-5" />
            <StatusIndicator
              status="urgent"
              label="3"
              showIcon={false}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-risk-high text-white text-xs flex items-center justify-center"
            />
          </EnhancedButton>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-white">{children}</main>
      </div>
    </div>
  )
} 