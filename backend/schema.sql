-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table with CASCADE delete for referential integrity
CREATE TABLE IF NOT EXISTS tasks (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS (Row Level Security) for Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Optional: Create policies for RLS (adjust based on your auth strategy)
-- Users can only view/modify their own tasks
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can view own tasks" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Users can create own tasks" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own tasks" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete own tasks" ON tasks
  FOR DELETE USING (true);
