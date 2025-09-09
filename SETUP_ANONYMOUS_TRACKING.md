# 🔧 Setup Anonymous User Tracking

## 🚨 **URGENT: Run This SQL in Supabase Dashboard**

You need to create the missing database tables for anonymous user tracking to work.

### **Step 1: Go to Supabase Dashboard**
1. Visit: https://supabase.com/dashboard
2. Select your project: `gjpaeyimzwmooiansfrp`
3. Go to **SQL Editor** (left sidebar)

### **Step 2: Run the SQL Schema**
Copy and paste this SQL code into the SQL Editor and click **Run**:

```sql
-- Anonymous Usage Tracking Table
CREATE TABLE IF NOT EXISTS anonymous_usage (
  session_id VARCHAR(255) PRIMARY KEY,
  ip_address VARCHAR(45) NOT NULL,
  fingerprint VARCHAR(64) NOT NULL,
  downloads_used INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  invoice_id VARCHAR(255),
  amount DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_ip ON anonymous_usage(ip_address);
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_fingerprint ON anonymous_usage(fingerprint);
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_last_activity ON anonymous_usage(last_activity);

-- Enable Row Level Security
ALTER TABLE anonymous_usage ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous usage (allow all operations for now)
CREATE POLICY "Allow all operations on anonymous_usage" ON anonymous_usage
  FOR ALL USING (true);

-- Update the updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for anonymous_usage
CREATE TRIGGER update_anonymous_usage_updated_at 
  BEFORE UPDATE ON anonymous_usage 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- User Activity Table (if not exists)
CREATE TABLE IF NOT EXISTS user_activity (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  invoice_id VARCHAR(255),
  amount DECIMAL(10,2),
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for user_activity
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_action ON user_activity(action);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);

-- Enable Row Level Security for user_activity
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Create policy for user_activity
CREATE POLICY "Allow all operations on user_activity" ON user_activity
  FOR ALL USING (true);

-- Profiles Table (if not exists)
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY,
  name VARCHAR(255),
  company_name VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip_code VARCHAR(20),
  country VARCHAR(100),
  website VARCHAR(255),
  free_downloads_used INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_premium ON profiles(is_premium);

-- Enable Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for profiles (users can only access their own profile)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### **Step 3: Verify Tables Created**
After running the SQL, go to **Table Editor** and verify these tables exist:
- ✅ `anonymous_usage`
- ✅ `user_activity` 
- ✅ `profiles`

### **Step 4: Test Your App**
Once the tables are created, your app will work with:
- ✅ **Anonymous user tracking** (IP + fingerprinting)
- ✅ **Authenticated user tracking** (database profiles)
- ✅ **Download limits** (1 for guests, 2 for users)
- ✅ **Abuse prevention** (can't reset limits)

## 🎯 **What This Fixes:**
- ❌ **Before**: Anonymous users could abuse the system
- ✅ **After**: Anonymous users tracked by IP + browser fingerprint
- ❌ **Before**: No persistent download tracking
- ✅ **After**: All downloads tracked in database
- ❌ **Before**: Users could reset limits by refreshing
- ✅ **After**: Limits persist across sessions

## 🚀 **After Setup:**
Your app will have bulletproof anonymous user tracking that prevents abuse while encouraging account creation for better features!

