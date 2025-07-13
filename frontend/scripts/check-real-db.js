const { neon } = require('@neondatabase/serverless')
const path = require('path')

async function checkRealDatabase() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // Check all tables
    console.log('\n📋 All tables in database:')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    tables.forEach(table => console.log(`- ${table.table_name}`))

    // Check ALL users with ALL their data
    console.log('\n👥 ALL USERS IN DATABASE:')
    const users = await sql`SELECT * FROM users ORDER BY id`
    console.log(`Found ${users.length} users:`)
    users.forEach(user => {
      console.log(`\n--- USER ID ${user.id} ---`)
      Object.entries(user).forEach(([key, value]) => {
        if (key === 'password_hash') {
          console.log(`${key}: ${value ? value.substring(0, 20) + '...' : 'NULL'}`)
        } else {
          console.log(`${key}: ${value}`)
        }
      })
    })

    // Check ALL patients
    console.log('\n🏥 ALL PATIENTS IN DATABASE:')
    const patients = await sql`SELECT * FROM patients ORDER BY id`
    console.log(`Found ${patients.length} patients:`)
    patients.forEach(patient => {
      console.log(`\n--- PATIENT ID ${patient.id} ---`)
      Object.entries(patient).forEach(([key, value]) => {
        console.log(`${key}: ${value}`)
      })
    })

    // Test the exact credentials we see
    console.log('\n🔍 TESTING AUTHENTICATION WITH REAL DATA:')
    
    // Test with the patient phone number we see: +6281987654321
    try {
      const patientTest = await sql`
        SELECT u.*, p.full_name as patient_name, p.phone as patient_phone 
        FROM users u 
        LEFT JOIN patients p ON p.user_id = u.id 
        WHERE u.phone = '+6281987654321' OR p.phone = '+6281987654321'
      `
      console.log(`\nPatient test (+6281987654321): ${patientTest.length} result(s)`)
      if (patientTest.length > 0) {
        console.log('Patient found:', {
          id: patientTest[0].id,
          name: patientTest[0].full_name,
          phone: patientTest[0].phone,
          role: patientTest[0].role,
          has_password: !!patientTest[0].password_hash
        })
      }
    } catch (error) {
      console.log(`Patient test failed: ${error.message}`)
    }

    // Check if there are any health workers in users table
    try {
      const hwTest = await sql`
        SELECT * FROM users 
        WHERE role = 'HEALTH_WORKER'
      `
      console.log(`\nHealth Workers found: ${hwTest.length}`)
      hwTest.forEach(hw => {
        console.log(`- ID ${hw.id}: ${hw.full_name}, Email: ${hw.email}, Phone: ${hw.phone}`)
      })
    } catch (error) {
      console.log(`Health Worker test failed: ${error.message}`)
    }

    // Check if there are any specialists in users table
    try {
      const specialistTest = await sql`
        SELECT * FROM users 
        WHERE role = 'SPECIALIST'
      `
      console.log(`\nSpecialists found: ${specialistTest.length}`)
      specialistTest.forEach(spec => {
        console.log(`- ID ${spec.id}: ${spec.full_name}, Email: ${spec.email}`)
      })
    } catch (error) {
      console.log(`Specialist test failed: ${error.message}`)
    }

    console.log('\n🔐 SUMMARY OF AVAILABLE CREDENTIALS:')
    console.log('Based on the data found, here are the working credentials:')
    
    // Patient credentials
    if (patients.length > 0) {
      console.log(`\nPATIENT LOGIN:`)
      console.log(`Phone: ${patients[0].phone}`)
      console.log(`Password: [check if user has password_hash]`)
    }
    
    // Other role credentials
    const roles = ['HEALTH_WORKER', 'SPECIALIST']
    for (const role of roles) {
      const roleUsers = users.filter(u => u.role === role)
      if (roleUsers.length > 0) {
        console.log(`\n${role} LOGIN:`)
        roleUsers.forEach(user => {
          if (user.email) console.log(`Email: ${user.email}`)
          if (user.phone) console.log(`Phone: ${user.phone}`)
          if (user.professional_credentials) console.log(`Credentials: ${user.professional_credentials}`)
          console.log(`Password: [check if user has password_hash]`)
        })
      }
    }

  } catch (error) {
    console.error('❌ Database check failed:', error)
  }
}

checkRealDatabase() 