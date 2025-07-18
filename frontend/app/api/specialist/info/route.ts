import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Fetch specialist information from database with user data
    const specialistData = await query(`
      SELECT 
        u.full_name,
        u.email,
        u.professional_credentials,
        s.specialty,
        s.years_experience,
        s.medical_license_number,
        s.license_verified,
        s.consultation_fee,
        s.board_certifications,
        s.education,
        s.phone_number
      FROM users u
      JOIN specialists s ON s.user_id = u.id
      WHERE u.id = $1
    `, [sessionUserId])

    if (specialistData.length === 0) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
    }

    const specialist = specialistData[0]

    // Get assigned health centers for this specialist
    let assignedCenters: Array<{id: number, name: string, type: string}> = []
    try {
      const healthCenters = await query(`
        SELECT hc.id, hc.name
        FROM health_centers hc
        JOIN specialist_assignments sa ON hc.id = sa.health_center_id
        JOIN specialists s ON sa.specialist_id = s.id
        WHERE s.user_id = $1 AND sa.is_active = true
        ORDER BY hc.name
      `, [sessionUserId])
      assignedCenters = healthCenters.map(center => ({
        id: center.id,
        name: center.name,
        type: 'puskesmas'
      })) || []
    } catch (error) {
      console.error('Error fetching assigned health centers:', error)
      assignedCenters = []
    }

    const responseData = {
      full_name: specialist.full_name || 'Dr. Specialist',
      specialization: specialist.specialty || 'General Medicine',
      hospital_name: assignedCenters.length > 0 ? assignedCenters[0].name : 'Medical Center',
      professional_credentials: specialist.professional_credentials || 'MD',
      email: specialist.email || 'specialist@example.com',
      phone_number: specialist.phone_number || '+1-555-0123',
      medical_license_number: specialist.medical_license_number || 'LIC123456',
      license_verified: specialist.license_verified !== false, // Default to true
      years_experience: specialist.years_experience || 10,
      board_certifications: specialist.board_certifications || ['Internal Medicine'],
      education: specialist.education || 'Medical University',
      consultation_fee: parseFloat(specialist.consultation_fee) || 150,
      assigned_centers: assignedCenters.map(center => ({
        id: center.id,
        name: center.name,
        type: center.type
      }))
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error fetching specialist info:', error)
    return NextResponse.json({ error: 'Failed to fetch specialist info' }, { status: 500 })
  }
} 