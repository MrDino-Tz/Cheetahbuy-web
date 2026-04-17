-- Add shop location columns to vendors table (using existing column names)
ALTER TABLE vendors 
ADD COLUMN IF NOT EXISTS shop_latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS shop_longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS shop_address TEXT;

-- Create riders table for rider management
CREATE TABLE IF NOT EXISTS riders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) NOT NULL UNIQUE,
  is_available BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  vehicle_type TEXT DEFAULT 'Motorcycle',
  rating DOUBLE PRECISION DEFAULT 4.5,
  total_deliveries INTEGER DEFAULT 0,
  current_lat DOUBLE PRECISION,
  current_lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add email column to profiles if not exists
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- Enable RLS on riders
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for riders
CREATE POLICY "Anyone can view riders" ON riders FOR SELECT USING (true);
CREATE POLICY "Riders can update own record" ON riders FOR UPDATE USING (auth.uid() = profile_id);
