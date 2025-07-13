import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Get health worker's health center ID
    const healthWorkerResult = await query(`
      SELECT health_center_id FROM health_workers WHERE user_id = $1
    `, [sessionUserId])

    if (healthWorkerResult.length === 0) {
      return NextResponse.json({ error: 'Health worker not found' }, { status: 404 })
    }

    const healthCenterId = healthWorkerResult[0].health_center_id

    // Fetch active patients from the same health center
    const patients = await query(`
      SELECT p.id, p.phone, p.full_name, p.age,
             p.gender, p.patient_id, p.known_conditions, 
             p.current_medications, p.allergies, p.is_active
      FROM patients p
      WHERE p.registered_at_health_center_id = $1 AND p.is_active = true
      ORDER BY p.full_name
    `, [healthCenterId])

    const patientsData = patients.map(patient => ({
      patient_id: patient.patient_id || `PAT${patient.id.toString().padStart(3, '0')}`,
      full_name: patient.full_name,
      date_of_birth: null, // Not available in current schema
      phone_number: patient.phone,
      age: patient.age,
      gender: patient.gender,
      conditions: patient.known_conditions ? patient.known_conditions.split(',').map((c: string) => c.trim()) : [],
      medications: patient.current_medications ? patient.current_medications.split(',').map((m: string) => m.trim()) : [],
      allergies: patient.allergies ? patient.allergies.split(',').map((a: string) => a.trim()) : []
    }))

    return NextResponse.json(patientsData)

  } catch (error) {
    console.error('Error fetching patients:', error)
    return NextResponse.json({ error: 'Failed to fetch patients' }, { status: 500 })
  }
} 