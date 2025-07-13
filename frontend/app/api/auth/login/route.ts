import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { role, identifier, password } = await request.json()

    if (!identifier || !password || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let user = null
    let userData = null

    // Authentication logic based on new database structure
    switch (role) {
      case 'patient':
        // For patients, authenticate by phone number
        const patientResult = await query(`
          SELECT u.id, u.role, u.password_hash, u.is_active, u.full_name, u.phone,
                 p.id as patient_id, p.full_name as patient_name, p.phone as patient_phone,
                 p.registered_at_health_center_id, hc.name as health_center_name
          FROM users u
          JOIN patients p ON u.id = p.user_id
          LEFT JOIN health_centers hc ON p.registered_at_health_center_id = hc.id
          WHERE u.phone = $1 AND u.role = 'PATIENT'
        `, [identifier])
        
        if (patientResult.length > 0) {
          user = patientResult[0]
          userData = {
            id: user.id,
            patient_id: user.patient_id,
            name: user.patient_name || user.full_name,
            phone: user.patient_phone || user.phone,
            health_center_id: user.registered_at_health_center_id,
            health_center_name: user.health_center_name,
            role: 'patient'
          }
        }
        break

      case 'health-worker':
        // For health workers, authenticate by employee_id, email, or phone
        const healthWorkerResult = await query(`
          SELECT u.id, u.role, u.password_hash, u.is_active, u.full_name, u.email as user_email, u.phone,
                 hw.id as health_worker_id, hw.employee_id, hw.email, hw.phone_number,
                 hw.first_name, hw.last_name, hw.department, hw.position,
                 hw.health_center_id, hc.name as health_center_name
          FROM users u
          JOIN health_workers hw ON u.id = hw.user_id
          LEFT JOIN health_centers hc ON hw.health_center_id = hc.id
          WHERE (hw.employee_id = $1 OR u.email = $1 OR u.phone = $1)
          AND u.role = 'HEALTH_WORKER'
        `, [identifier])
        
        if (healthWorkerResult.length > 0) {
          user = healthWorkerResult[0]
          userData = {
            id: user.id,
            health_worker_id: user.health_worker_id,
            name: user.full_name || `${user.first_name} ${user.last_name}`,
            employee_id: user.employee_id,
            email: user.user_email || user.email,
            phone: user.phone || user.phone_number,
            department: user.department,
            position: user.position,
            health_center_id: user.health_center_id,
            health_center_name: user.health_center_name,
            role: 'health-worker'
          }
        }
        break

      case 'specialist':
        // For specialists, authenticate by professional credentials or email
        const specialistResult = await query(`
          SELECT u.id, u.role, u.password_hash, u.is_active, u.full_name, u.email as user_email,
                 s.id as specialist_id, s.professional_credentials, s.email,
                 s.first_name, s.last_name, s.specialty, s.medical_license_number,
                 s.license_verified, s.years_experience
          FROM users u
          JOIN specialists s ON u.id = s.user_id
          WHERE (u.professional_credentials = $1 OR u.email = $1)
          AND u.role = 'SPECIALIST'
        `, [identifier])
        
        if (specialistResult.length > 0) {
          user = specialistResult[0]
          userData = {
            id: user.id,
            specialist_id: user.specialist_id,
            name: user.full_name || `${user.first_name} ${user.last_name}`,
            credentials: user.professional_credentials,
            email: user.user_email || user.email,
            specialty: user.specialty,
            medical_license_number: user.medical_license_number,
            license_verified: user.license_verified,
            years_experience: user.years_experience,
            role: 'specialist'
          }
        }
        break

      default:
        return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Check if user was found
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash)
    
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check if user is active
    if (!user.is_active) {
      return NextResponse.json({ error: 'Account is inactive' }, { status: 401 })
    }

    // Update last login
    await query(`
      UPDATE users 
      SET last_login = CURRENT_TIMESTAMP 
      WHERE id = $1
    `, [user.id])

    // Return success response
    return NextResponse.json({
      success: true,
      user: userData,
      role: role
    })

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
} 