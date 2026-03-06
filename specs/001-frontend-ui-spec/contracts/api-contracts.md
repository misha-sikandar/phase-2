# API Contracts: Todo Evolution Phase II

## Authentication Endpoints

### POST /api/auth/register
**Purpose**: Register a new user account
**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "first_name": "string (optional)",
  "last_name": "string (optional)"
}
```
**Response**:
- 201 Created: `{ "user_id": "string", "token": "JWT string" }`
- 400 Bad Request: `{ "error": "validation_error", "message": "detailed error message" }`
- 409 Conflict: `{ "error": "duplicate_email", "message": "Email already registered" }`

### POST /api/auth/login
**Purpose**: Authenticate user and return JWT token
**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```
**Response**:
- 200 OK: `{ "user_id": "string", "token": "JWT string" }`
- 400 Bad Request: `{ "error": "invalid_credentials", "message": "Invalid email or password" }`
- 401 Unauthorized: `{ "error": "account_disabled", "message": "Account is disabled" }`

### POST /api/auth/logout
**Purpose**: Invalidate user session
**Headers**: `Authorization: Bearer {token}`
**Response**:
- 200 OK: `{ "message": "Successfully logged out" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`

## User Profile Endpoints

### GET /api/users/me
**Purpose**: Get current user profile
**Headers**: `Authorization: Bearer {token}`
**Response**:
- 200 OK: `{ "id": "string", "email": "string", "first_name": "string", "last_name": "string", "created_at": "timestamp" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`

### PUT /api/users/me
**Purpose**: Update current user profile
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "first_name": "string (optional)",
  "last_name": "string (optional)",
  "email": "string (optional)"
}
```
**Response**:
- 200 OK: `{ "id": "string", "email": "string", "first_name": "string", "last_name": "string", "updated_at": "timestamp" }`
- 400 Bad Request: `{ "error": "validation_error", "message": "detailed error message" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`
- 409 Conflict: `{ "error": "duplicate_email", "message": "Email already exists" }`

## Task Management Endpoints

### GET /api/tasks
**Purpose**: Get all tasks for the authenticated user
**Headers**: `Authorization: Bearer {token}`
**Query Parameters**:
- `status`: filter by status ('pending', 'in-progress', 'completed', 'archived')
- `priority`: filter by priority ('low', 'medium', 'high', 'urgent')
- `limit`: number of results (default: 50, max: 100)
- `offset`: pagination offset (default: 0)
**Response**:
- 200 OK: `{ "tasks": [...], "total": integer, "limit": integer, "offset": integer }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`

### POST /api/tasks
**Purpose**: Create a new task for the authenticated user
**Headers**: `Authorization: Bearer {token}`
**Request Body**:
```json
{
  "title": "string (required, 1-255 chars)",
  "description": "string (optional, max 10000 chars)",
  "status": "enum (optional, default: 'pending')",
  "priority": "enum (optional, default: 'medium')",
  "due_date": "timestamp (optional)"
}
```
**Response**:
- 201 Created: `{ "id": "string", "title": "string", "description": "string", "status": "string", "priority": "string", "due_date": "timestamp", "created_at": "timestamp", "updated_at": "timestamp", "user_id": "string" }`
- 400 Bad Request: `{ "error": "validation_error", "message": "detailed error message" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`

### GET /api/tasks/{id}
**Purpose**: Get a specific task by ID
**Headers**: `Authorization: Bearer {token}`
**Path Parameter**: `id` (task ID)
**Response**:
- 200 OK: `{ "id": "string", "title": "string", "description": "string", "status": "string", "priority": "string", "due_date": "timestamp", "created_at": "timestamp", "updated_at": "timestamp", "completed_at": "timestamp", "user_id": "string" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`
- 404 Not Found: `{ "error": "not_found", "message": "Task not found" }`
- 403 Forbidden: `{ "error": "forbidden", "message": "Access denied - not your task" }`

### PUT /api/tasks/{id}
**Purpose**: Update a specific task by ID
**Headers**: `Authorization: Bearer {token}`
**Path Parameter**: `id` (task ID)
**Request Body**:
```json
{
  "title": "string (optional, 1-255 chars)",
  "description": "string (optional, max 10000 chars)",
  "status": "enum (optional)",
  "priority": "enum (optional)",
  "due_date": "timestamp (optional)",
  "completed_at": "timestamp (optional)"
}
```
**Response**:
- 200 OK: `{ "id": "string", "title": "string", "description": "string", "status": "string", "priority": "string", "due_date": "timestamp", "created_at": "timestamp", "updated_at": "timestamp", "completed_at": "timestamp", "user_id": "string" }`
- 400 Bad Request: `{ "error": "validation_error", "message": "detailed error message" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`
- 404 Not Found: `{ "error": "not_found", "message": "Task not found" }`
- 403 Forbidden: `{ "error": "forbidden", "message": "Access denied - not your task" }`

### DELETE /api/tasks/{id}
**Purpose**: Delete a specific task by ID
**Headers**: `Authorization: Bearer {token}`
**Path Parameter**: `id` (task ID)
**Response**:
- 200 OK: `{ "message": "Task deleted successfully" }`
- 401 Unauthorized: `{ "error": "unauthorized", "message": "Invalid or expired token" }`
- 404 Not Found: `{ "error": "not_found", "message": "Task not found" }`
- 403 Forbidden: `{ "error": "forbidden", "message": "Access denied - not your task" }`

## Error Response Format
All error responses follow this structure:
```json
{
  "error": "error_code",
  "message": "Human-readable error message",
  "timestamp": "ISO 8601 timestamp"
}
```

## Authentication Requirements
All endpoints except `/api/auth/register` and `/api/auth/login` require a valid JWT token in the Authorization header as `Bearer {token}`.