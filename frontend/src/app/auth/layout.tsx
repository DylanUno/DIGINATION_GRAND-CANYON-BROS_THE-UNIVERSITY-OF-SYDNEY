import { ReactNode } from "react"

export default function AuthLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-neutral-50 to-blue-50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-strong border border-neutral-200">{children}</div>
    </div>
  )
}
