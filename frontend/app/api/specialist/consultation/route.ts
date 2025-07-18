import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      patient_id,
      clinical_notes,
      icd10_diagnosis_code,
      icd10_diagnosis_description,
      urgency_assessment,
      treatment_recommendations,
      additional_tests_required,
      follow_up_instructions,
      requires_emergency_care,
      requires_additional_info,
      specialist_id
    } = body

    if (!patient_id || !treatment_recommendations) {
      return NextResponse.json(
        { error: 'Patient ID and treatment recommendations are required' },
        { status: 400 }
      )
    }

    // Get the latest analysis session for this patient
    const analysisSessionResult = await query(`
      SELECT id, session_id
      FROM analysis_sessions 
      WHERE patient_id = $1 
      ORDER BY created_at DESC 
      LIMIT 1
    `, [patient_id])

    if (analysisSessionResult.length === 0) {
      return NextResponse.json(
        { error: 'No analysis session found for this patient' },
        { status: 404 }
      )
    }

    const analysisSession = analysisSessionResult[0]

    // Get the latest health screening for this patient
    const screeningResult = await query(`
      SELECT hs.id 
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE p.patient_id = $1
      ORDER BY hs.screening_date DESC
      LIMIT 1
    `, [patient_id])

    if (screeningResult.length === 0) {
      return NextResponse.json(
        { error: 'No health screening found for this patient' },
        { status: 404 }
      )
    }

    const screening_id = screeningResult[0].id

    // Get patient internal ID
    const patientResult = await query(`
      SELECT id FROM patients WHERE patient_id = $1
    `, [patient_id])

    if (patientResult.length === 0) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    const patient_internal_id = patientResult[0].id

    // Insert the specialist consultation
    const consultationResult = await query(`
      INSERT INTO specialist_consultations (
        specialist_queue_id,
        specialist_id,
        patient_id,
        screening_id,
        clinical_notes,
        icd10_diagnosis_code,
        icd10_diagnosis_description,
        urgency_assessment,
        treatment_recommendations,
        additional_tests_required,
        follow_up_instructions,
        requires_emergency_care,
        requires_additional_info,
        consultation_duration_minutes,
        created_at,
        updated_at
      ) VALUES (
        NULL,
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        5,
        NOW(),
        NOW()
      ) RETURNING id
    `, [
      specialist_id || 1, // Default specialist ID - TODO: get from session
      patient_internal_id,
      screening_id,
      clinical_notes,
      icd10_diagnosis_code,
      icd10_diagnosis_description,
      urgency_assessment,
      treatment_recommendations,
      additional_tests_required ? JSON.stringify(additional_tests_required) : null,
      follow_up_instructions,
      requires_emergency_care || false,
      requires_additional_info || false
    ])

    // Update the analysis session with specialist review
    await query(`
      UPDATE analysis_sessions 
      SET 
        specialist_user_id = $1,
        specialist_notes = $2,
        specialist_recommendations = $3,
        specialist_follow_up_needed = $4,
        specialist_follow_up_timeframe = $5,
        status = 'completed',
        specialist_review_completed_at = NOW(),
        updated_at = NOW()
      WHERE id = $6
    `, [
      specialist_id || 1,
      clinical_notes,
      treatment_recommendations,
      follow_up_instructions ? true : false,
      urgency_assessment === 'routine' ? '1-2 weeks' : urgency_assessment === 'urgent' ? '24-48 hours' : 'immediate',
      analysisSession.id
    ])

    // Update specialist queue status if exists
    await query(`
      UPDATE specialist_queue 
      SET 
        status = 'completed',
        assigned_specialist_id = $1,
        completed_at = NOW()
      WHERE patient_id = $2 AND status IN ('pending', 'in_review')
    `, [specialist_id || 1, patient_internal_id])

    return NextResponse.json({
      success: true,
      consultation_id: consultationResult[0].id,
      message: 'Consultation completed successfully'
    })

  } catch (error) {
    console.error('Error submitting consultation:', error)
    return NextResponse.json(
      { error: 'Failed to submit consultation' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const patient_id = url.searchParams.get('patient_id')
    
    if (!patient_id) {
      return NextResponse.json({ error: 'Patient ID is required' }, { status: 400 })
    }

    // Get the latest specialist consultation for this patient
    const consultationResult = await query(`
      SELECT 
        sc.id,
        sc.clinical_notes,
        sc.icd10_diagnosis_code,
        sc.icd10_diagnosis_description,
        sc.urgency_assessment,
        sc.treatment_recommendations,
        sc.additional_tests_required,
        sc.follow_up_instructions,
        sc.requires_emergency_care,
        sc.requires_additional_info,
        sc.created_at,
        u.username as specialist_name
      FROM specialist_consultations sc
      LEFT JOIN users u ON sc.specialist_id = u.id
      JOIN patients p ON sc.patient_id = p.id
      WHERE p.patient_id = $1
      ORDER BY sc.created_at DESC
      LIMIT 1
    `, [patient_id])

    if (consultationResult.length === 0) {
      return NextResponse.json({
        consultation: null,
        message: 'No specialist consultation found for this patient'
      })
    }

    const consultation = consultationResult[0]

    return NextResponse.json({
      consultation: {
        id: consultation.id,
        clinical_notes: consultation.clinical_notes,
        diagnosis_code: consultation.icd10_diagnosis_code,
        diagnosis_description: consultation.icd10_diagnosis_description,
        urgency: consultation.urgency_assessment,
        treatment_recommendations: consultation.treatment_recommendations,
        additional_tests: consultation.additional_tests_required,
        follow_up_instructions: consultation.follow_up_instructions,
        emergency_care_required: consultation.requires_emergency_care,
        additional_info_required: consultation.requires_additional_info,
        consultation_date: consultation.created_at,
        specialist_name: consultation.specialist_name
      }
    })

  } catch (error) {
    console.error('Error fetching consultation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultation' },
      { status: 500 }
    )
  }
} 