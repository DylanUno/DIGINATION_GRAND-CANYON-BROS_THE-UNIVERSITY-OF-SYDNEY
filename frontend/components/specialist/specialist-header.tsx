"use client"

import { useState, useEffect } from "react"
import { getCurrentUserId } from "@/lib/client-auth"

interface SpecialistInfo {
  full_name: string
  specialization: string
}

export function SpecialistName() {
  const [specialistInfo, setSpecialistInfo] = useState<SpecialistInfo | null>(null)

  useEffect(() => {
    async function fetchSpecialistInfo() {
      try {
        const userId = getCurrentUserId()
        if (!userId) return

        const response = await fetch('/api/specialist/info', {
          headers: {
            'x-user-id': userId
          }
        })

        if (response.ok) {
          const data = await response.json()
          setSpecialistInfo(data)
        }
      } catch (error) {
        console.error('Error fetching specialist info:', error)
      }
    }

    fetchSpecialistInfo()
  }, [])

  return (
    <span className="text-body text-neutral-700 hidden sm:inline">
      {specialistInfo?.full_name || 'Dr. Specialist'}
    </span>
  )
} 