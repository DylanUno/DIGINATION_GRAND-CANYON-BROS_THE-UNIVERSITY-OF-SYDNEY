import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
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

    // Fetch patient data with health center verification
    const patientResult = await query(`
      SELECT p.*, hc.name as health_center_name
      FROM patients p
      JOIN health_centers hc ON p.registered_at_health_center_id = hc.id
      WHERE p.patient_id = $1 AND p.registered_at_health_center_id = $2
    `, [id, healthCenterId])

    if (patientResult.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const patient = patientResult[0]

    // Fetch patient's medical history (health screenings)
    const medicalHistoryResult = await query(`
      SELECT hs.screening_date, hs.overall_status, hs.overall_notes,
             hw.first_name || ' ' || hw.last_name as health_worker_name
      FROM health_screenings hs
      LEFT JOIN health_workers hw ON hs.health_worker_id = hw.id
      WHERE hs.patient_id = $1
      ORDER BY hs.screening_date DESC
    `, [patient.id])

    // Fetch analysis history
    const analysisHistoryResult = await query(`
      SELECT hs.id, hs.screening_date, hs.overall_status, hs.overall_notes
      FROM health_screenings hs
      WHERE hs.patient_id = $1
      ORDER BY hs.screening_date DESC
    `, [patient.id])

    // Format the response
    const responseData = {
      id: patient.patient_id || `PAT${patient.id.toString().padStart(3, '0')}`,
      name: patient.full_name,
      dateOfBirth: patient.date_of_birth || null,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      village: patient.village,
      city: patient.city,
      province: patient.province,
      emergencyContact: {
        name: patient.emergency_contact_name,
        phone: patient.emergency_contact_phone,
        relationship: 'Emergency Contact'
      },
      medicalInfo: {
        weight: patient.weight_kg,
        height: patient.height_cm,
        bmi: patient.weight_kg && patient.height_cm ? 
          Math.round((patient.weight_kg / Math.pow(patient.height_cm / 100, 2)) * 10) / 10 : null,
        bloodType: null, // Not in schema
        allergies: patient.allergies ? patient.allergies.split(',').map((a: string) => a.trim()) : [],
        conditions: patient.known_conditions ? patient.known_conditions.split(',').map((c: string) => c.trim()) : [],
      },
      registrationDate: patient.created_at,
      lastVisit: medicalHistoryResult.length > 0 ? medicalHistoryResult[0].screening_date : null,
      healthCenterName: patient.health_center_name,
      medicalHistory: medicalHistoryResult.map((history, index) => ({
        date: new Date(history.screening_date).toISOString().split('T')[0],
        type: index === 0 ? 'Recent Check-up' : 'Follow-up',
        notes: history.overall_notes || 'Health screening completed.',
        provider: history.health_worker_name || 'Health Worker'
      })),
      analysisHistory: analysisHistoryResult.map(analysis => ({
        id: `A${analysis.id.toString().padStart(3, '0')}`,
        date: new Date(analysis.screening_date).toISOString().split('T')[0],
        time: new Date(analysis.screening_date).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        riskLevel: analysis.overall_status === 'urgent' ? 'High' : 
                   analysis.overall_status === 'attention_needed' ? 'Medium' : 'Low',
        status: 'Completed',
        findings: analysis.overall_notes || 'Health screening completed.'
      }))
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error fetching patient data:', error)
    return NextResponse.json({ error: 'Failed to fetch patient data' }, { status: 500 })
  }
} 