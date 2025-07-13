const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
const path = require('path')

async function createTestUsers() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // Clear existing users and patients
    console.log('🗑️  Clearing existing data...')
    await sql.unsafe('DELETE FROM patients')
    await sql.unsafe('DELETE FROM users')

    // Hash the password 'password123'
    const hashedPassword = await bcrypt.hash('password123', 12)
    console.log('🔒 Password hashed')

    // Insert test users with proper structure
    console.log('👥 Creating test users...')

    // Patient user
    await sql.unsafe(`
      INSERT INTO users (
        phone, password_hash, role, is_active, is_verified, full_name, created_at, updated_at
      ) VALUES (
        '+62-812-3456789', '${hashedPassword}', 'patient', true, true, 'John Doe', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `)

    // Health worker user  
    await sql.unsafe(`
      INSERT INTO users (
        professional_credentials, password_hash, role, is_active, is_verified, full_name, email, created_at, updated_at
      ) VALUES (
        'HW001', '${hashedPassword}', 'health_worker', true, true, 'Sarah Johnson', 'sarah.johnson@puskesmas.id', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `)

    // Specialist user
    await sql.unsafe(`
      INSERT INTO users (
        email, professional_credentials, password_hash, role, is_active, is_verified, full_name, created_at, updated_at
      ) VALUES (
        'emily.carter@specialist.id', 'DR001', '${hashedPassword}', 'specialist', true, true, 'Dr. Emily Carter', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Test users created')

    // Create corresponding patient record
    console.log('🏥 Creating patient record...')
    await sql.unsafe(`
      INSERT INTO patients (
        user_id, full_name, phone, age, gender, weight_kg, height_cm, 
        address, village, city, province, patient_id, 
        registered_at_health_center_id, is_active, created_at, updated_at
      ) VALUES (
        1, 'John Doe', '+62-812-3456789', 38, 'male', 70.5, 175.0,
        'Jl. Kebon Jeruk No. 123', 'Kebon Jeruk', 'Jakarta', 'DKI Jakarta', 'PT001',
        1, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Patient record created')

    // Verify the data
    console.log('\n🔍 Verifying created users...')
    
    const users = await sql`SELECT id, full_name, phone, email, professional_credentials, role FROM users ORDER BY id`
    console.log('Users created:')
    users.forEach(user => {
      console.log(`- ID ${user.id}: ${user.full_name} (${user.role})`)
      if (user.phone) console.log(`  Phone: ${user.phone}`)
      if (user.email) console.log(`  Email: ${user.email}`)
      if (user.professional_credentials) console.log(`  Credentials: ${user.professional_credentials}`)
    })

    const patients = await sql`SELECT * FROM patients`
    console.log(`\nPatients: ${patients.length} record(s)`)

    console.log('\n🔐 Test these login credentials:')
    console.log('✅ Patient: +62-812-3456789 / password123')
    console.log('✅ Health Worker: HW001 / password123') 
    console.log('✅ Specialist: emily.carter@specialist.id / password123')
    
    console.log('\n🎉 Test users setup complete!')

  } catch (error) {
    console.error('❌ Setup failed:', error)
  }
}

createTestUsers() 