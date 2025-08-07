# 🚀 Complete Setup Guide

## 🎯 Quick Start (Rate Limiting Issues)

If you're encountering Supabase rate limiting errors, here's the fastest way to test the application:

### Option 1: Use Test Endpoints (Recommended for Development)
1. Start the FastAPI backend: `python main.py`
2. Navigate to http://localhost:8000/docs
3. Use the **🧪 Test Endpoints** section:
   - `POST /test/register-mock` - Mock registration (no rate limits)
   - `POST /test/login-mock` - Mock login (accepts any credentials)
   - `GET /test/supabase-status` - Check Supabase status

### Option 2: Frontend with Auto-Fallback
1. Start backend: `python main.py`
2. Start frontend: `cd frontend && npm install && npm run dev`
3. Visit http://localhost:3000
4. Register/login normally - it will automatically use test endpoints if rate limited

## 📋 Full Setup Instructions

### 1. Backend Setup (FastAPI + Supabase)

#### Prerequisites
- Python 3.8+
- Supabase account

#### Steps
1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup Supabase:**
   - Create project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Copy `env.example` to `.env`
   - Add your Supabase credentials:
     ```env
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_KEY=your-anon-key
     SECRET_KEY=your-jwt-secret
     ```

3. **Setup database:**
   ```bash
   # Option A: Automatic (if no rate limiting)
   python run_migrations.py
   
   # Option B: Manual in Supabase Dashboard
   # Go to SQL Editor and run database/migrations.sql
   
   # Option C: Test without database
   # Just use the test endpoints
   ```

4. **Start backend:**
   ```bash
   python main.py
   ```
   Backend runs on http://localhost:8000

### 2. Frontend Setup (Next.js + React Query)

#### Prerequisites
- Node.js 18+
- Backend running on http://localhost:8000

#### Steps
1. **Navigate to frontend:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment:**
   ```bash
   cp env.example .env.local
   ```
   Edit `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

4. **Start frontend:**
   ```bash
   npm run dev
   ```
   Frontend runs on http://localhost:3000

## 🔧 Troubleshooting Rate Limiting

### Supabase Rate Limiting
Supabase free tier has these limits:
- **Authentication**: 60 seconds between requests from same IP
- **Database**: 2 requests per second

### Solutions

#### 1. Use Test/Mock Endpoints
```bash
# Backend provides test endpoints that bypass Supabase:
POST /test/register-mock  # Mock registration
POST /test/login-mock    # Mock login (any credentials work)
GET /test/supabase-status # Check status
```

#### 2. Wait Between Requests
- Wait 60+ seconds between real registration attempts
- Use different email addresses for testing

#### 3. Frontend Auto-Fallback
The frontend automatically detects rate limiting and switches to test endpoints:
```typescript
// Automatic fallback in useAuth.ts
if (error.status === 429) {
  console.warn('Rate limited, using mock endpoint');
  return apiClient.post('/test/register-mock', credentials);
}
```

#### 4. Check Supabase Dashboard
- Visit your Supabase project dashboard
- Check "API" settings for rate limit info
- Consider upgrading plan for higher limits

## 🎮 Testing the Application

### 1. Backend API Testing
```bash
# Test health
curl http://localhost:8000/health

# Test registration (might hit rate limit)
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'

# Test mock registration (no rate limits)
curl -X POST http://localhost:8000/test/register-mock \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
```

### 2. Frontend Testing
1. Visit http://localhost:3000
2. Try registering with any email/password
3. If rate limited, the app automatically switches to test mode
4. Login with the same or any other credentials
5. Access dashboard and profile pages

### 3. Swagger UI Testing
1. Visit http://localhost:8000/docs
2. Try endpoints in this order:
   - `GET /health` - Check if server is running
   - `GET /test/supabase-status` - Check Supabase status
   - `POST /test/register-mock` - Test registration
   - Copy the `access_token` from response
   - Click 🔒 **Authorize** and enter: `Bearer YOUR_TOKEN`
   - Test protected endpoints like `GET /protected/dashboard`

## 🔍 Common Issues & Solutions

### Issue: "Registration failed: For security purposes..."
**Solution:** This is Supabase rate limiting. Use test endpoints:
- Backend: Use `/test/register-mock` instead of `/auth/register`
- Frontend: Will automatically fallback to test endpoint

### Issue: "Could not find the table 'profiles'"
**Solution:** Database not set up. Either:
- Run `python run_migrations.py`
- Manually execute `database/migrations.sql` in Supabase SQL Editor
- Use test endpoints (don't require database)

### Issue: "CORS errors" in browser
**Solution:** Make sure backend is running and CORS is properly configured (already done in the code)

### Issue: Frontend 404 errors
**Solution:** Make sure you're in the `frontend` directory and ran `npm install`

## 🚀 Production Deployment

### Backend (FastAPI)
1. Set `DEBUG=False` in environment
2. Use production Supabase instance
3. Set strong `SECRET_KEY`
4. Deploy to Heroku, Railway, or similar

### Frontend (Next.js)
1. Set `NEXT_PUBLIC_API_URL` to production backend URL
2. Run `npm run build`
3. Deploy to Vercel, Netlify, or similar

### Environment Variables for Production
```env
# Backend
SUPABASE_URL=https://your-prod-project.supabase.co
SUPABASE_KEY=your-prod-anon-key
SECRET_KEY=super-secure-production-key
DEBUG=False

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend.herokuapp.com
```

## 📚 API Documentation

### Authentication Flow
1. **Register**: `POST /auth/register` or `POST /test/register-mock`
2. **Login**: `POST /auth/login` or `POST /test/login-mock`
3. **Get User**: `GET /auth/me` (requires token)
4. **Protected Data**: `GET /protected/*` (requires token)

### Key Features
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ Protected Routes
- ✅ Rate Limit Handling
- ✅ Mock/Test Endpoints
- ✅ Error Handling
- ✅ CORS Support
- ✅ Swagger Documentation

## 🛟 Getting Help

1. **Check logs** - Backend prints detailed error messages
2. **Use Swagger UI** - http://localhost:8000/docs for interactive testing
3. **Check browser console** - Frontend logs all API calls
4. **Use test endpoints** - When in doubt, use `/test/*` endpoints
5. **Supabase Dashboard** - Check your project status and limits

---

**🎉 You're all set! The application handles rate limiting automatically and provides test endpoints for seamless development.**