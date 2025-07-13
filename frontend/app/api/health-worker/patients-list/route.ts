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

    // Fetch patients with their latest screening information
    // NOTE: This shows ALL patients registered at the health center, 
    // not just those with screenings (which is correct for patient management)
    const patients = await query(`
      SELECT p.id, p.patient_id, p.full_name, p.age,
             p.gender, p.phone, p.is_active,
             MAX(hs.screening_date) as last_screening_date
      FROM patients p
      LEFT JOIN health_screenings hs ON p.id = hs.patient_id
      WHERE p.registered_at_health_center_id = $1
      GROUP BY p.id, p.patient_id, p.full_name, p.age,
               p.gender, p.phone, p.is_active
      ORDER BY p.full_name
    `, [healthCenterId])

    const patientsData = patients.map(patient => ({
      patient_id: patient.patient_id || `PAT${patient.id.toString().padStart(3, '0')}`,
      full_name: patient.full_name,
      date_of_birth: null, // Not available in current schema
      gender: patient.gender,
      phone_number: patient.phone,
      last_screening_date: patient.last_screening_date,
      status: patient.is_active ? 'Active' : 'Inactive',
      age: patient.age
    }))

    return NextResponse.json(patientsData)

  } catch (error) {
    console.error('Error fetching patients list:', error)
    return NextResponse.json({ error: 'Failed to fetch patients list' }, { status: 500 })
  }
} 