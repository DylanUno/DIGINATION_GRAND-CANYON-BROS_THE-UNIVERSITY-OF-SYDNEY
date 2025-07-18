import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { patientId } = params
    
    const response = await fetch(
      `http://localhost:8000/api/plots/patient-plots/${patientId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Error proxying patient-plots request:', error)
    return NextResponse.json(
      { error: 'Failed to fetch patient plots' },
      { status: 500 }
    )
  }
} 