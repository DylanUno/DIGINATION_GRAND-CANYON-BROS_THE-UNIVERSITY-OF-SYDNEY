import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Get specialist ID and assigned health centers
    const specialistResult = await query(`
      SELECT s.id FROM specialists s WHERE s.user_id = $1
    `, [sessionUserId])

    if (specialistResult.length === 0) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
    }

    const specialistId = specialistResult[0].id

    // Get assigned health centers for this specialist
    const assignedCenters = await query(`
      SELECT health_center_id FROM specialist_assignments 
      WHERE specialist_id = $1 AND is_active = true
    `, [specialistId])

    if (assignedCenters.length === 0) {
      // No assigned health centers, return empty queue
      return NextResponse.json([])
    }

    const healthCenterIds = assignedCenters.map(center => center.health_center_id)

    // Query real database for patient queue data from analysis_sessions 
    // Only from assigned health centers
    const queueData = await query(`
      WITH latest_sessions AS (
        SELECT DISTINCT ON (p.patient_id)
          p.patient_id,
          LEFT(p.full_name, 1) || '.' || LEFT(SPLIT_PART(p.full_name, ' ', -1), 1) || '.' as initials,
          p.age,
          p.gender,
          COALESCE(hc.name, 'VitalSense Health Center') as health_center_name,
          TO_CHAR(a.created_at, 'HH24:MI') as submission_time,
          CASE 
            WHEN a.ai_risk_level = 'CRITICAL' THEN 'high'
            WHEN a.ai_risk_level = 'HIGH' THEN 'high'
            WHEN a.ai_risk_level = 'MEDIUM' THEN 'medium'
            ELSE 'low'
          END as risk_level,
          COALESCE(a.chief_complaint, 'ECG analysis requiring specialist review') as symptoms,
          EXTRACT(EPOCH FROM (NOW() - a.created_at))/60 as minutes_ago,
          a.ai_risk_level
        FROM analysis_sessions a
        JOIN patients p ON a.patient_id = p.patient_id
        LEFT JOIN health_centers hc ON p.registered_at_health_center_id = hc.id
        WHERE a.status IN ('PROCESSING', 'COMPLETED')
          AND a.created_at >= NOW() - INTERVAL '30 days'
          AND a.patient_id IS NOT NULL
          AND p.registered_at_health_center_id = ANY($1)
        ORDER BY p.patient_id, a.created_at DESC
      )
      SELECT * FROM latest_sessions
      ORDER BY 
        CASE WHEN ai_risk_level = 'CRITICAL' THEN 1 
             WHEN ai_risk_level = 'HIGH' THEN 2 
             WHEN ai_risk_level = 'MEDIUM' THEN 3
             ELSE 4 END,
        minutes_ago DESC
    `, [healthCenterIds])

    // Format the response with wait time calculation
    const formattedQueueData = queueData.map(item => ({
      patient_id: item.patient_id, // Use real patient_id from database
      initials: item.initials,
      age: item.age,
      gender: item.gender,
      health_center_name: item.health_center_name,
      submission_time: item.submission_time,
      risk_level: item.risk_level,
      symptoms: item.symptoms,
      wait_time: `${Math.max(0, Math.round(item.minutes_ago))}m` // Ensure non-negative wait time
    }))

    return NextResponse.json(formattedQueueData)

  } catch (error) {
    console.error('Error fetching patient queue:', error)
    return NextResponse.json({ error: 'Failed to fetch patient queue' }, { status: 500 })
  }
} 