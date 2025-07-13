"use client"

import type React from "react"
import { PatientSidebar } from "@/components/patient-sidebar"
import { HeartPulse, Menu, LogOut } from "lucide-react"
import Link from "next/link"
import { EnhancedButton } from "@/components/ui/enhanced-button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { logout } from "@/lib/client-auth"

export default function PatientDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const navItems = [
    { href: "/patient/dashboard", label: "Dashboard" },
    { href: "/patient/results", label: "Hasil Terbaru" },
    { href: "/patient/medical-history", label: "Riwayat Medis" },
    { href: "/patient/appointments", label: "Janji Temu" },
    { href: "/patient/messages", label: "Pesan Aman" },
    { href: "/patient/education", label: "Edukasi Kesehatan" },
    { href: "/patient/privacy", label: "Privasi & Persetujuan" },
    { href: "/patient/help", label: "Bantuan" },
  ]

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <PatientSidebar />
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
                  <span>Portal Pasien</span>
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
                <EnhancedButton 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start text-neutral-600"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </EnhancedButton>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1"></div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-white">{children}</main>
      </div>
    </div>
  )
}
