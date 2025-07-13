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

    // Fetch queue data from health_screenings table for this health center (for consistency)
    const queueData = await query(`
      SELECT hs.id, p.full_name, p.patient_id, p.id as patient_record_id,
             hs.screening_date as upload_time, hs.overall_status as status, 
             'medium' as ai_risk_level, 75 as progress_percentage,
             (hs.screening_date + INTERVAL '2 hours') as estimated_completion
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE p.registered_at_health_center_id = $1
      ORDER BY hs.screening_date DESC
    `, [healthCenterId])

    const formattedQueueData = queueData.map(item => ({
      id: `Q${item.id.toString().padStart(3, '0')}`,
      patientName: item.full_name,
      patientId: item.patient_id || `PAT${item.patient_record_id.toString().padStart(3, '0')}`, // ← FIXED: using patient record ID
      uploadTime: new Date(item.upload_time).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      status: getStatusLabel(item.status),
      aiRiskLevel: item.ai_risk_level,
      estimatedCompletion: item.estimated_completion ? new Date(item.estimated_completion).toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) : null,
      progress: item.progress_percentage || 0,
    }))

    return NextResponse.json(formattedQueueData)

  } catch (error) {
    console.error('Error fetching queue data:', error)
    return NextResponse.json({ error: 'Failed to fetch queue data' }, { status: 500 })
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'completed':
      return 'Completed'
    case 'attention_needed':
      return 'Urgent Review'
    case 'healthy':
      return 'Completed'
    case 'processing':
      return 'Processing'
    default:
      return 'Processing'
  }
} 