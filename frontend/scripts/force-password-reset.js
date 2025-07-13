const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
const path = require('path')

async function forcePasswordReset() {
  try {
    // Load environment variables
    require('dotenv').config({ path: path.join(__dirname, '../.env.local') })
    
    if (!process.env.DATABASE_URL) {
      console.error('❌ DATABASE_URL not found in .env.local')
      process.exit(1)
    }

    const sql = neon(process.env.DATABASE_URL)
    console.log('🔌 Connecting to Neon database...')

    // Hash the new password 'password123'
    const newPassword = 'password123'
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    console.log('🔒 New password hash:', hashedPassword)

    // Update each user individually
    console.log('\n🔄 Updating passwords one by one...')

    // Update user 1 (Specialist)
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 1
    `
    console.log('✅ Updated user 1 (Dr. Sarah Johnson)')

    // Update user 2 (Health Worker)
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 2
    `
    console.log('✅ Updated user 2 (Nurse Maria Santos)')

    // Update user 3 (Patient)
    await sql`
      UPDATE users 
      SET password_hash = ${hashedPassword}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = 3
    `
    console.log('✅ Updated user 3 (John Doe)')

    // Verify the updates with fresh queries
    console.log('\n🔍 Verifying password updates...')
    
    const user1 = await sql`SELECT id, full_name, password_hash, updated_at FROM users WHERE id = 1`
    console.log(`User 1: ${user1[0].password_hash.substring(0, 25)}...`)
    
    const user2 = await sql`SELECT id, full_name, password_hash, updated_at FROM users WHERE id = 2`
    console.log(`User 2: ${user2[0].password_hash.substring(0, 25)}...`)
    
    const user3 = await sql`SELECT id, full_name, password_hash, updated_at FROM users WHERE id = 3`
    console.log(`User 3: ${user3[0].password_hash.substring(0, 25)}...`)

    // Test password verification
    console.log('\n🧪 Testing bcrypt verification...')
    const testPassword = 'password123'
    
    const isValid1 = await bcrypt.compare(testPassword, user1[0].password_hash)
    console.log(`User 1 password test: ${isValid1 ? '✅ VALID' : '❌ INVALID'}`)
    
    const isValid2 = await bcrypt.compare(testPassword, user2[0].password_hash)
    console.log(`User 2 password test: ${isValid2 ? '✅ VALID' : '❌ INVALID'}`)
    
    const isValid3 = await bcrypt.compare(testPassword, user3[0].password_hash)
    console.log(`User 3 password test: ${isValid3 ? '✅ VALID' : '❌ INVALID'}`)

    console.log('\n🎉 Password reset completed!')
    console.log('\n🔐 NOW TRY THESE CREDENTIALS:')
    console.log('')
    console.log('✅ PATIENT LOGIN:')
    console.log('   Phone: +6281987654321')
    console.log('   Password: password123')
    console.log('')
    console.log('✅ HEALTH WORKER LOGIN:')
    console.log('   Email: maria@puskesmas.com (or Phone: +6281234567890)')
    console.log('   Password: password123')
    console.log('')
    console.log('✅ SPECIALIST LOGIN:')
    console.log('   Email: dr.sarah@hospital.com')
    console.log('   Password: password123')

  } catch (error) {
    console.error('❌ Password reset failed:', error)
  }
}

forcePasswordReset() 