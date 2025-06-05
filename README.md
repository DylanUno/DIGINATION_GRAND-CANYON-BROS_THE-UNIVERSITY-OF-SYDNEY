# AI-Powered Multi-Modal Health Analysis Platform

This project implements the MVP for an AI-powered health analysis platform that connects rural patients with urban medical expertise through intelligent vital sign analysis and remote consultation capabilities.

## Project Structure

The application follows a modern Next.js architecture with the App Router pattern, structured according to the project plan:

- `src/app`: Main application routes and layouts
  - `(auth)`: Authentication-related pages
  - `(patient)`: Patient-facing pages
  - `(specialist)`: Specialist-facing pages
- `src/components`: Reusable UI components
  - `ui/`: ShadCN UI components
  - `specialist/`: Specialist-specific components
- `src/lib`: Utility functions and schemas
- `src/hooks`: Custom React hooks

## Features Implemented (MVP)

- Landing page with professional medical aesthetic
- Authentication flows for patients and specialists
- Patient dashboard with analysis history and submission workflow
- Specialist dashboard with patient queue management
- Multi-step analysis submission workflow
- Patient biodata collection
- AI assessment visualization
- Data visualization for specialists

## Technology Stack

- Next.js 15.x with App Router
- React 19.x
- TypeScript
- TailwindCSS
- ShadCN UI
- Zod for form validation
- React Hook Form
- Various Radix UI primitives

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Roadmap

This MVP focuses on the UI structure and flow, aligned with Phase 1 and parts of Phase 2 of the project timeline. Future development will include:

1. Authentication with NextAuth.js
2. Backend API endpoints for data submission and retrieval
3. Database integration with PostgreSQL/Drizzle
4. LLM integration for AI analysis
5. File upload and processing pipeline
6. VitalLens Python integration

## License

This project is private and proprietary.
