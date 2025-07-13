import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Fetch patient information from database
    const patientData = await query(`
      SELECT p.id, p.full_name, p.phone, p.age, p.gender, p.weight_kg, p.height_cm,
             p.address, p.village, p.city, p.province, p.patient_id,
             p.registered_at_health_center_id, hc.name as health_center_name,
             p.emergency_contact_name, p.emergency_contact_phone, p.is_active, p.created_at
      FROM patients p
      LEFT JOIN health_centers hc ON p.registered_at_health_center_id = hc.id
      WHERE p.user_id = $1
    `, [sessionUserId])

    if (patientData.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const patient = patientData[0]

    return NextResponse.json({
      id: patient.id,
      full_name: patient.full_name,
      first_name: patient.full_name?.split(' ')[0] || '',
      last_name: patient.full_name?.split(' ').slice(1).join(' ') || '',
      phone_number: patient.phone,
      age: patient.age,
      gender: patient.gender,
      weight_kg: patient.weight_kg,
      height_cm: patient.height_cm,
      address: patient.address,
      city: patient.city,
      province: patient.province,
      patient_id: patient.patient_id,
      health_center_id: patient.registered_at_health_center_id,
      health_center_name: patient.health_center_name,
      emergency_contact_name: patient.emergency_contact_name,
      emergency_contact_phone: patient.emergency_contact_phone,
      is_active: patient.is_active,
      registration_date: patient.created_at
    })

  } catch (error) {
    console.error('Error fetching patient info:', error)
    return NextResponse.json({ error: 'Failed to fetch patient info' }, { status: 500 })
  }
} 