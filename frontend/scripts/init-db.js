const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function initializeDatabase() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      console.log('Please create frontend/.env.local with your Neon connection string')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // Read the schema file
    const schemaPath = path.join(__dirname, '../../backend/database_schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found at:', schemaPath)
      process.exit(1)
    }

    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'))

    console.log(`📊 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          await sql`${statement}`
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`)
        } catch (error) {
          console.log(`⚠️  Statement ${i + 1} failed (might be expected):`, error.message)
        }
      }
    }

    // Test the connection
    const result = await sql`SELECT COUNT(*) as count FROM users`
    console.log(`🎉 Database initialized successfully! Found ${result[0].count} users`)
    
    console.log('\n📋 Sample login credentials:')
    console.log('Patient: +6281234567890 / password123')
    console.log('Health Worker: HW001 / healthworker123')
    console.log('Specialist: dr.carter@hospital.com / specialist123')

  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    process.exit(1)
  }
}

initializeDatabase() 