const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
const path = require('path')

async function fixAuthData() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // First let's see what we have
    console.log('🔍 Current database state:')
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `
    console.log('Tables:', tables.map(t => t.table_name))

    // Let's check the users table structure
    const userColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    console.log('Users table columns:', userColumns)

    // Check patients table structure  
    const patientColumns = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'patients' AND table_schema = 'public'
      ORDER BY ordinal_position
    `
    console.log('Patients table columns:', patientColumns)

    // Clear and rebuild data with what we have
    console.log('\n🔧 Fixing authentication data...')

    // Clear existing data
    await sql.unsafe('DELETE FROM patients')
    await sql.unsafe('DELETE FROM users')

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12)
    console.log('🔒 Password hashed')

    // Since we can't control the table structure, let's just insert basic auth data
    // Insert users - working with whatever columns exist
    console.log('👥 Creating users...')
    
    // Try to insert basic user data
    try {
      await sql.unsafe(`
        INSERT INTO users (password_hash) VALUES 
        ('${hashedPassword}'),
        ('${hashedPassword}'),
        ('${hashedPassword}')
      `)
      console.log('✅ Users created')
    } catch (error) {
      console.log('❌ Failed to create users:', error.message)
    }

    // Insert patients with phone numbers for authentication
    console.log('🏥 Creating patients...')
    try {
      await sql.unsafe(`
        INSERT INTO patients (user_id, phone_number, first_name, last_name) VALUES 
        (1, '+62-812-3456789', 'John', 'Doe'),
        (2, '+62-813-7654321', 'Maria', 'Santos'),
        (3, '+62-814-5555555', 'Robert', 'Wilson')
      `)
      console.log('✅ Patients created')
    } catch (error) {
      console.log('❌ Failed to create patients:', error.message)
    }

    // Try to create health_workers table if it doesn't exist
    console.log('👩‍⚕️ Creating health_workers table...')
    try {
      await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS health_workers (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          employee_id VARCHAR(50),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          email VARCHAR(255)
        )
      `)
      
      // Insert health workers
      await sql.unsafe(`
        INSERT INTO health_workers (employee_id, first_name, last_name, email) VALUES 
        ('HW001', 'Sarah', 'Johnson', 'sarah.johnson@puskesmas.id')
      `)
      console.log('✅ Health workers created')
    } catch (error) {
      console.log('❌ Health workers failed:', error.message)
    }

    // Try to create specialists table if it doesn't exist
    console.log('🩺 Creating specialists table...')
    try {
      await sql.unsafe(`
        CREATE TABLE IF NOT EXISTS specialists (
          id SERIAL PRIMARY KEY,
          user_id INTEGER,
          email VARCHAR(255),
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          specialty VARCHAR(100)
        )
      `)
      
      // Insert specialists
      await sql.unsafe(`
        INSERT INTO specialists (email, first_name, last_name, specialty) VALUES 
        ('emily.carter@specialist.id', 'Emily', 'Carter', 'Cardiology')
      `)
      console.log('✅ Specialists created')
    } catch (error) {
      console.log('❌ Specialists failed:', error.message)
    }

    // Final verification
    console.log('\n📊 Final state:')
    try {
      const users = await sql`SELECT COUNT(*) as count FROM users`
      console.log(`Users: ${users[0].count}`)
    } catch (e) { console.log('Users: Error') }

    try {
      const patients = await sql`SELECT COUNT(*) as count FROM patients`
      console.log(`Patients: ${patients[0].count}`)
    } catch (e) { console.log('Patients: Error') }

    try {
      const healthWorkers = await sql`SELECT COUNT(*) as count FROM health_workers`
      console.log(`Health Workers: ${healthWorkers[0].count}`)
    } catch (e) { console.log('Health Workers: Table does not exist') }

    try {
      const specialists = await sql`SELECT COUNT(*) as count FROM specialists`
      console.log(`Specialists: ${specialists[0].count}`)
    } catch (e) { console.log('Specialists: Table does not exist') }

    console.log('\n🔐 Test these credentials:')
    console.log('Patient: +62-812-3456789 / password123')
    console.log('Health Worker: HW001 / password123')
    console.log('Specialist: emily.carter@specialist.id / password123')

  } catch (error) {
    console.error('❌ Process failed:', error)
  }
}

fixAuthData() 