import { Pool, PoolClient } from 'pg'

// Create a connection pool for better performance
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Increased timeout
  maxUses: 7500, // Recycle connections after 7500 uses
})

// Generic query function with error handling
export async function query(text: string, params?: any[]): Promise<any[]> {
  let client: PoolClient | null = null
  try {
    client = await pool.connect()
    const result = await client.query(text, params)
    return result.rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  } finally {
    if (client) {
      client.release()
    }
  }
}

// Specialized query function for single row results
export async function queryOne(text: string, params?: any[]): Promise<any | null> {
  const result = await query(text, params)
  return result.length > 0 ? result[0] : null
}

// Transaction wrapper for multiple operations
export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  let client: PoolClient | null = null
  try {
    client = await pool.connect()
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    if (client) {
      await client.query('ROLLBACK')
    }
    throw error
  } finally {
    if (client) {
      client.release()
    }
  }
}

// Helper function for building WHERE clauses with dynamic conditions
export function buildWhereClause(conditions: Record<string, any>): { whereClause: string; params: any[] } {
  const whereParts: string[] = []
  const params: any[] = []
  let paramIndex = 1

  Object.entries(conditions).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      whereParts.push(`${key} = $${paramIndex}`)
      params.push(value)
      paramIndex++
    }
  })

  return {
    whereClause: whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '',
    params
  }
}

// Graceful pool shutdown
export async function closePool(): Promise<void> {
  await pool.end()
}

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    const result = await query('SELECT 1 as health')
    return result.length > 0 && result[0].health === 1
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
} 