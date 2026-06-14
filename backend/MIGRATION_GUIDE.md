# PostgreSQL Migration Setup Guide

## ✅ Migration Complete

All backend files have been successfully migrated from MongoDB/Mongoose to PostgreSQL. The frontend requires **zero changes**.

---

## 🔧 Setup Instructions

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This will install `pg` (PostgreSQL driver) and remove Mongoose/MongoDB dependencies.

---

### Step 2: Create Supabase Project

**Option A: Using Supabase.com (Recommended)**
1. Go to https://supabase.com
2. Sign up/Log in
3. Create a new project
4. Wait for the database to initialize
5. Copy your connection details:
   - **Project URL**: Found in Settings > API
   - **Database Password**: Set during project creation
   - **Service Role Key**: Found in Settings > API > service_role

**Option B: Local PostgreSQL (Development)**
1. Install PostgreSQL locally
2. Create a database: `createdb task-manager`

---

### Step 3: Set Environment Variables

Create a `.env` file in the `backend` folder:

```env
NODE_ENV=development
PORT=5000

# For Supabase (Production/Testing)
DATABASE_URL=postgresql://postgres:[PASSWORD]@[SUPABASE_HOST]:5432/postgres

# For Local PostgreSQL (Development)
# DATABASE_URL=postgresql://postgres:password@localhost:5432/task-manager

JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

**Get DATABASE_URL from Supabase:**
- Go to Settings > Database > Connection Strings
- Copy the "Connection String" (URI format)
- Replace `[password]` with your database password

---

### Step 4: Create Database Schema

You have two options:

**Option A: Using Supabase SQL Editor (Easy)**
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Click "New Query"
4. Copy all content from `backend/schema.sql`
5. Paste into the SQL editor
6. Click "Run"

**Option B: Using Terminal (psql)**
```bash
cd backend
psql -U postgres -h localhost -d task-manager -f schema.sql
```

Or for Supabase:
```bash
psql "postgresql://postgres:[password]@[host]:5432/postgres" -f schema.sql
```

---

### Step 5: Start the Backend Server

```bash
npm run dev
# or
npm start
```

You should see:
```
PostgreSQL Connected
Server running on port 5000
```

---

## 🧪 Testing the Migration

### Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-06-14T10:30:00Z",
  "updated_at": "2026-06-14T10:30:00Z"
}
```

### Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Expected Response:**
```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Test Create Task (Requires Token)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Buy groceries","description":"Milk, eggs, bread","priority":"high","dueDate":"2026-06-20"}'
```

### Test Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔄 How the Migration Maintains Frontend Compatibility

### ID Field Mapping
```
Database Column Name    →    API Response Field
     id (UUID)          →         _id
    user_id            →         user
    due_date           →        dueDate
    created_at         →        createdAt
    updated_at         →        updatedAt
    priority           →        priority
```

### Example Response Transformation
**Database Store:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "user_id": "660e8400-e29b-41d4-a716-446655440000",
  "due_date": "2026-06-20T00:00:00Z",
  "created_at": "2026-06-14T10:30:00Z"
}
```

**API Response:**
```json
{
  "_id": "550e8400-e29b-41d4-a716-446655440000",
  "user": "660e8400-e29b-41d4-a716-446655440000",
  "dueDate": "2026-06-20T00:00:00Z",
  "createdAt": "2026-06-14T10:30:00Z"
}
```

✅ **Frontend continues to work without any changes!**

---

## 📊 Database Schema Overview

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- bcryptjs hashed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  due_date TIMESTAMP,
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  completed BOOLEAN DEFAULT false,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
```

---

## 📝 Key Changes Summary

### Backend Files Modified
- ✅ `package.json` - Replaced Mongoose with `pg`
- ✅ `server.js` - PostgreSQL connection instead of Mongoose
- ✅ `db.js` - NEW: Database connection pool and query helper
- ✅ `models/User.js` - SQL query functions instead of Mongoose schema
- ✅ `models/Task.js` - SQL query functions instead of Mongoose schema
- ✅ `middleware/authMiddleware.js` - Uses new User.findById()
- ✅ `routes/authRoots.js` - Uses new User model functions
- ✅ `routes/taskRoutes.js` - Uses new Task model functions
- ✅ `schema.sql` - NEW: PostgreSQL schema and indexes
- ✅ `.env.example` - NEW: Environment variables template

### Frontend Files Modified
- ✅ **NONE** - Frontend requires zero changes!

---

## 🚀 Performance Considerations

### Advantages of PostgreSQL over MongoDB
1. **Better Relational Queries**: FK constraints prevent orphaned tasks
2. **ACID Guarantees**: Full transaction support
3. **Indexed Lookups**: Tasks indexed by user_id and completed status
4. **Smaller Payload**: No _id ObjectId serialization overhead

### Connection Pooling
The `db.js` file uses a connection pool for better performance:
- Reuses connections instead of creating new ones
- Automatically handles connection errors
- Graceful cleanup on shutdown

---

## 🔒 Security Notes

1. **JWT Secret**: Change in production (`process.env.JWT_SECRET`)
2. **Database Password**: Never commit `.env` file
3. **Supabase RLS**: Policies are pre-configured but can be customized
4. **Password Hashing**: Continues using bcryptjs (same as before)

---

## ❓ Troubleshooting

### "DATABASE_URL not set"
- Ensure `.env` file exists in `backend/` folder
- Verify DATABASE_URL is correctly formatted

### "PostgreSQL connection failed"
- Check database credentials
- Verify database server is running
- For Supabase: Verify you've whitelisted your IP

### "Duplicate key value violates unique constraint"
- User with that email already exists
- Clear the users table if starting fresh:
  ```sql
  TRUNCATE users CASCADE;
  ```

### "User not found" after login
- Ensure schema.sql was executed successfully
- Check that user was created in database:
  ```sql
  SELECT * FROM users WHERE email = 'your-email@example.com';
  ```

---

## ✨ Next Steps

1. ✅ Complete: Backend migration
2. 🎯 Frontend: No changes needed! Keep using same API
3. 🧪 Test all endpoints manually or with Postman
4. 📱 Deploy backend to hosting (Render, Heroku, Railway, etc.)
5. 🚀 Deploy frontend pointing to backend URL

---

**Migration complete! Your Task Manager now uses PostgreSQL through Supabase.** 🎉
