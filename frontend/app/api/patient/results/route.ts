import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Get patient ID from user ID
    const patientResult = await query(`
      SELECT id FROM patients WHERE user_id = $1
    `, [sessionUserId])

    if (patientResult.length === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const patientId = patientResult[0].id

    // Fetch latest screening with health worker and facility info
    const latestScreening = await query(`
      SELECT hs.id, hs.screening_date, hs.overall_status, hs.overall_notes,
             hw.first_name as health_worker_first_name, hw.last_name as health_worker_last_name,
             hc.name as facility_name
      FROM health_screenings hs
      LEFT JOIN health_workers hw ON hs.health_worker_id = hw.id
      LEFT JOIN health_centers hc ON hs.health_center_id = hc.id
      WHERE hs.patient_id = $1
      ORDER BY hs.screening_date DESC
      LIMIT 1
    `, [patientId])

    if (latestScreening.length === 0) {
      // Return empty state instead of 404 for users with no screenings yet
      return NextResponse.json({
        latestScreening: null,
        vitalSigns: [],
        recommendations: []
      })
    }

    const screening = latestScreening[0]

    // Fetch vital signs for the latest screening
    const vitalSigns = await query(`
      SELECT measurement_type, value_text, value_numeric, unit, status, reference_range
      FROM vital_signs
      WHERE screening_id = $1
      ORDER BY measurement_type
    `, [screening.id])

    // Fetch health recommendations for the latest screening
    const recommendations = await query(`
      SELECT category, recommendation_text, priority
      FROM health_recommendations
      WHERE screening_id = $1
      ORDER BY priority DESC
    `, [screening.id])

    const resultsData = {
      latestScreening: {
        id: screening.id,
        screening_date: screening.screening_date,
        overall_status: screening.overall_status,
        overall_notes: screening.overall_notes,
        facility_name: screening.facility_name,
        health_worker_first_name: screening.health_worker_first_name,
        health_worker_last_name: screening.health_worker_last_name
      },
      vitalSigns: vitalSigns.map(vs => ({
        measurement_type: vs.measurement_type,
        value_text: vs.value_text,
        value_numeric: vs.value_numeric,
        unit: vs.unit,
        status: vs.status,
        reference_range: vs.reference_range
      })),
      recommendations: recommendations.map(rec => ({
        category: rec.category,
        recommendation: rec.recommendation_text,
        priority: rec.priority
      }))
    }

    return NextResponse.json(resultsData)

  } catch (error) {
    console.error('Error fetching patient results:', error)
    return NextResponse.json({ error: 'Failed to fetch patient results' }, { status: 500 })
  }
} 