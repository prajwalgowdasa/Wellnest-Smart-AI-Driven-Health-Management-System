# HealthLoop Application

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Deployment Instructions

Due to certain TypeScript and build errors, the application should be deployed using the development server for demonstration purposes:

1. Install dependencies:

   ```
   npm install --legacy-peer-deps
   ```

2. Start the application in development mode:

   ```
   npm run dev
   ```

3. Access the application at http://localhost:3000

## Backend Integration

The application is currently set up to work without a backend by using mock data. When you're ready to connect to a real backend:

1. Set the `NEXT_PUBLIC_API_URL` environment variable to point to your backend API
2. Remove or update the mock data generation in the AI insights modules
3. Update the API routes to properly connect to your backend endpoints

## Features

- Health Records Management
- Appointment Scheduling
- AI Health Insights
- Medical History Tracking
- Emergency Contact Management
- User Profile Management
