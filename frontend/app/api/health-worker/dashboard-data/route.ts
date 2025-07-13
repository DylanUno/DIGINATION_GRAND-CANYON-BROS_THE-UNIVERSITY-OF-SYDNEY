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

    // Fetch daily statistics for the health center
    const dailyStats = await query(`
      SELECT patients_processed, pending_reviews, urgent_cases, average_processing_time_minutes
      FROM daily_statistics 
      WHERE health_center_id = $1 AND stat_date = CURRENT_DATE
    `, [healthCenterId])

    // Fetch today's patient screenings (from health_screenings table for consistency)
    const todaysPatients = await query(`
      SELECT hs.id, p.full_name, hs.screening_date,
             hs.overall_status, hs.overall_status as analysis_status,
             'medium' as ai_risk_level, 50 as progress_percentage
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE p.registered_at_health_center_id = $1 
      AND DATE(hs.screening_date) = CURRENT_DATE
      ORDER BY hs.screening_date DESC
    `, [healthCenterId])

    // Fetch urgent alerts from health screenings with concerning statuses
    const urgentAlerts = await query(`
      SELECT 'High-Risk Case' as type,
             'Patient ' || LEFT(p.full_name, 1) || '. requires immediate specialist attention - Recent screening shows concerning results' as message,
             EXTRACT(EPOCH FROM (NOW() - hs.screening_date))/60 as minutes_ago,
             'urgent' as priority
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE p.registered_at_health_center_id = $1 AND hs.overall_status = 'attention_needed'
      ORDER BY hs.screening_date DESC
      LIMIT 3
    `, [healthCenterId])

    const dashboardData = {
      dailyStats: dailyStats.length > 0 ? {
        patients_processed: dailyStats[0].patients_processed,
        pending_reviews: dailyStats[0].pending_reviews,
        urgent_cases: dailyStats[0].urgent_cases,
        average_processing_time_minutes: dailyStats[0].average_processing_time_minutes
      } : {
        patients_processed: 0,
        pending_reviews: 0,
        urgent_cases: 0,
        average_processing_time_minutes: 0
      },
      todaysPatients: todaysPatients.map(patient => ({
        id: patient.id,
        name: patient.full_name,
        screening_date: patient.screening_date,
        overall_status: patient.overall_status,
        analysis_status: patient.analysis_status,
        ai_risk_level: patient.ai_risk_level || 'Unknown',
        specialist_status: patient.progress_percentage === 100 ? 'completed' : 'pending'
      })),
      urgentAlerts: urgentAlerts.map(alert => ({
        type: alert.type,
        message: alert.message,
        minutes_ago: Math.round(alert.minutes_ago),
        priority: alert.priority
      }))
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
} 