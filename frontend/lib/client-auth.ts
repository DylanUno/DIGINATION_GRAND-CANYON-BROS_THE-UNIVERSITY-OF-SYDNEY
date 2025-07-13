// Client-side authentication utilities
// This file contains ONLY browser-safe functions with no server dependencies

// Simple function to get current user ID for API calls (client-side only)
export function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userId')
}

// Get current user role
export function getCurrentUserRole(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userRole')
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

// Simple logout function
export function logout(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('sessionToken')
  localStorage.removeItem('userRole') 
  localStorage.removeItem('userId')
  localStorage.removeItem('isAuthenticated')
  
  // Redirect to login
  window.location.href = '/'
}

// Set authentication data after login
export function setAuthData(userId: string, userRole: string): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('userId', userId)
  localStorage.setItem('userRole', userRole)
  localStorage.setItem('isAuthenticated', 'true')
} 