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

    // Fetch latest screening
    const latestScreening = await query(`
      SELECT hs.screening_date, hs.overall_status, hs.overall_notes
      FROM health_screenings hs
      WHERE hs.patient_id = $1
      ORDER BY hs.screening_date DESC
      LIMIT 1
    `, [patientId])

    // Fetch next appointment
    const nextAppointment = await query(`
      SELECT a.appointment_date, a.appointment_type, a.notes, hc.name as health_center_name
      FROM appointments a
      LEFT JOIN health_centers hc ON a.health_center_id = hc.id
      WHERE a.patient_id = $1 AND a.appointment_date > NOW() AND a.status = 'scheduled'
      ORDER BY a.appointment_date ASC
      LIMIT 1
    `, [patientId])

    // Fetch recent notifications
    const notifications = await query(`
      SELECT title, message, type, priority, read_status, action_required, created_at
      FROM patient_notifications
      WHERE patient_id = $1
      ORDER BY created_at DESC
      LIMIT 5
    `, [patientId])

    const dashboardData = {
      latestScreening: latestScreening.length > 0 ? {
        screening_date: latestScreening[0].screening_date,
        overall_status: latestScreening[0].overall_status,
        overall_notes: latestScreening[0].overall_notes
      } : null,
      nextAppointment: nextAppointment.length > 0 ? {
        appointment_date: nextAppointment[0].appointment_date,
        appointment_type: nextAppointment[0].appointment_type,
        health_center_name: nextAppointment[0].health_center_name,
        notes: nextAppointment[0].notes
      } : null,
      notifications: notifications.map(notification => ({
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        read_status: notification.read_status,
        action_required: notification.action_required,
        created_at: notification.created_at
      }))
    }

    return NextResponse.json(dashboardData)

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
} 