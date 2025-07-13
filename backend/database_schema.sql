-- Healthcare Portal Database Schema (Fixed Order)
-- Created with proper foreign key dependency order

-- Core user roles table
CREATE TABLE user_roles (
    id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, description) VALUES 
('patient', 'Community health patients'),
('health_worker', 'Community health center workers'),
('specialist', 'Medical specialists providing remote consultations');

-- Health Centers/Facilities (moved up to resolve foreign key dependencies)
CREATE TABLE health_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    type VARCHAR(50), -- 'puskesmas', 'hospital', 'clinic'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample health centers
INSERT INTO health_centers (name, address, type) VALUES 
('Puskesmas Central Jakarta', 'Jl. Sudirman No. 123, Jakarta Pusat', 'puskesmas'),
('Puskesmas Karimunjawa', 'Jl. Pantai Indah No. 45, Karimunjawa', 'puskesmas'),
('Puskesmas Bogor Tengah', 'Jl. Raya Bogor No. 78, Bogor', 'puskesmas');

-- Main users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES user_roles(id) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-- Patients table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    address TEXT,
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    medical_record_number VARCHAR(50) UNIQUE,
    health_center_id INTEGER REFERENCES health_centers(id) NOT NULL,
    blood_type VARCHAR(10),
    weight DECIMAL(5,2),
    height INTEGER, -- in cm
    allergies TEXT[],
    medical_conditions TEXT[],
    current_medications TEXT[],
    registration_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'inactive', 'pending_review'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health workers table
CREATE TABLE health_workers (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    hire_date DATE,
    supervisor_id INTEGER REFERENCES health_workers(id),
    health_center_id INTEGER REFERENCES health_centers(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialists table
CREATE TABLE specialists (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    professional_credentials VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    medical_license_number VARCHAR(100) UNIQUE NOT NULL,
    license_state VARCHAR(50),
    license_expiry_date DATE,
    license_verified BOOLEAN DEFAULT false,
    license_verified_at TIMESTAMP,
    years_experience INTEGER,
    board_certifications TEXT[],
    education TEXT,
    consultation_fee DECIMAL(10,2),
    available_for_emergency BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5-Modal Health Screenings (main test sessions)
CREATE TABLE health_screenings (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    health_center_id INTEGER REFERENCES health_centers(id),
    health_worker_id INTEGER REFERENCES health_workers(id),
    screening_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'completed',
    overall_status VARCHAR(50), -- 'healthy', 'attention_needed', 'urgent'
    overall_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session management
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login attempts (security)
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    identifier VARCHAR(255) NOT NULL,
    ip_address INET,
    success BOOLEAN NOT NULL,
    attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    failure_reason VARCHAR(100)
);

-- Vital Signs (5-modal measurements)
CREATE TABLE vital_signs (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    measurement_type VARCHAR(50) NOT NULL, -- 'heart_rate', 'blood_pressure', 'temperature', 'oxygen_saturation', 'respiratory_rate'
    value_numeric DECIMAL(10,2),
    value_text VARCHAR(100), -- For complex values like "120/80 mmHg"
    unit VARCHAR(20),
    status VARCHAR(20) DEFAULT 'normal', -- 'normal', 'attention', 'abnormal'
    reference_range VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Reports (generated PDFs and summaries)
CREATE TABLE health_reports (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    screening_id INTEGER REFERENCES health_screenings(id),
    title VARCHAR(200) NOT NULL,
    report_type VARCHAR(50) NOT NULL, -- 'summary', 'specialized', 'laboratory'
    period_description VARCHAR(100), -- 'Last 6 Months', 'Latest Results'
    status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'ready', 'error'
    file_size VARCHAR(20),
    page_count INTEGER,
    description TEXT,
    includes TEXT[], -- Array of what's included in report
    file_path VARCHAR(500), -- Path to generated PDF
    generated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    health_center_id INTEGER REFERENCES health_centers(id),
    appointment_date TIMESTAMP NOT NULL,
    appointment_type VARCHAR(100) DEFAULT 'routine_followup',
    status VARCHAR(50) DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Health Recommendations (from specialists/AI analysis)
CREATE TABLE health_recommendations (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    category VARCHAR(100), -- 'diet_nutrition', 'physical_activity', 'lifestyle', 'medical_followup'
    recommendation_text TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    created_by VARCHAR(100), -- 'system', 'specialist_id', 'health_worker_id'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patient Notifications
CREATE TABLE patient_notifications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'appointment_reminder', 'health_tip', 'action_required', 'test_result'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    read_status BOOLEAN DEFAULT false,
    action_required BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Emergency Contacts
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialist-Health Center Assignments
CREATE TABLE specialist_assignments (
    id SERIAL PRIMARY KEY,
    specialist_id INTEGER REFERENCES specialists(id) ON DELETE CASCADE,
    health_center_id INTEGER REFERENCES health_centers(id) ON DELETE CASCADE,
    assigned_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(specialist_id, health_center_id)
);

-- Specialist Consultation Queue
CREATE TABLE specialist_queue (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    assigned_specialist_id INTEGER REFERENCES specialists(id),
    health_center_id INTEGER REFERENCES health_centers(id),
    submission_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'in_review', 'completed', 'requires_more_info'
    risk_level VARCHAR(20), -- 'low', 'medium', 'high'
    wait_time_minutes INTEGER,
    priority_score INTEGER DEFAULT 5, -- 1-10, calculated based on risk and wait time
    chief_complaint TEXT,
    symptoms TEXT[],
    reviewed_at TIMESTAMP,
    completed_at TIMESTAMP
);

-- Specialist Consultations
CREATE TABLE specialist_consultations (
    id SERIAL PRIMARY KEY,
    specialist_queue_id INTEGER REFERENCES specialist_queue(id) ON DELETE CASCADE,
    specialist_id INTEGER REFERENCES specialists(id),
    patient_id INTEGER REFERENCES patients(id),
    screening_id INTEGER REFERENCES health_screenings(id),
    clinical_notes TEXT,
    icd10_diagnosis_code VARCHAR(20),
    icd10_diagnosis_description TEXT,
    urgency_assessment VARCHAR(50), -- 'emergency', 'urgent', 'routine'
    treatment_recommendations TEXT,
    additional_tests_required TEXT[],
    follow_up_instructions TEXT,
    requires_emergency_care BOOLEAN DEFAULT false,
    requires_additional_info BOOLEAN DEFAULT false,
    consultation_duration_minutes INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Specialist Daily Statistics
CREATE TABLE specialist_daily_stats (
    id SERIAL PRIMARY KEY,
    specialist_id INTEGER REFERENCES specialists(id),
    stat_date DATE DEFAULT CURRENT_DATE,
    total_cases_reviewed INTEGER DEFAULT 0,
    high_priority_cases INTEGER DEFAULT 0,
    emergency_cases INTEGER DEFAULT 0,
    average_review_time_minutes INTEGER DEFAULT 0,
    cases_requiring_emergency_care INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(specialist_id, stat_date)
);

-- Patient Communication
CREATE TABLE patient_communications (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    screening_id INTEGER REFERENCES health_screenings(id),
    sender_type VARCHAR(20) NOT NULL, -- 'specialist', 'health_worker', 'patient'
    sender_id INTEGER NOT NULL,
    recipient_type VARCHAR(20) NOT NULL,
    recipient_id INTEGER NOT NULL,
    message_type VARCHAR(50), -- 'consultation_request', 'additional_info_request', 'treatment_update'
    subject VARCHAR(200),
    message_text TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT false,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analysis Processing Queue
CREATE TABLE analysis_queue (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    health_worker_id INTEGER REFERENCES health_workers(id),
    screening_id INTEGER REFERENCES health_screenings(id),
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'processing', -- 'processing', 'completed', 'urgent_review', 'failed'
    ai_risk_level VARCHAR(20), -- 'low', 'medium', 'high'
    estimated_completion TIMESTAMP,
    progress_percentage INTEGER DEFAULT 0,
    queue_position INTEGER,
    priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
    processing_notes TEXT,
    completed_at TIMESTAMP
);

-- ECG File Uploads
CREATE TABLE ecg_files (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    dat_file_path VARCHAR(500), -- Path to .dat file
    hea_file_path VARCHAR(500), -- Path to .hea file
    dat_file_size BIGINT,
    hea_file_size BIGINT,
    upload_status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'validated', 'processing', 'processed', 'error'
    validation_status VARCHAR(50), -- 'passed', 'failed', 'pending'
    validation_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Video Recordings
CREATE TABLE video_recordings (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    file_path VARCHAR(500),
    file_size BIGINT,
    duration_seconds INTEGER,
    recording_type VARCHAR(20), -- 'live', 'uploaded'
    quality_check_status VARCHAR(20) DEFAULT 'pending', -- 'passed', 'failed', 'pending'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Clinical Context & Symptoms
CREATE TABLE clinical_context (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    chief_complaint VARCHAR(200),
    symptom_duration VARCHAR(100),
    pain_scale INTEGER CHECK (pain_scale >= 0 AND pain_scale <= 10),
    additional_symptoms TEXT[], -- Array of symptoms
    staff_observations TEXT,
    recorded_by INTEGER REFERENCES health_workers(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Analysis Results
CREATE TABLE ai_analysis_results (
    id SERIAL PRIMARY KEY,
    screening_id INTEGER REFERENCES health_screenings(id) ON DELETE CASCADE,
    overall_risk VARCHAR(20), -- 'low', 'medium', 'high'
    confidence_score INTEGER, -- 0-100
    analysis_findings JSONB, -- Structured AI findings by category
    specialist_notes TEXT,
    reviewed_by INTEGER REFERENCES specialists(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Statistics
CREATE TABLE daily_statistics (
    id SERIAL PRIMARY KEY,
    health_center_id INTEGER REFERENCES health_centers(id),
    stat_date DATE DEFAULT CURRENT_DATE,
    patients_processed INTEGER DEFAULT 0,
    pending_reviews INTEGER DEFAULT 0,
    urgent_cases INTEGER DEFAULT 0,
    average_processing_time_minutes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(health_center_id, stat_date)
);

-- Patient Medical History
CREATE TABLE medical_history (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    visit_date DATE NOT NULL,
    visit_type VARCHAR(100), -- 'routine_checkup', 'followup', 'emergency'
    provider_name VARCHAR(200),
    facility_name VARCHAR(200),
    clinical_notes TEXT,
    diagnosis TEXT,
    treatment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert comprehensive sample data
-- Sample users (passwords are hashed version of 'password123')
INSERT INTO users (role_id, password_hash, is_active, phone_verified, email_verified) VALUES 
(1, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true),  -- Patient
(1, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true),  -- Patient
(1, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true),  -- Patient
(2, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true),  -- Health Worker
(2, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true),  -- Health Worker
(3, '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewLjMgDgCIZKqSha', true, true, true);  -- Specialist

-- Sample health workers
INSERT INTO health_workers (user_id, employee_id, email, phone_number, first_name, last_name, department, position, hire_date, health_center_id) VALUES 
(4, 'HW001', 'sarah.johnson@puskesmas.id', '+62-21-1234567', 'Sarah', 'Johnson', 'General Medicine', 'Senior Health Worker', '2022-01-15', 1),
(5, 'HW002', 'ahmad.ridwan@puskesmas.id', '+62-274-7654321', 'Ahmad', 'Ridwan', 'General Medicine', 'Health Worker', '2023-03-20', 2);

-- Sample patients
INSERT INTO patients (user_id, phone_number, first_name, last_name, date_of_birth, gender, address, emergency_contact_name, emergency_contact_phone, emergency_contact_relationship, medical_record_number, health_center_id, blood_type, weight, height, allergies, medical_conditions, current_medications, registration_date) VALUES 
(1, '+62-812-3456789', 'John', 'Doe', '1985-05-15', 'Male', 'Jl. Kebon Jeruk No. 123, Jakarta', 'Jane Doe', '+62-812-9876543', 'Spouse', 'MR001', 1, 'O+', 70.5, 175, ARRAY['Penicillin'], ARRAY['Hypertension'], ARRAY['Lisinopril 10mg'], '2023-01-10'),
(2, '+62-813-7654321', 'Maria', 'Santos', '1992-08-22', 'Female', 'Jl. Pantai Baru No. 45, Karimunjawa', 'Carlos Santos', '+62-813-1234567', 'Father', 'MR002', 2, 'A+', 58.2, 160, ARRAY['Shellfish'], ARRAY['Asthma'], ARRAY['Albuterol inhaler'], '2023-02-15'),
(3, '+62-814-5555555', 'Robert', 'Wilson', '1978-12-03', 'Male', 'Jl. Bogor Raya No. 78, Bogor', 'Linda Wilson', '+62-814-6666666', 'Spouse', 'MR003', 1, 'B+', 82.1, 180, ARRAY[], ARRAY['Diabetes Type 2'], ARRAY['Metformin 500mg'], '2023-03-01');

-- Sample specialists
INSERT INTO specialists (user_id, professional_credentials, email, phone_number, first_name, last_name, specialty, medical_license_number, license_state, license_expiry_date, license_verified, years_experience, board_certifications, education, consultation_fee, available_for_emergency) VALUES 
(6, 'DR001', 'emily.carter@specialist.id', '+62-21-9876543', 'Emily', 'Carter', 'Cardiology', 'LIC123456', 'Jakarta', '2025-12-31', true, 12, ARRAY['American Board of Cardiology', 'Indonesian Cardiology Association'], 'MD from University of Indonesia, Fellowship in Cardiology', 500000.00, true);

-- Sample specialist assignments
INSERT INTO specialist_assignments (specialist_id, health_center_id) VALUES 
(1, 1), -- Dr. Emily Carter assigned to Puskesmas Central Jakarta
(1, 2); -- Dr. Emily Carter also assigned to Puskesmas Karimunjawa

-- Sample health screenings
INSERT INTO health_screenings (patient_id, health_center_id, health_worker_id, screening_date, status, overall_status, overall_notes) VALUES 
(1, 1, 1, '2024-01-15 09:30:00', 'completed', 'attention_needed', 'Patient shows elevated blood pressure readings'),
(2, 2, 2, '2024-01-16 14:15:00', 'completed', 'healthy', 'All vital signs within normal range'),
(3, 1, 1, '2024-01-17 10:45:00', 'completed', 'urgent', 'High glucose levels detected, immediate follow-up required'),
(1, 1, 1, '2024-01-20 08:30:00', 'completed', 'healthy', 'Blood pressure normalized after medication adjustment');

-- Sample vital signs
INSERT INTO vital_signs (screening_id, measurement_type, value_numeric, value_text, unit, status, reference_range, notes) VALUES 
-- Screening 1 (John Doe - attention needed)
(1, 'heart_rate', 85, '85 bpm', 'bpm', 'normal', '60-100 bpm', NULL),
(1, 'blood_pressure', NULL, '145/92 mmHg', 'mmHg', 'abnormal', '90-120/60-80 mmHg', 'Elevated, requires monitoring'),
(1, 'temperature', 36.8, '36.8°C', '°C', 'normal', '36.1-37.2°C', NULL),
(1, 'oxygen_saturation', 98, '98%', '%', 'normal', '95-100%', NULL),
(1, 'respiratory_rate', 18, '18 breaths/min', 'breaths/min', 'normal', '12-20 breaths/min', NULL),
-- Screening 2 (Maria Santos - healthy)
(2, 'heart_rate', 72, '72 bpm', 'bpm', 'normal', '60-100 bpm', NULL),
(2, 'blood_pressure', NULL, '118/75 mmHg', 'mmHg', 'normal', '90-120/60-80 mmHg', NULL),
(2, 'temperature', 36.5, '36.5°C', '°C', 'normal', '36.1-37.2°C', NULL),
(2, 'oxygen_saturation', 99, '99%', '%', 'normal', '95-100%', NULL),
(2, 'respiratory_rate', 16, '16 breaths/min', 'breaths/min', 'normal', '12-20 breaths/min', NULL),
-- Screening 3 (Robert Wilson - urgent)
(3, 'heart_rate', 95, '95 bpm', 'bpm', 'attention', '60-100 bpm', 'Slightly elevated'),
(3, 'blood_pressure', NULL, '160/105 mmHg', 'mmHg', 'abnormal', '90-120/60-80 mmHg', 'Hypertensive crisis range'),
(3, 'temperature', 37.1, '37.1°C', '°C', 'normal', '36.1-37.2°C', NULL),
(3, 'oxygen_saturation', 96, '96%', '%', 'normal', '95-100%', NULL),
(3, 'respiratory_rate', 22, '22 breaths/min', 'breaths/min', 'attention', '12-20 breaths/min', 'Slightly elevated'),
-- Screening 4 (John Doe - follow-up, healthy)
(4, 'heart_rate', 78, '78 bpm', 'bpm', 'normal', '60-100 bpm', NULL),
(4, 'blood_pressure', NULL, '125/80 mmHg', 'mmHg', 'normal', '90-120/60-80 mmHg', 'Improved with medication'),
(4, 'temperature', 36.6, '36.6°C', '°C', 'normal', '36.1-37.2°C', NULL),
(4, 'oxygen_saturation', 98, '98%', '%', 'normal', '95-100%', NULL),
(4, 'respiratory_rate', 16, '16 breaths/min', 'breaths/min', 'normal', '12-20 breaths/min', NULL);

-- Sample clinical context
INSERT INTO clinical_context (screening_id, chief_complaint, symptom_duration, pain_scale, additional_symptoms, staff_observations, recorded_by) VALUES 
(1, 'Chest tightness and shortness of breath', '2 days', 4, ARRAY['Fatigue', 'Dizziness'], 'Patient appears anxious about symptoms', 1),
(2, 'Routine health checkup', NULL, 0, ARRAY[], 'Patient in good spirits, no acute distress', 2),
(3, 'Increased thirst and frequent urination', '1 week', 2, ARRAY['Fatigue', 'Blurred vision'], 'Patient reports significant weight loss', 1),
(4, 'Follow-up for blood pressure', NULL, 1, ARRAY[], 'Patient reports feeling better since starting medication', 1);

-- Sample analysis queue
INSERT INTO analysis_queue (patient_id, health_worker_id, screening_id, upload_time, status, ai_risk_level, progress_percentage, priority) VALUES 
(1, 1, 1, '2024-01-15 09:45:00', 'completed', 'medium', 100, 6),
(2, 2, 2, '2024-01-16 14:30:00', 'completed', 'low', 100, 3),
(3, 1, 3, '2024-01-17 11:00:00', 'urgent_review', 'high', 100, 9);

-- Sample specialist queue
INSERT INTO specialist_queue (patient_id, screening_id, assigned_specialist_id, health_center_id, submission_time, status, risk_level, wait_time_minutes, priority_score, chief_complaint, symptoms) VALUES 
(1, 1, 1, 1, '2024-01-15 10:00:00', 'completed', 'medium', 30, 6, 'Chest tightness and shortness of breath', ARRAY['Chest pain', 'Shortness of breath', 'Fatigue']),
(3, 3, 1, 1, '2024-01-17 11:15:00', 'pending', 'high', 45, 9, 'Increased thirst and frequent urination', ARRAY['Excessive thirst', 'Frequent urination', 'Fatigue', 'Blurred vision']);

-- Sample health recommendations
INSERT INTO health_recommendations (screening_id, category, recommendation_text, priority, created_by) VALUES 
(1, 'medical_followup', 'Follow up with cardiologist within 2 weeks for further evaluation', 'high', 'specialist_1'),
(1, 'lifestyle', 'Reduce sodium intake to less than 2300mg per day', 'normal', 'specialist_1'),
(2, 'lifestyle', 'Continue regular exercise and maintain healthy diet', 'normal', 'system'),
(3, 'medical_followup', 'Immediate endocrinologist consultation required', 'urgent', 'specialist_1'),
(3, 'diet_nutrition', 'Strict diabetic diet plan implementation', 'high', 'specialist_1');

-- Sample health reports
INSERT INTO health_reports (patient_id, screening_id, title, report_type, period_description, status, file_size, page_count, description, includes, file_path, generated_at) VALUES 
(1, 1, 'Cardiovascular Health Assessment', 'specialized', 'January 2024 Screening', 'ready', '2.3 MB', 8, 'Comprehensive cardiovascular health evaluation including vital signs analysis and specialist recommendations', ARRAY['Vital Signs Summary', 'Risk Assessment', 'Specialist Notes', 'Follow-up Plan'], '/reports/patient_1_cardio_jan2024.pdf', '2024-01-15 11:30:00'),
(2, 2, 'General Health Summary', 'summary', 'January 2024 Screening', 'ready', '1.8 MB', 5, 'Complete health screening results with all normal findings', ARRAY['Vital Signs', 'Health Status', 'Recommendations'], '/reports/patient_2_summary_jan2024.pdf', '2024-01-16 15:00:00'),
(3, 3, 'Diabetes Risk Assessment', 'specialized', 'January 2024 Screening', 'ready', '3.1 MB', 12, 'Urgent diabetes evaluation with immediate action plan', ARRAY['Glucose Analysis', 'Risk Factors', 'Treatment Plan', 'Emergency Protocols'], '/reports/patient_3_diabetes_jan2024.pdf', '2024-01-17 12:00:00');

-- Sample appointments
INSERT INTO appointments (patient_id, health_center_id, appointment_date, appointment_type, status, notes) VALUES 
(1, 1, '2024-01-30 10:00:00', 'cardiology_followup', 'scheduled', 'Follow-up for elevated blood pressure'),
(2, 2, '2024-02-15 14:30:00', 'routine_checkup', 'scheduled', 'Annual health screening'),
(3, 1, '2024-01-25 08:00:00', 'emergency_consultation', 'scheduled', 'Urgent diabetes consultation');

-- Sample patient notifications
INSERT INTO patient_notifications (patient_id, title, message, type, priority, read_status, action_required) VALUES 
(1, 'Cardiology Follow-up Scheduled', 'Your follow-up appointment for cardiovascular evaluation is scheduled for January 30th at 10:00 AM.', 'appointment_reminder', 'high', false, true),
(1, 'Health Report Available', 'Your Cardiovascular Health Assessment report is now available for download.', 'test_result', 'normal', false, false),
(2, 'Great Health Results!', 'Your recent health screening shows all normal results. Keep up the good work!', 'test_result', 'normal', true, false),
(3, 'URGENT: Diabetes Consultation Required', 'Your screening results require immediate medical attention. Please attend your appointment on January 25th.', 'action_required', 'urgent', false, true);

-- Sample daily statistics
INSERT INTO daily_statistics (health_center_id, stat_date, patients_processed, pending_reviews, urgent_cases, average_processing_time_minutes) VALUES 
(1, '2024-01-15', 8, 2, 1, 15),
(1, '2024-01-16', 12, 3, 0, 12),
(1, '2024-01-17', 10, 1, 2, 18),
(2, '2024-01-15', 6, 1, 0, 14),
(2, '2024-01-16', 9, 2, 0, 13);

-- Sample specialist daily stats
INSERT INTO specialist_daily_stats (specialist_id, stat_date, total_cases_reviewed, high_priority_cases, emergency_cases, average_review_time_minutes) VALUES 
(1, '2024-01-15', 5, 2, 0, 25),
(1, '2024-01-16', 8, 1, 1, 22),
(1, '2024-01-17', 6, 3, 1, 28);

-- Performance indexes
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_patients_phone ON patients(phone_number);
CREATE INDEX idx_patients_health_center ON patients(health_center_id);
CREATE INDEX idx_health_workers_employee_id ON health_workers(employee_id);
CREATE INDEX idx_health_workers_center ON health_workers(health_center_id);
CREATE INDEX idx_specialists_credentials ON specialists(professional_credentials);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_health_screenings_patient ON health_screenings(patient_id);
CREATE INDEX idx_health_screenings_date ON health_screenings(screening_date);
CREATE INDEX idx_vital_signs_screening ON vital_signs(screening_id);
CREATE INDEX idx_health_reports_patient ON health_reports(patient_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_patient_notifications_patient ON patient_notifications(patient_id);
CREATE INDEX idx_analysis_queue_status ON analysis_queue(status);
CREATE INDEX idx_analysis_queue_priority ON analysis_queue(priority DESC);
CREATE INDEX idx_specialist_queue_specialist ON specialist_queue(assigned_specialist_id);
CREATE INDEX idx_specialist_queue_status ON specialist_queue(status);
CREATE INDEX idx_specialist_queue_priority ON specialist_queue(priority_score DESC);
CREATE INDEX idx_daily_stats_center_date ON daily_statistics(health_center_id, stat_date);
CREATE INDEX idx_specialist_daily_stats_date ON specialist_daily_stats(specialist_id, stat_date); 