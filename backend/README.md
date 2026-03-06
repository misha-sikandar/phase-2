# Todo Evolution Backend

FastAPI backend with SQLModel and NeonDB for the Todo Evolution application.

## Tech Stack

- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: NeonDB (PostgreSQL)
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup Environment Variables

Edit the `.env` file with your configuration:

```env
# Get this from Neon.tech dashboard
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Generate a secure key:
# python -c "from secrets import token_urlsafe; print(token_urlsafe(32))"
SECRET_KEY=your-secret-key-here

ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
```

### 4. Get NeonDB Connection String

1. Go to https://neon.tech
2. Sign in to your account
3. Select your project
4. Copy the connection string from the dashboard
5. Paste it in `.env` file as `DATABASE_URL`

### 5. Run the Server

```bash
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## API Endpoints

### Authentication
- `POST /v1/auth/signup` - Register new user
- `POST /v1/auth/login` - Login user
- `GET /v1/auth/me` - Get current user
- `PUT /v1/auth/me` - Update user profile

### Todos
- `GET /v1/todos/` - Get all todos
- `POST /v1/todos/` - Create todo
- `GET /v1/todos/{id}` - Get specific todo
- `PUT /v1/todos/{id}` - Update todo
- `DELETE /v1/todos/{id}` - Delete todo

### Utility
- `GET /health` - Health check
- `GET /` - API info

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── src/
│   ├── main.py              # App entry point
│   ├── config/
│   │   ├── settings.py      # Environment settings
│   │   └── database.py      # Database connection
│   ├── models/
│   │   ├── user.py          # User model
│   │   └── todo.py          # Todo model
│   ├── api/
│   │   └── v1/
│   │       ├── auth.py      # Auth endpoints
│   │       └── todos.py     # Todo endpoints
│   ├── schemas/
│   │   ├── auth.py          # Auth schemas
│   │   └── todo.py          # Todo schemas
│   └── utils/
│       ├── security.py      # Password hashing
│       └── jwt.py           # JWT utilities
├── .env                     # Environment variables (create from .env.example)
├── .env.example             # Example environment file
├── requirements.txt         # Python dependencies
└── README.md
```

## Development

### Run with Auto-Reload

```bash
uvicorn src.main:app --reload
```

### Run in Production

```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Test API

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Database

The application uses **NeonDB** (serverless PostgreSQL). Tables are created automatically on startup.

### Connection String Format

```
postgresql://username:password@host-name.region.aws.neon.tech/database_name?sslmode=require
```

**Important**: Always include `?sslmode=require` for NeonDB connections.

## Security Notes

- Never commit `.env` file to version control
- Use strong passwords
- Rotate `SECRET_KEY` periodically
- Enable HTTPS in production
- Set `DEBUG=False` in production

## License

MIT
