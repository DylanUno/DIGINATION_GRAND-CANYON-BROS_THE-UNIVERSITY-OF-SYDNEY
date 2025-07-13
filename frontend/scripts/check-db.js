const { neon } = require('@neondatabase/serverless')
const path = require('path')

async function checkDatabase() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // Check if tables exist
    console.log('\n📋 Checking tables...')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('Tables found:', tables.map(t => t.table_name))

    // Check users table
    console.log('\n👥 Checking users table...')
    const users = await sql`SELECT * FROM users`
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`- User ID ${user.id}: role_id=${user.role_id}, password_hash=${user.password_hash?.substring(0, 20)}...`)
    })

    // Check patients table
    console.log('\n🏥 Checking patients table...')
    const patients = await sql`SELECT * FROM patients`
    console.log(`Found ${patients.length} patients:`)
    patients.forEach(patient => {
      console.log(`- ${patient.first_name} ${patient.last_name}: phone=${patient.phone_number}, user_id=${patient.user_id}`)
    })

    // Check health workers table
    console.log('\n👩‍⚕️ Checking health_workers table...')
    const healthWorkers = await sql`SELECT * FROM health_workers`
    console.log(`Found ${healthWorkers.length} health workers:`)
    healthWorkers.forEach(hw => {
      console.log(`- ${hw.first_name} ${hw.last_name}: employee_id=${hw.employee_id}, user_id=${hw.user_id}`)
    })

    // Check specialists table
    console.log('\n🩺 Checking specialists table...')
    const specialists = await sql`SELECT * FROM specialists`
    console.log(`Found ${specialists.length} specialists:`)
    specialists.forEach(spec => {
      console.log(`- ${spec.first_name} ${spec.last_name}: email=${spec.email}, user_id=${spec.user_id}`)
    })

    // Check user roles
    console.log('\n🎭 Checking user_roles table...')
    const roles = await sql`SELECT * FROM user_roles`
    console.log(`Found ${roles.length} roles:`)
    roles.forEach(role => {
      console.log(`- Role ID ${role.id}: ${role.role_name}`)
    })

  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

checkDatabase() 