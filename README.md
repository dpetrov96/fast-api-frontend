# FastAPI Authentication with Supabase

A complete authentication system built with FastAPI and Supabase, featuring user registration, login, JWT tokens, and protected routes.

## Features

- **User Registration & Login**: Secure user authentication with Supabase Auth
- **JWT Token Authentication**: Stateless authentication using JSON Web Tokens
- **Protected Routes**: Role-based access control for sensitive endpoints
- **Password Hashing**: Secure password storage using bcrypt
- **Email Validation**: Built-in email format validation
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **Automatic Documentation**: Interactive API docs with Swagger UI

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **Supabase**: Backend-as-a-Service with authentication and database
- **JWT**: JSON Web Tokens for stateless authentication
- **Pydantic**: Data validation and serialization
- **Uvicorn**: ASGI server for running the application

## Project Structure

```
fast-api/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application setup
│   ├── config.py            # Configuration settings
│   ├── models.py            # Pydantic models
│   ├── auth_service.py      # Authentication logic
│   ├── dependencies.py      # FastAPI dependencies
│   └── routers/
│       ├── __init__.py
│       ├── auth.py          # Authentication routes
│       └── protected.py     # Protected routes
├── main.py                  # Application entry point
├── requirements.txt         # Python dependencies
├── env.example             # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### 1. Prerequisites

- Python 3.8+
- Supabase account (free tier available)

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. In the SQL editor, create a profiles table:

```sql
-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to access their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);
```

### 3. Local Setup

1. **Clone and navigate to the project:**
   ```bash
   cd /path/to/your/fast-api
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Supabase credentials:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your-anon-key
   DATABASE_URL=postgresql://postgres:[password]@db.xyz.supabase.co:5432/postgres
   SECRET_KEY=your-super-secret-jwt-key-here
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   DEBUG=True
   ```

5. **Run database migrations:**
   
   **Option A: Automatic (Recommended)**
   ```bash
   python run_migrations.py
   ```
   
   **Option B: Manual in Supabase Dashboard**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `database/migrations.sql`
   - Click "Run" to execute
   
   **Option C: Interactive setup**
   ```bash
   python setup_supabase.py
   ```

6. **Run the application:**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:

- **Interactive API docs**: http://localhost:8000/docs
- **ReDoc documentation**: http://localhost:8000/redoc
- **API endpoints overview**: http://localhost:8000

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login with email/password | No |
| GET | `/auth/me` | Get current user info | Yes |
| POST | `/auth/refresh` | Refresh access token | Yes |

### Protected Routes

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | `/protected/profile` | Get user profile | Yes |
| GET | `/protected/dashboard` | Get user dashboard | Yes |
| GET | `/protected/admin-only` | Admin-only endpoint | Yes |

## Usage Examples

### 1. Register a New User

```bash
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword123",
       "full_name": "John Doe"
     }'
```

### 2. Login

```bash
curl -X POST "http://localhost:8000/auth/login" \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "securepassword123"
     }'
```

### 3. Access Protected Route

```bash
curl -X GET "http://localhost:8000/protected/profile" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Examples

### Successful Registration/Login Response

```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "token": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

### Protected Route Response

```json
{
  "message": "Welcome to your dashboard, John Doe!",
  "user_id": "123e4567-e89b-12d3-a456-426614174000",
  "features": [
    "View Profile",
    "Update Settings",
    "Manage Account",
    "Access Premium Content"
  ]
}
```

## Security Features

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Tokens**: Stateless authentication with configurable expiration
- **Input Validation**: Pydantic models ensure data integrity
- **CORS Protection**: Configurable cross-origin access control
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Running in Development Mode

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Running Tests

```bash
pytest  # Add tests in tests/ directory
```

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in production:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=False
```

### Docker Deployment (Optional)

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Check the API documentation at `/docs`
- Review the Supabase documentation
- Create an issue in the repository

---

**Note**: This is a sample authentication system for learning purposes. For production use, consider additional security measures such as rate limiting, account lockouts, and enhanced error handling.