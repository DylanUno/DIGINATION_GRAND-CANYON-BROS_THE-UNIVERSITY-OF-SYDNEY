const { Pool } = require('pg')
const fs = require('fs')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function setupDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🗄️  Connecting to database...')
    
    console.log('🔍 Checking existing database...')
    
    // Check what tables already exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `)
    
    console.log(`📋 Found ${tables.rows.length} existing tables:`)
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`)
    })

    // Check existing users
    const users = await pool.query('SELECT COUNT(*) FROM users')
    const patients = await pool.query('SELECT COUNT(*) FROM patients')
    
    if (users.rows[0].count >= 3 && patients.rows[0].count >= 1) {
      console.log('\n✅ Database already has working data!')
      console.log('   - Skipping schema setup to preserve existing data')
      
      // Show current user data
      const userDetails = await pool.query(`
        SELECT id, full_name, email, phone, professional_credentials, role, is_active 
        FROM users 
        ORDER BY id
      `)
      
      console.log('\n👥 Current users:')
      userDetails.rows.forEach(user => {
        console.log(`   - ${user.full_name} (${user.role})`)
        if (user.email) console.log(`     Email: ${user.email}`)
        if (user.phone) console.log(`     Phone: ${user.phone}`)
        if (user.professional_credentials) console.log(`     Credentials: ${user.professional_credentials}`)
      })
      
      // Show patient data
      const patientDetails = await pool.query(`
        SELECT p.full_name, p.phone, p.age, p.gender, u.role 
        FROM patients p 
        JOIN users u ON p.user_id = u.id
      `)
      
      console.log('\n🏥 Current patients:')
      patientDetails.rows.forEach(patient => {
        console.log(`   - ${patient.full_name} (${patient.age} years old, ${patient.gender})`)
        console.log(`     Phone: ${patient.phone}`)
      })
      
    } else {
      console.log('\n📋 Setting up database with sample data...')
      
      // Only run schema setup if we don't have enough data
      const schemaPath = path.join(__dirname, '../../backend/database_schema.sql')
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8')
        
        // Split and execute schema
        const statements = schema
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0)
        
        for (let i = 0; i < statements.length; i++) {
          const statement = statements[i]
          if (statement.trim()) {
            try {
              await pool.query(statement)
              if (statement.includes('CREATE TABLE')) {
                const tableName = statement.match(/CREATE TABLE (\w+)/)?.[1]
                console.log(`✅ Created table: ${tableName}`)
              } else if (statement.includes('INSERT INTO')) {
                const tableName = statement.match(/INSERT INTO (\w+)/)?.[1]
                console.log(`📝 Inserted data into: ${tableName}`)
              }
            } catch (error) {
              if (error.message.includes('already exists')) {
                console.log(`⚠️  Skipping: ${error.message}`)
              } else {
                console.error(`❌ Error: ${error.message}`)
              }
            }
          }
        }
      }
    }
    
    console.log('\n🎉 Database verification completed!')
    
    // Final verification
    const finalUsers = await pool.query('SELECT COUNT(*) FROM users')
    const finalPatients = await pool.query('SELECT COUNT(*) FROM patients')
    const finalHealthWorkers = await pool.query('SELECT COUNT(*) FROM health_workers')
    const finalSpecialists = await pool.query('SELECT COUNT(*) FROM specialists')
    const finalScreenings = await pool.query('SELECT COUNT(*) FROM health_screenings')
    
    console.log('\n📊 Final Database Summary:')
    console.log(`   - Users: ${finalUsers.rows[0].count}`)
    console.log(`   - Patients: ${finalPatients.rows[0].count}`)
    console.log(`   - Health Workers: ${finalHealthWorkers.rows[0].count}`)
    console.log(`   - Specialists: ${finalSpecialists.rows[0].count}`)
    console.log(`   - Health Screenings: ${finalScreenings.rows[0].count}`)
    
    console.log('\n🔑 Working Login Credentials:')
    console.log('   Patient: +6281987654321 / password123')
    console.log('   Health Worker: maria@puskesmas.com / password123')
    console.log('   Specialist: dr.sarah@hospital.com / password123')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

// Run the setup
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('\n✨ Ready to start the application!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Setup failed:', error)
      process.exit(1)
    })
}

module.exports = { setupDatabase } 