import { NextRequest, NextResponse } from 'next/server';
import { query, transaction } from '@/lib/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      age,
      gender,
      phoneNumber,
      email,
      password,
      address,
      village,
      district,
      city,
      province,
      weight,
      height,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelationship,
      knownConditions,
      currentMedications,
      allergies,
      previousSurgeries,
      createLogin,
      privacyConsent,
      dataUsageConsent
    } = body;

    // Validate required fields
    if (!fullName || !age || !gender || !phoneNumber || !address || !village || !district || !city || !province || !emergencyContactName || !emergencyContactPhone || !emergencyContactRelationship) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (createLogin && (!phoneNumber || !password)) {
      return NextResponse.json({ error: 'Phone number and password are required when creating login credentials' }, { status: 400 });
    }

    if (!privacyConsent) {
      return NextResponse.json({ error: 'Privacy consent is required' }, { status: 400 });
    }

    // Get health worker's health center
    const healthWorkerResult = await query(
      'SELECT health_center_id FROM health_workers WHERE user_id = $1',
      [userId]
    );

    if (healthWorkerResult.length === 0) {
      return NextResponse.json({ error: 'Health worker not found' }, { status: 404 });
    }

    const healthCenterId = healthWorkerResult[0].health_center_id;

    const result = await transaction(async (client) => {
      let userIdForPatient = null;

      // Create user account if requested
      if (createLogin) {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Check if email already exists (if provided)
        if (email) {
          const existingUser = await client.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
          );

          if (existingUser.rows.length > 0) {
            throw new Error('Email already exists');
          }
        }

        // Check if phone number already exists
        const existingPhone = await client.query(
          'SELECT id FROM users WHERE phone = $1',
          [phoneNumber]
        );

        if (existingPhone.rows.length > 0) {
          throw new Error('Phone number already exists');
        }

        // Create user
        const userResult = await client.query(
          `INSERT INTO users (email, phone, password_hash, role, is_active, full_name, created_at, updated_at) 
           VALUES ($1, $2, $3, 'PATIENT', true, $4, NOW(), NOW()) 
           RETURNING id`,
          [email || null, phoneNumber, hashedPassword, fullName]
        );

        userIdForPatient = userResult.rows[0].id;
      }

      // Generate unique patient ID
      const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
      const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
      const patientIdGenerated = `PT${timestamp}${random}`;

      // Create patient record  
      const patientResult = await client.query(
        `INSERT INTO patients (
          user_id, patient_id, full_name, age, gender, weight_kg, height_cm, phone, email, 
          address, village, district, city, province,
          emergency_contact_name, emergency_contact_phone, emergency_contact_relationship,
          known_conditions, current_medications, allergies, previous_surgeries,
          registered_at_health_center_id, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, true, NOW(), NOW()) 
        RETURNING id, patient_id`,
        [
          userIdForPatient,
          patientIdGenerated,
          fullName,
          age,
          gender,
          weight || null,
          height || null,
          phoneNumber,
          email,
          address,
          village,
          district,
          city,
          province,
          emergencyContactName,
          emergencyContactPhone,
          emergencyContactRelationship,
          knownConditions || '',
          currentMedications || '',
          allergies || '',
          previousSurgeries || '',
          healthCenterId
        ]
      );

      return {
        patientId: patientResult.rows[0].patient_id,
        patientDbId: patientResult.rows[0].id,
        userId: userIdForPatient
      };
    });

    return NextResponse.json({
      success: true,
      patientId: result.patientId,
      userId: result.userId,
      message: createLogin ? 'Patient registered with login credentials' : 'Patient registered successfully'
    });

  } catch (error) {
    console.error('Patient registration error:', error);
    
    // Handle specific error messages
    if (error instanceof Error) {
      if (error.message === 'Email already exists' || error.message === 'Phone number already exists') {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
    }
    
    return NextResponse.json({ error: 'Failed to register patient' }, { status: 500 });
  }
} 