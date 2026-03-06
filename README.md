# Todo Evolution Frontend

A Next.js frontend todo application with user authentication and task management features.

## Overview

This is a frontend-only todo application built with Next.js, featuring user authentication, dashboard, task management, and profile settings. The application uses a mock API approach for demonstration purposes.

## Tech Stack

- **Frontend**: Next.js (App Router) with TypeScript
- **Styling**: Tailwind CSS (via configuration)
- **Authentication**: Mock authentication service
- **State Management**: React Context API

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── dashboard/
│   │   ├── tasks/
│   │   ├── profile/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── auth/
│   │   ├── tasks/
│   │   ├── layout/
│   │   └── ui/
│   ├── services/
│   │   ├── auth-service.ts
│   │   ├── task-service.ts
│   │   └── api-client.ts
│   ├── context/
│   │   └── auth-context.tsx
│   ├── types/
│   │   └── shared-types.ts
│   └── styles/
├── public/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/
```

## Setup Instructions

1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Visit `http://localhost:3000` in your browser

## Features

- User authentication (login/register)
- Dashboard with task statistics
- Task management (create, read, update, delete)
- Profile management
- Responsive design for mobile, tablet, and desktop
- Mock API implementation for demonstration
- Accessibility compliant (WCAG AA)