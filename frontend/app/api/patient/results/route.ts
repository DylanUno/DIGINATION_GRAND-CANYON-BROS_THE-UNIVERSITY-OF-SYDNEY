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

    let patientId: number

    if (patientResult.length === 0) {
      // If no patient found by user_id, try direct lookup by id (for testing)
      const directPatientResult = await query(`
        SELECT id FROM patients WHERE id = $1
      `, [sessionUserId])
      
      if (directPatientResult.length === 0) {
        return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
      }
      
      patientId = directPatientResult[0].id
    } else {
      patientId = patientResult[0].id
    }

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

    // Fetch vital signs for the latest screening - try both old and new data structure
    let vitalSigns = await query(`
      SELECT measurement_type, value_text, value_numeric, unit, status, reference_range
      FROM vital_signs
      WHERE screening_id = $1
      ORDER BY measurement_type
    `, [screening.id])

    // If no vital signs found in old table, try to get from analysis_sessions
    if (vitalSigns.length === 0) {
      const analysisVitals = await query(`
        SELECT 
          heart_rate_bpm,
          respiratory_rate_bpm,
          pulse_rate_bpm,
          spo2_percent,
          hrv_sdnn,
          hrv_rmssd,
          clinical_notes
        FROM analysis_sessions 
        WHERE patient_id = (SELECT patient_id FROM patients WHERE id = $1)
        ORDER BY created_at DESC 
        LIMIT 1
      `, [patientId])

      if (analysisVitals.length > 0) {
        const vitals = analysisVitals[0]
        const clinicalNotes = vitals.clinical_notes ? 
          (typeof vitals.clinical_notes === 'string' ? JSON.parse(vitals.clinical_notes) : vitals.clinical_notes) : {}
        const temperature = clinicalNotes.temperature || null

        // Convert analysis session data to vital signs format
        vitalSigns = []
        
        if (vitals.heart_rate_bpm) {
          const hr = Math.round(vitals.heart_rate_bpm)
          vitalSigns.push({
            measurement_type: 'heart_rate',
            value_text: `${hr} bpm`,
            value_numeric: hr,
            unit: 'bpm',
            status: hr > 100 ? 'attention' : hr < 60 ? 'attention' : 'normal',
            reference_range: '60-100 bpm'
          })
        }

        if (vitals.respiratory_rate_bpm) {
          const rr = Math.round(vitals.respiratory_rate_bpm)
          vitalSigns.push({
            measurement_type: 'respiratory_rate',
            value_text: `${rr} breaths/min`,
            value_numeric: rr,
            unit: 'breaths/min',
            status: rr > 20 ? 'attention' : rr < 12 ? 'attention' : 'normal',
            reference_range: '12-20 breaths/min'
          })
        }

        if (vitals.spo2_percent) {
          const spo2 = Math.round(vitals.spo2_percent)
          vitalSigns.push({
            measurement_type: 'oxygen_saturation',
            value_text: `${spo2}%`,
            value_numeric: spo2,
            unit: '%',
            status: spo2 < 95 ? 'attention' : 'normal',
            reference_range: '95-100%'
          })
        }

        if (temperature) {
          const temp = parseFloat(temperature)
          if (!isNaN(temp)) {
            vitalSigns.push({
              measurement_type: 'temperature',
              value_text: `${temp}°C`,
              value_numeric: temp,
              unit: '°C',
              status: temp > 37.5 || temp < 35.5 ? 'attention' : 'normal',
              reference_range: '36.1-37.2°C'
            })
          }
        }

        if (vitals.pulse_rate_bpm && vitals.pulse_rate_bpm !== vitals.heart_rate_bpm) {
          const pr = Math.round(vitals.pulse_rate_bpm)
          vitalSigns.push({
            measurement_type: 'pulse_rate',
            value_text: `${pr} bpm`,
            value_numeric: pr,
            unit: 'bpm',
            status: pr > 100 ? 'attention' : pr < 60 ? 'attention' : 'normal',
            reference_range: '60-100 bpm'
          })
        }
      }
    }

    // Fetch health recommendations for the latest screening
    let recommendations = await query(`
      SELECT category, recommendation_text, priority
      FROM health_recommendations
      WHERE screening_id = $1
      ORDER BY priority DESC
    `, [screening.id])

    // If no recommendations found, try to get from specialist consultation
    if (recommendations.length === 0) {
      try {
        const consultationRecommendations = await query(`
          SELECT 
            clinical_notes,
            follow_up_instructions,
            created_at
          FROM specialist_consultations sc
          WHERE sc.patient_id = $1
          ORDER BY sc.created_at DESC
          LIMIT 1
        `, [patientId])

        if (consultationRecommendations.length > 0) {
          const consultation = consultationRecommendations[0]
          
          // Convert specialist recommendations to standard format
          if (consultation.clinical_notes) {
            recommendations.push({
              category: 'specialist_treatment',
              recommendation_text: consultation.clinical_notes,
              priority: 'medium' // Default to medium since urgency_assessment might not exist
            })
          }

          if (consultation.follow_up_instructions && 
              consultation.follow_up_instructions !== consultation.clinical_notes) {
            recommendations.push({
              category: 'follow_up',
              recommendation_text: consultation.follow_up_instructions,
              priority: 'medium'
            })
          }
        }
      } catch (error) {
        console.log('No specialist consultations found or table does not exist:', error)
        // Continue without specialist recommendations
      }
    }

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