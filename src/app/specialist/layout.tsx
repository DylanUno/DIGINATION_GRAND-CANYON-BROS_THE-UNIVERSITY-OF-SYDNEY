"use client"

import type React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HeartPulse, LogOut } from "lucide-react"

export default function SpecialistDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  
  const handleLogout = () => {
    // In a real app with authentication, you would clear tokens/cookies here
    router.push("/")
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-brand-light-gray">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-primary px-4 md:px-6 z-50">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/specialist/dashboard"
            className="flex items-center gap-2 text-lg font-semibold md:text-base text-primary-foreground"
          >
            <HeartPulse className="h-6 w-6" />
            <span className="sr-only">HealthAI Platform</span>
            HealthAI Specialist
          </Link>
          <Link
            href="/specialist/dashboard"
            className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            Dashboard
          </Link>
          <Link
            href="#" // Placeholder for future reports page
            className="text-primary-foreground/80 transition-colors hover:text-primary-foreground"
          >
            Reports
          </Link>
        </nav>
        {/* Mobile menu can be added here if needed */}
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-primary-foreground/80 hidden sm:inline">Dr. Emily Carter</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary/80"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">{children}</main>
    </div>
  )
}
