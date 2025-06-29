"use client"

import type React from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { HeartPulse, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  
  const handleLogout = () => {
    // In a real app with authentication, you would clear tokens/cookies here
    router.push("/")
  }
  
  const navItems = [
    { href: "/patient/dashboard", label: "Dashboard" },
    { href: "/patient/new-analysis", label: "New Analysis" },
    { href: "/patient/analysis-history", label: "Analysis History" },
    { href: "/patient/profile-settings", label: "Profile Settings" },
    { href: "/patient/help", label: "Help & Instructions" },
  ]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <PatientSidebar onLogout={handleLogout} />
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-brand-light-gray/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold mb-4 text-primary">
                  <HeartPulse className="h-6 w-6" />
                  <span>Patient Portal</span>
                </Link>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-gray-700 hover:text-primary hover:bg-gray-200"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">{/* Can add breadcrumbs or page title here */}</div>
          {/* User menu can go here */}
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-white">{children}</main>
      </div>
    </div>
  )
}
