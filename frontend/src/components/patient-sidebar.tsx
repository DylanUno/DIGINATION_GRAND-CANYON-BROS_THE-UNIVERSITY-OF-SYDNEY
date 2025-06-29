"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, User, HelpCircle, LogOut, HeartPulse } from "lucide-react"

const navItems = [
  { href: "/patient/dashboard", label: "Dashboard", icon: Home },
  { href: "/patient/new-analysis", label: "New Analysis", icon: FileText },
  { href: "/patient/analysis-history", label: "Analysis History", icon: FileText },
  { href: "/patient/profile-settings", label: "Profile Settings", icon: User },
  { href: "/patient/help", label: "Help & Instructions", icon: HelpCircle },
]

interface PatientSidebarProps {
  onLogout?: () => void;
}

export function PatientSidebar({ onLogout }: PatientSidebarProps) {
  const pathname = usePathname()

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="hidden border-r bg-brand-light-gray/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/patient/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <HeartPulse className="h-6 w-6" />
            <span>Patient Portal</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:text-primary hover:bg-gray-200",
                  pathname === item.href && "bg-primary/10 text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}
