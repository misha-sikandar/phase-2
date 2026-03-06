# Quickstart Guide: Todo Evolution Phase II

## Development Setup

### Prerequisites
- Node.js 18+ (for Next.js frontend)
- Python 3.9+ (for FastAPI backend)
- PostgreSQL-compatible database (Neon Serverless)
- Git

### Environment Configuration
1. Clone the repository
2. Install dependencies for both frontend and backend
3. Set up environment variables:
   - Database connection string
   - JWT secret for authentication
   - Better Auth configuration

### Running the Application
1. Start the backend server (FastAPI)
2. Start the frontend development server (Next.js)
3. Access the application at http://localhost:3000

## Architecture Overview

### Frontend (Next.js)
- App Router for routing and layout management
- Client-side rendering with server-side rendering where needed
- Integration with Better Auth for authentication
- API calls to backend services

### Backend (FastAPI)
- REST API following the defined contracts
- JWT-based authentication and authorization
- Database operations with user data isolation
- Input validation and error handling

### Database (PostgreSQL)
- User and Task entities as defined in data model
- Proper indexing for performance
- Foreign key constraints for data integrity

## Key Development Patterns

### Authentication Flow
1. User registers/logins through frontend
2. JWT token received and stored securely
3. Token sent with all authenticated requests
4. Backend validates token on each request

### Data Flow
1. Frontend makes API requests to backend
2. Backend validates authentication and authorization
3. Backend performs database operations with user isolation
4. Responses returned to frontend in standardized format