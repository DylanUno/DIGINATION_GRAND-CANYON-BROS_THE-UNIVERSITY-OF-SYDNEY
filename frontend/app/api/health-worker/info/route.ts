import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session (simplified - in production would use proper session management)
    const sessionUserId = request.headers.get('x-user-id')
    
    if (!sessionUserId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 })
    }
    
    // Fetch health worker information from database
    const healthWorkerData = await query(`
      SELECT hw.id, hw.employee_id, hw.email, hw.phone_number,
             hw.first_name, hw.last_name, hw.department, hw.position,
             hw.health_center_id, hc.name as health_center_name
      FROM health_workers hw
      JOIN health_centers hc ON hw.health_center_id = hc.id
      WHERE hw.user_id = $1
    `, [sessionUserId])

    if (healthWorkerData.length === 0) {
      return NextResponse.json({ error: 'Health worker not found' }, { status: 404 })
    }

    const healthWorker = healthWorkerData[0]

    return NextResponse.json({
      id: healthWorker.id,
      first_name: healthWorker.first_name,
      last_name: healthWorker.last_name,
      employee_id: healthWorker.employee_id,
      email: healthWorker.email,
      phone_number: healthWorker.phone_number,
      health_center_name: healthWorker.health_center_name,
      health_center_id: healthWorker.health_center_id,
      department: healthWorker.department,
      position: healthWorker.position
    })

  } catch (error) {
    console.error('Error fetching health worker info:', error)
    return NextResponse.json({ error: 'Failed to fetch health worker info' }, { status: 500 })
  }
} 