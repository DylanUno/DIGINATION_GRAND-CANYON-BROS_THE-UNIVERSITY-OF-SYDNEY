# VitalSense Pro API Documentation

This document provides a comprehensive overview of the backend API for the VitalSense Pro platform. The API is built with Python and FastAPI, and it handles all business logic, data processing, and communication with the database.

**Base URL**: `http://localhost:8000`

---

## 1. Authentication (`/api/auth`)

Handles user authentication, token management, and password changes for all user roles.

### `POST /login`

-   **Description**: Authenticates a user and returns a JWT access token.
-   **Request Body**:
    -   `email` (string, optional): The user's email address.
    -   `phone` (string, optional): The user's phone number.
    -   `professional_credentials` (string, optional): The specialist's professional ID.
    -   `password` (string, required): The user's password.
-   **Response**:
    -   `access_token` (string): The JWT access token.
    -   `token_type` (string): The type of token (e.g., "bearer").
    -   `user` (object): Information about the authenticated user.

### `POST /logout`

-   **Description**: Logs out the current user (for logging purposes).
-   **Response**:
    -   `message` (string): A confirmation message.

### `GET /me`

-   **Description**: Returns information about the currently authenticated user.
-   **Response**:
    -   `id` (integer): The user's ID.
    -   `full_name` (string): The user's full name.
    -   `role` (string): The user's role (e.g., "patient", "health-worker", "specialist").
    -   And other user details...

### `POST /change-password`

-   **Description**: Allows an authenticated user to change their password.
-   **Request Body**:
    -   `current_password` (string): The user's current password.
    -   `new_password` (string): The new password.

### `POST /refresh-token`

-   **Description**: Refreshes the JWT access token for the current user.

### `GET /validate-token`

-   **Description**: Validates the current JWT access token.

---

## 2. Data Upload (`/api/upload`)

Handles the upload and processing of vital signs data.

### `POST /upload-vital-signs`

-   **Description**: Uploads vital signs files (`.dat`, `.hea`, `.breath`) and a video file for a patient. This endpoint processes the data, runs it through the MAI-DxO pipeline, and creates an analysis session.
-   **Request Body** (multipart/form-data):
    -   `patient_id` (string): The ID of the patient.
    -   `chief_complaint`, `symptoms`, `pain_scale`, etc.: Clinical context information.
    -   `dat_file`, `hea_file`, `breath_annotation_file`, `video_file`: The files to be uploaded.
-   **Response**:
    -   `session_id` (string): The unique ID for the analysis session.
    -   `ai_risk_level` (string): The calculated risk level for the patient.
    -   And other processing details...

---

## 3. Specialist Analysis (`/api/specialist-analysis`)

Provides endpoints for specialists to access patient analysis data.

### `GET /patient-analysis/{patient_id}`

-   **Description**: Retrieves the complete analysis data for a specific patient, including vital signs, clinical context, and MAI-DxO results.
-   **Response**:
    -   `patient_info` (object): The patient's demographic information.
    -   `analysis_session` (object): Details about the analysis session.
    -   `clinical_context` (object): The clinical notes and symptoms.
    -   `vital_signs` (object): The processed vital signs data.
    -   `mai_dxo_results` (object): The results from the AI analysis pipeline.

### `GET /mai-dxo-summary/{patient_id}`

-   **Description**: Returns a simplified summary of the MAI-DxO analysis for a quick review.

---

## 4. Plot Generation (`/api/plots`)

Generates and serves medical plots for the specialist portal.

### `GET /patient-plots/{patient_id}`

-   **Description**: Generates all available plots (ECG waveform, vital signs trend, etc.) for a specific patient.
-   **Response**:
    -   `plots` (object): A dictionary containing the data for each generated plot.

### `GET /plot/{plot_type}/{patient_id}`

-   **Description**: Retrieves a single, specific plot for a patient.

### `GET /plot-info/{patient_id}`

-   **Description**: Returns information about the available plots for a patient.

---

## 5. Video Processing (`/api/video`)

Handles the processing of video files to extract vital signs.

### `POST /upload-video`

-   **Description**: Uploads a video file and processes it to extract respiratory rate and other vital signs using the VitalLens API.
-   **Request Body** (multipart/form-data):
    -   `patient_id` (string): The ID of the patient.
    -   `video_file` (file): The video file to be uploaded.
-   **Response**:
    -   `session_id` (string): The unique ID for the video processing session.
    -   `respiratory_rate` (float): The calculated respiratory rate.

### `GET /video-session/{session_id}`

-   **Description**: Retrieves the results of a video processing session.

### `DELETE /video-session/{session_id}`

-   **Description**: Deletes a video processing session and its associated files. 