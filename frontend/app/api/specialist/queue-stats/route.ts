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
      // No assigned health centers, return zero stats
      return NextResponse.json({
        totalCases: 0,
        highPriorityCases: 0,
        averageReviewTime: 0,
        todayReviewed: 0,
        todayHighPriority: 0,
        todayEmergency: 0
      })
    }

    const healthCenterIds = assignedCenters.map(center => center.health_center_id)

    // Query real database for specialist queue statistics from assigned health centers only
    const totalCasesResult = await query(`
      SELECT COUNT(*) as count
      FROM analysis_sessions a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.status IN ('PROCESSING', 'COMPLETED')
        AND a.created_at >= NOW() - INTERVAL '30 days'
        AND a.ai_risk_level IN ('HIGH', 'MEDIUM')
        AND p.registered_at_health_center_id = ANY($1)
    `, [healthCenterIds])

    const highPriorityCasesResult = await query(`
      SELECT COUNT(*) as count
      FROM analysis_sessions a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE a.status IN ('PROCESSING', 'COMPLETED')
        AND a.created_at >= NOW() - INTERVAL '30 days'
        AND a.ai_risk_level = 'HIGH'
        AND p.registered_at_health_center_id = ANY($1)
    `, [healthCenterIds])

    const todayReviewedResult = await query(`
      SELECT COUNT(*) as count
      FROM analysis_sessions a
      JOIN patients p ON a.patient_id = p.patient_id
      WHERE DATE(a.created_at) = CURRENT_DATE
      AND a.status = 'COMPLETED'
      AND p.registered_at_health_center_id = ANY($1)
    `, [healthCenterIds])

    const statsData = {
      totalCases: parseInt(totalCasesResult[0]?.count || '0'),
      highPriorityCases: parseInt(highPriorityCasesResult[0]?.count || '0'),
      averageReviewTime: 0, // Would need review time tracking in real implementation
      todayReviewed: parseInt(todayReviewedResult[0]?.count || '0'),
      todayHighPriority: parseInt(highPriorityCasesResult[0]?.count || '0'),
      todayEmergency: 0 // Would need emergency case tracking
    }

    return NextResponse.json(statsData)

  } catch (error) {
    console.error('Error fetching queue stats:', error)
    return NextResponse.json({ error: 'Failed to fetch queue stats' }, { status: 500 })
  }
} 