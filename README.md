# AI-Powered Multi-Modal Health Analysis Platform - MVP Showcase

Welcome, Judges! This README provides a guide to exploring the Minimum Viable Product (MVP) of our AI-Powered Multi-Modal Health Analysis Platform. Our platform aims to bridge the healthcare gap by connecting rural patients with urban medical expertise through intelligent vital sign analysis and remote consultation.

## About the MVP

This MVP demonstrates the core user flows and interface design for both patients and specialists. It showcases:

*   **Separate User Portals**: Distinct and secure access points for patients and medical specialists.
*   **Authentication Flow**: Simulated login for both user types.
*   **Patient Dashboard**: A central hub for patients to manage their health information and analyses.
*   **New Analysis Submission**: A guided process for patients to submit their biodata (further steps for vital sign upload would be integrated in future phases).
*   **Specialist Dashboard**: An interface for specialists to view patient information (in a real-world scenario, this would include a queue of patients awaiting consultation).
*   **Professional & Accessible UI**: A clean, modern, and user-friendly interface built with accessibility in mind, utilizing ShadCN UI and TailwindCSS.

## Technology Stack

*   **Framework**: Next.js 14.x with App Router
*   **Language**: TypeScript
*   **Styling**: TailwindCSS
*   **UI Components**: ShadCN UI
*   **Form Management**: React Hook Form
*   **Schema Validation**: Zod

## Getting Started & Exploring the MVP

Follow these steps to run and test the platform:

1.  **Prerequisites**:
    *   Node.js (v18 or later recommended)
    *   npm (or yarn/pnpm)

2.  **Clone the Repository (if you haven't already)**:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

3.  **Install Dependencies**:
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

4.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    This will start the application, typically on `http://localhost:3000`.

5.  **Access the Platform**:
    Open your web browser and navigate to `http://localhost:3000`. You will see the landing page.

## Testing User Flows

We've implemented hardcoded credentials for easy access to the MVP's features.

### 1. Patient Flow

*   **Navigate to Patient Login**:
    *   From the landing page (`http://localhost:3000`), click on **"Patient Access"** (either in the header or the hero section).
    *   This will take you to `http://localhost:3000/auth/patient/login`.
*   **Login as a Patient**:
    *   **Email**: `patient@example.com`
    *   **Password**: `password123`
    *   Click the "Login" button.
*   **Explore Patient Dashboard**:
    *   You'll be redirected to the patient dashboard (`http://localhost:3000/patient/dashboard`).
    *   From here, you can navigate to:
        *   **New Analysis**: To start a new health analysis (currently includes biodata submission).
        *   **Analysis History** (Placeholder)
        *   **Profile Settings** (Placeholder)
        *   **Help & Instructions** (Placeholder)
*   **Test Biodata Submission**:
    *   Click on "New Analysis" from the sidebar.
    *   You will be taken to the biodata form (`http://localhost:3000/patient/new-analysis`, which then leads to `.../biodata`).
    *   Fill in the form (or leave defaults) and click "Save Biodata". You should see a success toast message.
*   **Logout**:
    *   Click the "Logout" button in the patient sidebar (visible on desktop) or the mobile menu. You will be redirected to the landing page.

### 2. Specialist Flow

*   **Navigate to Specialist Login**:
    *   From the landing page (`http://localhost:3000`), click on **"Specialist Login"**.
    *   This will take you to `http://localhost:3000/auth/specialist/login`.
*   **Login as a Specialist**:
    *   **Professional Credentials**: `doctor123`
    *   **Password**: `spec456`
    *   Click the "Login" button.
*   **Explore Specialist Dashboard**:
    *   You'll be redirected to the specialist dashboard (`http://localhost:3000/specialist/dashboard`).
    *   (Further specialist-specific features like patient queues and detailed analysis views would be built out in subsequent phases).
*   **Logout**:
    *   Click the "Logout" icon (user icon with logout arrow) in the header. You will be redirected to the landing page.

## Key MVP Highlights

*   **Clear Separation of Concerns**: Distinct layouts and navigation for different user roles.
*   **Component-Based Architecture**: Reusable UI components for consistency and maintainability.
*   **Responsive Design**: The interface adapts to different screen sizes.
*   **Foundation for Future Development**: The current structure provides a solid base for integrating backend services, AI models, and more complex features.

## Next Steps (Beyond MVP)

*   Full backend integration with a database (e.g., PostgreSQL with Drizzle ORM).
*   Secure authentication (e.g., NextAuth.js).
*   Integration of AI models for health data analysis.
*   File upload capabilities for medical images/data.
*   Real-time communication features for consultations.

---

Thank you for evaluating our MVP! We're excited about the potential of this platform to improve healthcare access.
