import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Get specialist ID
    const specialistResult = await query(`
      SELECT id FROM specialists WHERE user_id = $1
    `, [sessionUserId])

    if (specialistResult.length === 0) {
      return NextResponse.json({ error: 'Specialist not found' }, { status: 404 })
    }

    const specialistId = specialistResult[0].id

    // Query real database for patient queue data (with privacy protection - initials only)
    // This queries health_screenings that need specialist attention
    // Only include screenings from the last 30 days with actual findings
    const queueData = await query(`
      SELECT 
        p.id as patient_id,
        LEFT(p.full_name, 1) || '.' || LEFT(SPLIT_PART(p.full_name, ' ', -1), 1) || '.' as initials,
        p.age,
        p.gender,
        hc.name as health_center_name,
        TO_CHAR(hs.screening_date, 'HH24:MI') as submission_time,
        CASE 
          WHEN hs.overall_status = 'urgent' THEN 'high'
          WHEN hs.overall_status = 'attention_needed' THEN 'medium'
          ELSE 'low'
        END as risk_level,
        COALESCE(hs.overall_notes, 'Routine health screening requiring specialist review') as symptoms,
        EXTRACT(EPOCH FROM (NOW() - hs.screening_date))/60 as minutes_ago
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      JOIN health_centers hc ON hs.health_center_id = hc.id
      WHERE hs.overall_status IN ('urgent', 'attention_needed')
        AND hs.screening_date >= NOW() - INTERVAL '30 days'
        AND hs.overall_notes IS NOT NULL
        AND hs.overall_notes != ''
      ORDER BY 
        CASE WHEN hs.overall_status = 'urgent' THEN 1 ELSE 2 END,
        hs.screening_date DESC
    `, [])

    // Format the response with wait time calculation
    const formattedQueueData = queueData.map(item => ({
      patient_id: `FRESH_PT${String(item.patient_id).padStart(3, '0')}`,
      initials: item.initials,
      age: item.age,
      gender: item.gender,
      health_center_name: item.health_center_name,
      submission_time: item.submission_time,
      risk_level: item.risk_level,
      symptoms: item.symptoms,
      wait_time: `${Math.round(item.minutes_ago)}m`
    }))

    return NextResponse.json(formattedQueueData)

  } catch (error) {
    console.error('Error fetching patient queue:', error)
    return NextResponse.json({ error: 'Failed to fetch patient queue' }, { status: 500 })
  }
} 