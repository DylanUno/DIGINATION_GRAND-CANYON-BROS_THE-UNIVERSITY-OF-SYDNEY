"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Home, FileText, Clock, Download, LogOut, HeartPulse } from "lucide-react"

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: Home },
  { href: "/patient/results", label: "Latest Results", icon: FileText },
  { href: "/patient/medical-history", label: "Medical History", icon: Clock },
  { href: "/patient/reports", label: "Health Reports", icon: Download },
]

export function PatientSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r border-neutral-200 bg-gradient-to-b from-neutral-50 to-white md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b border-neutral-200 px-6">
          <Link href="/patient/dashboard" className="flex items-center gap-2 font-semibold text-trust-blue">
            <div className="feature-icon health w-8 h-8">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="text-h3">Patient Portal</span>
          </Link>
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
          <EnhancedButton variant="ghost" size="sm" className="w-full justify-start text-neutral-600">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </EnhancedButton>
        </div>
      </div>
    </div>
  )
}
