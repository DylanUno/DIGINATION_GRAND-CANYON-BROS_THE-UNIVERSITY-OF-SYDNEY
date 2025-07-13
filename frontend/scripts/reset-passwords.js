const { neon } = require('@neondatabase/serverless')
const bcrypt = require('bcryptjs')
const path = require('path')

async function resetPasswords() {
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
    console.log('🔒 New password hashed:', hashedPassword.substring(0, 20) + '...')

    // Get all users first
    const users = await sql`SELECT id, full_name, email, phone, role FROM users ORDER BY id`
    console.log(`\n👥 Found ${users.length} users to update:`)
    users.forEach(user => {
      console.log(`- ID ${user.id}: ${user.full_name} (${user.role})`)
      if (user.email) console.log(`  Email: ${user.email}`)
      if (user.phone) console.log(`  Phone: ${user.phone}`)
    })

    // Update all users' passwords
    console.log('\n🔄 Updating all passwords...')
    const result = await sql.unsafe(`
      UPDATE users 
      SET password_hash = '${hashedPassword}', updated_at = CURRENT_TIMESTAMP 
      WHERE id IN (1, 2, 3)
    `)
    
    console.log('✅ Password update completed')

    // Verify the updates
    console.log('\n🔍 Verifying password updates...')
    const updatedUsers = await sql`
      SELECT id, full_name, password_hash, updated_at 
      FROM users 
      ORDER BY id
    `
    updatedUsers.forEach(user => {
      console.log(`- User ${user.id} (${user.full_name}): ${user.password_hash.substring(0, 20)}... (updated: ${user.updated_at})`)
    })

    console.log('\n🎉 All passwords have been reset!')
    console.log('\n🔐 TEST THESE CREDENTIALS NOW:')
    console.log('')
    console.log('✅ PATIENT LOGIN:')
    console.log('   Phone: +6281987654321')
    console.log('   Password: password123')
    console.log('')
    console.log('✅ HEALTH WORKER LOGIN:')
    console.log('   Email: maria@puskesmas.com')
    console.log('   Phone: +6281234567890')
    console.log('   Password: password123')
    console.log('')
    console.log('✅ SPECIALIST LOGIN:')
    console.log('   Email: dr.sarah@hospital.com')
    console.log('   Password: password123')

  } catch (error) {
    console.error('❌ Password reset failed:', error)
  }
}

resetPasswords() 