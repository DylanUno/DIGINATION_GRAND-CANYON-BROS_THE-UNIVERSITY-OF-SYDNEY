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

    // Query real database for specialist queue statistics
    // Use same filtering criteria as patient queue for consistency
    const totalCasesResult = await query(`
      SELECT COUNT(*) as count
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE hs.overall_status IN ('urgent', 'attention_needed')
        AND hs.screening_date >= NOW() - INTERVAL '30 days'
        AND hs.overall_notes IS NOT NULL
        AND hs.overall_notes != ''
    `)

    const highPriorityCasesResult = await query(`
      SELECT COUNT(*) as count
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE hs.overall_status = 'urgent'
        AND hs.screening_date >= NOW() - INTERVAL '30 days'
        AND hs.overall_notes IS NOT NULL
        AND hs.overall_notes != ''
    `)

    const todayReviewedResult = await query(`
      SELECT COUNT(*) as count
      FROM health_screenings hs
      JOIN patients p ON hs.patient_id = p.id
      WHERE DATE(hs.screening_date) = CURRENT_DATE
      AND hs.overall_status IN ('healthy', 'completed')
    `)

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