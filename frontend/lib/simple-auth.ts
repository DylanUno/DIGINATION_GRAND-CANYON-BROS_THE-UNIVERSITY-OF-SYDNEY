// Simplified authentication for client-side components
// This uses hardcoded credentials for demo purposes

const mockCredentials = {
  patient: {
    identifier: '+6281234567890',
    password: 'password123',
    redirect: '/patient/dashboard'
  },
  'health-worker': {
    identifier: 'HW001',
    password: 'healthworker123',
    redirect: '/health-worker/dashboard'
  },
  specialist: {
    identifier: 'dr.carter@hospital.com',
    password: 'specialist123',
    redirect: '/specialist/dashboard'
  }
}

export interface LoginCredentials {
  identifier: string
  password: string
  role: 'patient' | 'health-worker' | 'specialist'
}

export interface LoginResult {
  success: boolean
  error?: string
  redirectUrl?: string
}

export async function simpleLogin(credentials: LoginCredentials): Promise<LoginResult> {
  // Simulate async operation
  await new Promise(resolve => setTimeout(resolve, 500))

  const roleConfig = mockCredentials[credentials.role]
  
  if (!roleConfig) {
    return { success: false, error: 'Invalid role' }
  }

  if (credentials.identifier === roleConfig.identifier && 
      credentials.password === roleConfig.password) {
    
    // Store simple session info
    if (typeof window !== 'undefined') {
      localStorage.setItem('userRole', credentials.role)
      localStorage.setItem('userId', credentials.identifier)
      localStorage.setItem('isAuthenticated', 'true')
    }

    return { 
      success: true, 
      redirectUrl: roleConfig.redirect 
    }
  }

  return { success: false, error: 'Invalid credentials' }
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userId')
    localStorage.removeItem('isAuthenticated')
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export function getCurrentRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userRole')
} 