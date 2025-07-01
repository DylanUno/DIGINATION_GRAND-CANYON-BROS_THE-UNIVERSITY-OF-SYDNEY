import type React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-strong sm:p-8">
        {children}
      </div>
    </div>
  )
}
