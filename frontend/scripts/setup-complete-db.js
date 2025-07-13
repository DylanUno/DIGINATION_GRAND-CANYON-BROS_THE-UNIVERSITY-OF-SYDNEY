const { neon } = require('@neondatabase/serverless')
const fs = require('fs')
const path = require('path')

async function setupCompleteDatabase() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // First, drop existing tables to start fresh
    console.log('🗑️  Dropping existing tables...')
    const dropTables = [
      'analysis_sessions',
      'specialist_consultations', 
      'patients',
      'health_centers',
      'users'
    ]
    
    for (const table of dropTables) {
      try {
        await sql.unsafe(`DROP TABLE IF EXISTS ${table} CASCADE`)
        console.log(`✅ Dropped ${table}`)
      } catch (error) {
        console.log(`⚠️  Could not drop ${table}: ${error.message}`)
      }
    }

    // Read the complete schema file
    const schemaPath = path.join(__dirname, '../../backend/database_schema.sql')
    if (!fs.existsSync(schemaPath)) {
      console.error('❌ Schema file not found at:', schemaPath)
      process.exit(1)
    }

    const schema = fs.readFileSync(schemaPath, 'utf8')
    console.log('📖 Reading complete database schema...')

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => 
        statement.length > 0 && 
        !statement.startsWith('--') && 
        !statement.match(/^\s*$/)
      )

    console.log(`📊 Executing ${statements.length} SQL statements...`)

    // Execute each statement
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          // Need to use raw SQL execution for the full schema
          await sql.unsafe(statement)
          console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`)
          successCount++
        } catch (error) {
          console.log(`⚠️  Statement ${i + 1} failed: ${error.message}`)
          errorCount++
        }
      }
    }

    console.log(`\n📈 Summary: ${successCount} successful, ${errorCount} failed`)

    // Verify the setup by checking key tables
    console.log('\n🔍 Verifying database setup...')
    
    const users = await sql`SELECT COUNT(*) as count FROM users`
    const patients = await sql`SELECT COUNT(*) as count FROM patients`
    const healthWorkers = await sql`SELECT COUNT(*) as count FROM health_workers`
    const specialists = await sql`SELECT COUNT(*) as count FROM specialists`
    const userRoles = await sql`SELECT COUNT(*) as count FROM user_roles`

    console.log(`👥 Users: ${users[0].count}`)
    console.log(`🏥 Patients: ${patients[0].count}`)
    console.log(`👩‍⚕️ Health Workers: ${healthWorkers[0].count}`)
    console.log(`🩺 Specialists: ${specialists[0].count}`)
    console.log(`🎭 User Roles: ${userRoles[0].count}`)

    // Show sample credentials
    console.log('\n🔐 Sample login credentials:')
    console.log('Patient: +62-812-3456789 / password123')
    console.log('Health Worker: HW001 / password123')
    console.log('Specialist: emily.carter@specialist.id / password123')
    
    console.log('\n🎉 Complete database setup successful!')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
  }
}

setupCompleteDatabase() 