# VitalSense Pro Database Schema

This document provides a detailed overview of the PostgreSQL database schema for the VitalSense Pro platform. It outlines the structure of each table, the columns they contain, and the relationships between them.

---

## 1. `users`

Stores authentication and profile information for all user types.

| Column                   | Type         | Description                                     |
| ------------------------ | ------------ | ----------------------------------------------- |
| `id` (PK)                | Integer      | Unique identifier for the user.                 |
| `email`                  | String       | User's email address (optional).                |
| `phone`                  | String       | User's phone number (optional).                 |
| `professional_credentials` | String       | Unique ID for specialists.                      |
| `health_center_id`       | Integer      | ID of the health center for health workers.     |
| `password_hash`          | String       | Hashed user password.                           |
| `role`                   | Enum         | `HEALTH_WORKER`, `SPECIALIST`, `PATIENT`.       |
| `is_active`              | Boolean      | Whether the user account is active.             |
| `is_verified`            | Boolean      | Whether a specialist's license is verified.     |
| `full_name`              | String       | The user's full name.                           |
| `created_at`             | DateTime     | Timestamp of user creation.                     |
| `updated_at`             | DateTime     | Timestamp of the last update.                   |
| `last_login`             | DateTime     | Timestamp of the last login.                    |

---

## 2. `patients`

Stores demographic and medical information for patients.

| Column                         | Type    | Description                                     |
| ------------------------------ | ------- | ----------------------------------------------- |
| `id` (PK)                      | Integer | Unique identifier for the patient.              |
| `user_id` (FK to `users`)      | Integer | Links to the patient's user account.            |
| `full_name`                    | String  | Patient's full name.                            |
| `age`                          | Integer | Patient's age.                                  |
| `gender`                       | Enum    | `MALE`, `FEMALE`, `OTHER`.                      |
| `weight_kg`, `height_cm`       | Float   | Patient's physical characteristics.             |
| `phone`, `email`               | String  | Patient's contact information.                  |
| `address`, `village`, etc.     | Text    | Patient's address details.                      |
| `emergency_contact_name`, etc. | String  | Emergency contact information.                  |
| `known_conditions`, etc.       | Text    | Patient's medical history.                      |
| `patient_id`                   | String  | External patient ID.                            |
| `registered_at_health_center_id` (FK to `health_centers`) | Integer | The health center where the patient is registered. |
| `is_active`                    | Boolean | Whether the patient's record is active.         |

---

## 3. `health_centers`

Represents the local health facilities (Puskesmas).

| Column      | Type    | Description                           |
| ----------- | ------- | ------------------------------------- |
| `id` (PK)   | Integer | Unique identifier for the health center.|
| `name`      | String  | Name of the health center.            |
| `code`      | String  | Unique facility code.                 |
| `address`   | Text    | Address of the health center.         |
| `city`      | String  | City where the health center is located.|
| `province`  | String  | Province where the health center is located.|
| `phone`     | String  | Contact phone number.                 |
| `email`     | String  | Contact email address.                |

---

## 4. `analysis_sessions`

The core table that stores data related to each patient analysis session.

| Column                   | Type    | Description                                     |
| ------------------------ | ------- | ----------------------------------------------- |
| `id` (PK)                | Integer | Unique identifier for the session.              |
| `session_id`             | String  | UUID for organizing session files.              |
| `patient_id` (FK to `patients`) | String  | The patient being analyzed.                     |
| `health_worker_id` (FK to `users`) | Integer | The health worker who uploaded the data.        |
| `specialist_user_id` (FK to `users`) | Integer | The specialist who reviewed the session.      |
| `status`                 | Enum    | `UPLOADED`, `PROCESSING`, `COMPLETED`, etc.     |
| `ai_risk_level`          | Enum    | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.            |
| `dat_file_path`, etc.    | String  | Paths to the uploaded vital signs files.        |
| `features`               | JSON    | Extracted vital signs features.                 |
| `mai_dxo_data`           | JSON    | Data from the AI analysis pipeline.             |
| `heart_rate_bpm`, etc.   | Float   | Processed vital signs data.                     |
| `specialist_notes`       | Text    | Notes from the specialist.                      |

---

## 5. `specialist_consultations`

Tracks detailed feedback and history from specialist consultations.

| Column                   | Type    | Description                                     |
| ------------------------ | ------- | ----------------------------------------------- |
| `id` (PK)                | Integer | Unique identifier for the consultation.         |
| `analysis_session_id` (FK to `analysis_sessions`) | Integer | The analysis session being reviewed.            |
| `specialist_user_id` (FK to `users`) | Integer | The specialist providing the consultation.      |
| `patient_id` (FK to `patients`) | Integer | The patient being reviewed.                     |
| `consultation_type`      | Enum    | `INITIAL_REVIEW`, `FOLLOW_UP`, etc.             |
| `priority`               | Enum    | `ROUTINE`, `URGENT`, `EMERGENCY`.               |
| `clinical_notes`         | Text    | The specialist's detailed clinical notes.       |
| `primary_diagnosis_code` | String  | The primary ICD-10 diagnosis code.              |
| `treatment_plan`         | Text    | The recommended treatment plan.                 |
| `follow_up_required`     | Boolean | Whether a follow-up is required.                | 