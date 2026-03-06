# Data Model: Todo Evolution Phase II

## Phase 1: Data Model Design

### User Entity
- **Fields**:
  - id (UUID/string, primary key)
  - email (string, unique, required)
  - password_hash (string, required)
  - first_name (string, optional)
  - last_name (string, optional)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
  - is_active (boolean, default: true)
- **Validation rules**:
  - Email must be valid format
  - Password must meet security requirements
  - Email must be unique across all users
- **Relationships**:
  - One-to-many with Tasks (user owns many tasks)

### Task Entity
- **Fields**:
  - id (UUID/string, primary key)
  - title (string, required)
  - description (text, optional)
  - status (enum: 'pending', 'in-progress', 'completed', 'archived', default: 'pending')
  - priority (enum: 'low', 'medium', 'high', 'urgent', default: 'medium')
  - due_date (timestamp, optional)
  - created_at (timestamp, required)
  - updated_at (timestamp, required)
  - completed_at (timestamp, optional)
  - user_id (foreign key to User, required)
- **Validation rules**:
  - Title must be 1-255 characters
  - Description must be under 10000 characters
  - Status must be one of allowed values
  - Priority must be one of allowed values
  - Due date must be in the future if provided
  - User_id must reference an existing user
- **State transitions**:
  - pending → in-progress → completed (or archived)
  - completed → pending (to reopen)
  - Any → archived (for soft deletion)

### User Session/Authentication
- **JWT Token Structure**:
  - sub: user_id
  - exp: expiration timestamp
  - iat: issued at timestamp
  - email: user email
- **Validation rules**:
  - Tokens must be signed and verified
  - Expired tokens must be rejected
  - Refresh tokens must follow security best practices