const { Pool } = require('pg')
const path = require('path')
require('dotenv').config({ path: '.env.local' })

async function addSampleData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log('🗄️  Connecting to database...')
    
    // Check existing data
    const users = await pool.query('SELECT COUNT(*) FROM users')
    console.log(`👥 Found ${users.rows[0].count} existing users`)
    
    // Add health_workers record for existing health worker user
    console.log('\n👩‍⚕️ Adding health worker record...')
    try {
      await pool.query(`
        INSERT INTO health_workers (user_id, employee_id, first_name, last_name, email, phone_number, department, position, health_center_id, hire_date, created_at)
        VALUES (2, 'HW001', 'Nurse', 'Maria Santos', 'maria@puskesmas.com', '+6281234567890', 'General Care', 'Nurse', 1, '2023-01-15', CURRENT_TIMESTAMP)
      `)
      console.log('✅ Health worker record added')
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        console.log('⚠️  Health worker record already exists')
      } else {
        console.log('❌ Error adding health worker:', error.message)
      }
    }
    
    // Add specialists record for existing specialist user
    console.log('🩺 Adding specialist record...')
    try {
      await pool.query(`
        INSERT INTO specialists (user_id, professional_credentials, first_name, last_name, email, specialty, medical_license_number, years_experience, board_certifications, consultation_fee, available_for_emergency, created_at)
        VALUES (1, 'SP001234', 'Dr. Sarah', 'Johnson', 'dr.sarah@hospital.com', 'Cardiology', 'MD12345', 12, ARRAY['Board Certified Cardiologist', 'Internal Medicine'], 500000, true, CURRENT_TIMESTAMP)
      `)
      console.log('✅ Specialist record added')
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        console.log('⚠️  Specialist record already exists')
      } else {
        console.log('❌ Error adding specialist:', error.message)
      }
    }
    
    // Add health centers if they don't exist
    console.log('🏥 Adding health centers...')
    await pool.query(`
      INSERT INTO health_centers (id, name, code, address, village, district, city, province, phone, email, is_active, created_at, updated_at)
      VALUES 
        (1, 'Puskesmas Kembangan', 'PKM-KMB', 'Jl. Kembangan Raya No. 123', 'Kembangan', 'Kembangan', 'Jakarta', 'DKI Jakarta', '+6221-5555-0001', 'info@puskesmas-kembangan.id', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (2, 'Puskesmas Cengkareng', 'PKM-CKR', 'Jl. Cengkareng Barat No. 456', 'Cengkareng', 'Cengkareng', 'Jakarta', 'DKI Jakarta', '+6221-5555-0002', 'info@puskesmas-cengkareng.id', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
        (3, 'Puskesmas Kalideres', 'PKM-KLD', 'Jl. Kalideres Utara No. 789', 'Kalideres', 'Kalideres', 'Jakarta', 'DKI Jakarta', '+6221-5555-0003', 'info@puskesmas-kalideres.id', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO NOTHING
    `)
    
    // Get the health worker ID from the health_workers table
    const healthWorkerResult = await pool.query('SELECT id FROM health_workers WHERE user_id = 2 LIMIT 1')
    const healthWorkerId = healthWorkerResult.rows[0]?.id
    
    if (!healthWorkerId) {
      console.log('⚠️  No health worker found, skipping health screenings')
      return
    }
    
    // Add health screenings
    console.log('🔬 Adding health screenings...')
    try {
      await pool.query(`
        INSERT INTO health_screenings (patient_id, health_worker_id, health_center_id, screening_date, status, overall_status, overall_notes, created_at)
        VALUES 
          (1, $1, 1, '2024-01-15 10:30:00', 'completed', 'normal', 'Regular health screening - all parameters normal', '2024-01-15 10:30:00'),
          (1, $1, 1, '2024-01-20 14:15:00', 'completed', 'normal', 'Follow-up screening - slight improvement in cardiovascular markers', '2024-01-20 14:15:00'),
          (1, $1, 1, '2024-01-25 09:00:00', 'completed', 'urgent', 'Comprehensive screening - detected irregular heartbeat, requires specialist consultation', '2024-01-25 09:00:00')
      `, [healthWorkerId])
      console.log('✅ Health screenings added')
    } catch (error) {
      if (error.message.includes('duplicate key')) {
        console.log('⚠️  Health screenings already exist')
      } else {
        console.log('❌ Error adding health screenings:', error.message)
      }
    }
    
    // Get screening IDs for vital signs
    const screenings = await pool.query(`
      SELECT id, screening_date, overall_status 
      FROM health_screenings 
      WHERE patient_id = 1 
      ORDER BY screening_date DESC 
      LIMIT 3
    `)
    
    // Add vital signs for each screening
    console.log('💓 Adding vital signs...')
    if (screenings.rows.length >= 3) {
      const [latest, middle, earliest] = screenings.rows
      
      // Latest screening - urgent (abnormal readings)
      const latestVitalSigns = [
        { measurement_type: 'heart_rate', value_numeric: 110, unit: 'bpm', status: 'abnormal', reference_range: '60-100' },
        { measurement_type: 'blood_pressure_systolic', value_numeric: 145, unit: 'mmHg', status: 'high', reference_range: '90-140' },
        { measurement_type: 'blood_pressure_diastolic', value_numeric: 95, unit: 'mmHg', status: 'high', reference_range: '60-90' },
        { measurement_type: 'temperature', value_numeric: 36.8, unit: '°C', status: 'normal', reference_range: '36-37.5' },
        { measurement_type: 'respiratory_rate', value_numeric: 20, unit: 'breaths/min', status: 'normal', reference_range: '12-20' },
        { measurement_type: 'oxygen_saturation', value_numeric: 96, unit: '%', status: 'low', reference_range: '95-100' },
        { measurement_type: 'weight', value_numeric: 75.2, unit: 'kg', status: 'normal', reference_range: '60-80' },
        { measurement_type: 'height', value_numeric: 175, unit: 'cm', status: 'normal', reference_range: '150-200' },
        { measurement_type: 'bmi', value_numeric: 24.6, unit: 'kg/m²', status: 'normal', reference_range: '18.5-25' }
      ]
      
      for (const vital of latestVitalSigns) {
        try {
          await pool.query(`
            INSERT INTO vital_signs (screening_id, measurement_type, value_numeric, unit, status, reference_range, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [latest.id, vital.measurement_type, vital.value_numeric, vital.unit, vital.status, vital.reference_range, latest.screening_date])
        } catch (error) {
          console.log(`⚠️  Error adding ${vital.measurement_type} for latest screening: ${error.message}`)
        }
      }
      
      // Middle screening - normal readings
      const middleVitalSigns = [
        { measurement_type: 'heart_rate', value_numeric: 78, unit: 'bpm', status: 'normal', reference_range: '60-100' },
        { measurement_type: 'blood_pressure_systolic', value_numeric: 125, unit: 'mmHg', status: 'normal', reference_range: '90-140' },
        { measurement_type: 'blood_pressure_diastolic', value_numeric: 82, unit: 'mmHg', status: 'normal', reference_range: '60-90' },
        { measurement_type: 'temperature', value_numeric: 36.5, unit: '°C', status: 'normal', reference_range: '36-37.5' },
        { measurement_type: 'respiratory_rate', value_numeric: 16, unit: 'breaths/min', status: 'normal', reference_range: '12-20' },
        { measurement_type: 'oxygen_saturation', value_numeric: 98, unit: '%', status: 'normal', reference_range: '95-100' },
        { measurement_type: 'weight', value_numeric: 75.0, unit: 'kg', status: 'normal', reference_range: '60-80' },
        { measurement_type: 'height', value_numeric: 175, unit: 'cm', status: 'normal', reference_range: '150-200' },
        { measurement_type: 'bmi', value_numeric: 24.5, unit: 'kg/m²', status: 'normal', reference_range: '18.5-25' }
      ]
      
      for (const vital of middleVitalSigns) {
        try {
          await pool.query(`
            INSERT INTO vital_signs (screening_id, measurement_type, value_numeric, unit, status, reference_range, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [middle.id, vital.measurement_type, vital.value_numeric, vital.unit, vital.status, vital.reference_range, middle.screening_date])
        } catch (error) {
          console.log(`⚠️  Error adding ${vital.measurement_type} for middle screening: ${error.message}`)
        }
      }
      
      // Earliest screening - normal readings
      const earliestVitalSigns = [
        { measurement_type: 'heart_rate', value_numeric: 72, unit: 'bpm', status: 'normal', reference_range: '60-100' },
        { measurement_type: 'blood_pressure_systolic', value_numeric: 118, unit: 'mmHg', status: 'normal', reference_range: '90-140' },
        { measurement_type: 'blood_pressure_diastolic', value_numeric: 78, unit: 'mmHg', status: 'normal', reference_range: '60-90' },
        { measurement_type: 'temperature', value_numeric: 36.4, unit: '°C', status: 'normal', reference_range: '36-37.5' },
        { measurement_type: 'respiratory_rate', value_numeric: 14, unit: 'breaths/min', status: 'normal', reference_range: '12-20' },
        { measurement_type: 'oxygen_saturation', value_numeric: 99, unit: '%', status: 'normal', reference_range: '95-100' },
        { measurement_type: 'weight', value_numeric: 74.8, unit: 'kg', status: 'normal', reference_range: '60-80' },
        { measurement_type: 'height', value_numeric: 175, unit: 'cm', status: 'normal', reference_range: '150-200' },
        { measurement_type: 'bmi', value_numeric: 24.4, unit: 'kg/m²', status: 'normal', reference_range: '18.5-25' }
      ]
      
      for (const vital of earliestVitalSigns) {
        try {
          await pool.query(`
            INSERT INTO vital_signs (screening_id, measurement_type, value_numeric, unit, status, reference_range, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `, [earliest.id, vital.measurement_type, vital.value_numeric, vital.unit, vital.status, vital.reference_range, earliest.screening_date])
        } catch (error) {
          console.log(`⚠️  Error adding ${vital.measurement_type} for earliest screening: ${error.message}`)
        }
      }
      
      console.log('✅ Vital signs added for all screenings')
    }
    
    // Add specialist queue entry
    console.log('🏥 Adding specialist queue...')
    try {
      // Get the specialist ID from the specialists table
      const specialistResult = await pool.query('SELECT id FROM specialists WHERE user_id = 1 LIMIT 1')
      const specialistId = specialistResult.rows[0]?.id
      
      if (specialistId) {
        await pool.query(`
          INSERT INTO specialist_queue (screening_id, patient_id, assigned_specialist_id, health_center_id, submission_time, status, risk_level, priority_score, chief_complaint, symptoms)
          VALUES 
            ((SELECT id FROM health_screenings WHERE patient_id = 1 AND overall_status = 'urgent' LIMIT 1), 1, $1, 1, CURRENT_TIMESTAMP, 'pending', 'high', 80, 'Irregular heartbeat detected during screening', ARRAY['palpitations', 'chest discomfort'])
        `, [specialistId])
        console.log('✅ Specialist queue entry added')
      } else {
        console.log('⚠️  No specialist found, skipping queue entry')
      }
    } catch (error) {
      console.log('❌ Error adding specialist queue:', error.message)
    }
    
    // Add health recommendations
    console.log('💡 Adding health recommendations...')
    await pool.query(`
      INSERT INTO health_recommendations (screening_id, recommendation_type, title, description, priority, is_urgent, created_at)
      VALUES 
        ((SELECT id FROM health_screenings WHERE patient_id = 1 AND priority = 'urgent' LIMIT 1), 'medical', 'Cardiology Consultation Required', 'Irregular heartbeat patterns detected. Schedule consultation with cardiologist within 7 days.', 'high', true, CURRENT_TIMESTAMP),
        ((SELECT id FROM health_screenings WHERE patient_id = 1 AND priority = 'normal' LIMIT 1), 'lifestyle', 'Maintain Healthy Lifestyle', 'Continue regular exercise and balanced diet. Monitor blood pressure weekly.', 'medium', false, CURRENT_TIMESTAMP)
      ON CONFLICT DO NOTHING
    `)
    
    // Add patient notifications
    console.log('📬 Adding patient notifications...')
    await pool.query(`
      INSERT INTO patient_notifications (patient_id, title, message, type, priority, is_read, created_at)
      VALUES 
        (1, 'Specialist Consultation Scheduled', 'Your cardiology consultation has been scheduled for tomorrow at 2:00 PM. Please bring your recent ECG results.', 'appointment', 'high', false, CURRENT_TIMESTAMP),
        (1, 'Health Screening Results Available', 'Your latest health screening results are now available. Please review them in your dashboard.', 'results', 'medium', false, CURRENT_TIMESTAMP - INTERVAL '1 day'),
        (1, 'Medication Reminder', 'Remember to take your prescribed medication as directed. Next dose due in 4 hours.', 'medication', 'medium', true, CURRENT_TIMESTAMP - INTERVAL '2 days')
      ON CONFLICT DO NOTHING
    `)
    
    // Add appointments
    console.log('📅 Adding appointments...')
    await pool.query(`
      INSERT INTO appointments (patient_id, health_worker_id, specialist_id, appointment_date, appointment_type, status, notes)
      VALUES 
        (1, 1, 1, CURRENT_DATE + INTERVAL '1 day', 'specialist_consultation', 'scheduled', 'Cardiology consultation for irregular heartbeat'),
        (1, 1, NULL, CURRENT_DATE + INTERVAL '1 week', 'follow_up', 'scheduled', 'Follow-up screening after specialist consultation')
      ON CONFLICT DO NOTHING
    `)
    
    // Add daily statistics
    console.log('📊 Adding daily statistics...')
    await pool.query(`
      INSERT INTO daily_statistics (health_center_id, date, total_patients_screened, total_screenings_completed, urgent_cases, normal_cases, specialists_consulted, average_waiting_time)
      VALUES 
        (1, CURRENT_DATE, 12, 15, 3, 12, 2, 25.5),
        (1, CURRENT_DATE - INTERVAL '1 day', 10, 13, 2, 11, 1, 22.0),
        (1, CURRENT_DATE - INTERVAL '2 days', 8, 10, 1, 9, 1, 18.5)
      ON CONFLICT (health_center_id, date) DO NOTHING
    `)
    
    // Add specialist daily stats
    console.log('📈 Adding specialist daily stats...')
    await pool.query(`
      INSERT INTO specialist_daily_stats (specialist_id, date, total_consultations, urgent_cases, normal_cases, average_consultation_time, total_queue_time)
      VALUES 
        (1, CURRENT_DATE, 8, 2, 6, 28.5, 240),
        (1, CURRENT_DATE - INTERVAL '1 day', 6, 1, 5, 32.0, 190),
        (1, CURRENT_DATE - INTERVAL '2 days', 5, 1, 4, 25.0, 150)
      ON CONFLICT (specialist_id, date) DO NOTHING
    `)
    
    console.log('\n🎉 Sample data added successfully!')
    
    // Verify the data
    console.log('\n📊 Verification:')
    const healthWorkers = await pool.query('SELECT COUNT(*) FROM health_workers')
    const specialists = await pool.query('SELECT COUNT(*) FROM specialists')
    const totalScreenings = await pool.query('SELECT COUNT(*) FROM health_screenings')
    const vitalSigns = await pool.query('SELECT COUNT(*) FROM vital_signs')
    const recommendations = await pool.query('SELECT COUNT(*) FROM health_recommendations')
    const notifications = await pool.query('SELECT COUNT(*) FROM patient_notifications')
    const appointments = await pool.query('SELECT COUNT(*) FROM appointments')
    
    console.log(`   - Health Workers: ${healthWorkers.rows[0].count}`)
    console.log(`   - Specialists: ${specialists.rows[0].count}`)
    console.log(`   - Health Screenings: ${totalScreenings.rows[0].count}`)
    console.log(`   - Vital Signs: ${vitalSigns.rows[0].count}`)
    console.log(`   - Recommendations: ${recommendations.rows[0].count}`)
    console.log(`   - Notifications: ${notifications.rows[0].count}`)
    console.log(`   - Appointments: ${appointments.rows[0].count}`)
    
  } catch (error) {
    console.error('❌ Failed to add sample data:', error)
  } finally {
    await pool.end()
  }
}

// Run the script
if (require.main === module) {
  addSampleData()
    .then(() => {
      console.log('\n✨ Sample data setup complete!')
      process.exit(0)
    })
    .catch(error => {
      console.error('Failed:', error)
      process.exit(1)
    })
}

module.exports = { addSampleData } 