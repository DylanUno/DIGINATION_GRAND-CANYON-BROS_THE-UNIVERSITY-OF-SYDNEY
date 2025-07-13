import { query, queryOne } from './database'
import bcrypt from 'bcryptjs'

// User types
export interface User {
  id: number
  role_id: number
  role_name: string
  is_active: boolean
  created_at: string
}

export interface Patient {
  id: number
  user_id: number
  phone_number: string
  first_name: string
  last_name: string
  date_of_birth: string
  gender: string
  health_center_id: number
  health_center_name: string
  medical_record_number: string
  status: string
}

export interface HealthWorker {
  id: number
  user_id: number
  employee_id: string
  email: string
  phone_number: string
  first_name: string
  last_name: string
  health_center_id: number
  health_center_name: string
  department: string
  position: string
}

export interface Specialist {
  id: number
  user_id: number
  professional_credentials: string
  email: string
  first_name: string
  last_name: string
  specialty: string
  medical_license_number: string
  license_verified: boolean
  years_experience: number
}

// Get current user from session (client-side)
export async function getCurrentUser(): Promise<User | null> {
  try {
    if (typeof window === 'undefined') return null
    
    const sessionToken = localStorage.getItem('sessionToken')
    if (!sessionToken) return null
    
    const userId = localStorage.getItem('userId')
    const userRole = localStorage.getItem('userRole')
    
    if (!userId || !userRole) return null
    
    return {
      id: parseInt(userId),
      role_id: 1, // simplified
      role_name: userRole,
      is_active: true,
      created_at: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Get patient data for current user
export async function getCurrentPatient(): Promise<Patient | null> {
  try {
    const user = await getCurrentUser()
    if (!user || user.role_name !== 'patient') {
      return null
    }

    const patient = await queryOne(`
      SELECT p.id, p.user_id, p.phone_number, p.first_name, p.last_name, 
             p.date_of_birth, p.gender, p.health_center_id, hc.name as health_center_name,
             p.medical_record_number, p.status
      FROM patients p
      JOIN health_centers hc ON p.health_center_id = hc.id
      WHERE p.user_id = $1
    `, [user.id])

    return patient
  } catch (error) {
    console.error('Error getting current patient:', error)
    return null
  }
}

// Get health worker data for current user
export async function getCurrentHealthWorker(): Promise<HealthWorker | null> {
  try {
    const user = await getCurrentUser()
    if (!user || user.role_name !== 'health_worker') {
      return null
    }

    const healthWorker = await queryOne(`
      SELECT hw.id, hw.user_id, hw.employee_id, hw.email, hw.phone_number,
             hw.first_name, hw.last_name, hw.health_center_id, hc.name as health_center_name,
             hw.department, hw.position
      FROM health_workers hw
      JOIN health_centers hc ON hw.health_center_id = hc.id
      WHERE hw.user_id = $1
    `, [user.id])

    return healthWorker
  } catch (error) {
    console.error('Error getting current health worker:', error)
    return null
  }
}

// Get specialist data for current user
export async function getCurrentSpecialist(): Promise<Specialist | null> {
  try {
    const user = await getCurrentUser()
    if (!user || user.role_name !== 'specialist') {
      return null
    }

    const specialist = await queryOne(`
      SELECT s.id, s.user_id, s.professional_credentials, s.email, s.first_name, s.last_name,
             s.specialty, s.medical_license_number, s.license_verified, s.years_experience
      FROM specialists s
      WHERE s.user_id = $1
    `, [user.id])

    return specialist
  } catch (error) {
    console.error('Error getting current specialist:', error)
    return null
  }
}

// Authenticate user with credentials
export async function authenticateUser(identifier: string, password: string, role: string): Promise<User | null> {
  try {
    let user: any = null
    
    if (role === 'patient') {
      // For patients, authenticate by phone number
      user = await queryOne(`
        SELECT u.id, u.role_id, ur.role_name, u.password_hash, u.is_active, u.created_at
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN patients p ON u.id = p.user_id
        WHERE p.phone_number = $1 AND ur.role_name = 'patient'
      `, [identifier])
    } else if (role === 'health_worker') {
      // For health workers, authenticate by employee_id, email, or phone
      user = await queryOne(`
        SELECT u.id, u.role_id, ur.role_name, u.password_hash, u.is_active, u.created_at
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN health_workers hw ON u.id = hw.user_id
        WHERE (hw.employee_id = $1 OR hw.email = $1 OR hw.phone_number = $1) 
        AND ur.role_name = 'health_worker'
      `, [identifier])
    } else if (role === 'specialist') {
      // For specialists, authenticate by professional credentials or email
      user = await queryOne(`
        SELECT u.id, u.role_id, ur.role_name, u.password_hash, u.is_active, u.created_at
        FROM users u
        JOIN user_roles ur ON u.role_id = ur.id
        JOIN specialists s ON u.id = s.user_id
        WHERE (s.professional_credentials = $1 OR s.email = $1) 
        AND ur.role_name = 'specialist'
      `, [identifier])
    }

    if (!user || !user.is_active) {
      return null
    }

    // Verify password using bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    // Update last login
    await query(`
      UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1
    `, [user.id])

    return {
      id: user.id,
      role_id: user.role_id,
      role_name: user.role_name,
      is_active: user.is_active,
      created_at: user.created_at
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

// Create user session
export async function createSession(userId: number, userAgent?: string, ipAddress?: string): Promise<string> {
  try {
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    
    await query(`
      INSERT INTO user_sessions (user_id, session_token, expires_at, user_agent, ip_address)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, sessionToken, expiresAt, userAgent, ipAddress])

    return sessionToken
  } catch (error) {
    console.error('Error creating session:', error)
    throw error
  }
}

// Delete user session
export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await query(`
      DELETE FROM user_sessions WHERE session_token = $1
    `, [sessionToken])
  } catch (error) {
    console.error('Error deleting session:', error)
    throw error
  }
}

// Generate secure session token
function generateSessionToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 36).toString(36)
  ).join('')
}

// Hash password (simplified for demo)
export async function hashPassword(password: string): Promise<string> {
  return password // For demo purposes, we'll store plain text passwords
}

// Check if user has access to health center
export async function hasHealthCenterAccess(userId: number, healthCenterId: number, role: string): Promise<boolean> {
  try {
    if (role === 'health_worker') {
      const result = await queryOne(`
        SELECT 1 FROM health_workers 
        WHERE user_id = $1 AND health_center_id = $2
      `, [userId, healthCenterId])
      return !!result
    } else if (role === 'specialist') {
      const result = await queryOne(`
        SELECT 1 FROM specialist_assignments sa
        JOIN specialists s ON sa.specialist_id = s.id
        WHERE s.user_id = $1 AND sa.health_center_id = $2 AND sa.is_active = true
      `, [userId, healthCenterId])
      return !!result
    }
    return false
  } catch (error) {
    console.error('Error checking health center access:', error)
    return false
  }
}

// Get user's accessible health centers
export async function getAccessibleHealthCenters(userId: number, role: string): Promise<any[]> {
  try {
    if (role === 'health_worker') {
      return await query(`
        SELECT hc.id, hc.name, hc.address, hc.type
        FROM health_centers hc
        JOIN health_workers hw ON hc.id = hw.health_center_id
        WHERE hw.user_id = $1
      `, [userId])
    } else if (role === 'specialist') {
      return await query(`
        SELECT hc.id, hc.name, hc.address, hc.type
        FROM health_centers hc
        JOIN specialist_assignments sa ON hc.id = sa.health_center_id
        JOIN specialists s ON sa.specialist_id = s.id
        WHERE s.user_id = $1 AND sa.is_active = true
      `, [userId])
    }
    return []
  } catch (error) {
    console.error('Error getting accessible health centers:', error)
    return []
  }
}

// Simple login function for frontend components
export async function login(credentials: {
  identifier: string
  password: string
  role: 'patient' | 'health_worker' | 'specialist'
}) {
  try {
    const user = await authenticateUser(credentials.identifier, credentials.password, credentials.role)
    
    if (!user) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Create session
    const sessionToken = await createSession(user.id)
    
    // Set cookie (simplified for demo)
    if (typeof window !== 'undefined') {
      localStorage.setItem('sessionToken', sessionToken)
      localStorage.setItem('userRole', user.role_name)
      localStorage.setItem('userId', user.id.toString())
    }

    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

// Logout function
export async function logout() {
  try {
    if (typeof window !== 'undefined') {
      const sessionToken = localStorage.getItem('sessionToken')
      if (sessionToken) {
        await deleteSession(sessionToken)
        localStorage.removeItem('sessionToken')
        localStorage.removeItem('userRole')
        localStorage.removeItem('userId')
      }
    }
  } catch (error) {
    console.error('Logout error:', error)
  }
} 

// Simple function to get current user ID for API calls (client-side only)
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userId')
} 