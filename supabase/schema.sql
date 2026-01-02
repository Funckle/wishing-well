-- Wishing Well Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  total_points INTEGER DEFAULT 0 NOT NULL,
  custom_wish_enabled BOOLEAN DEFAULT FALSE NOT NULL,
  gif_enabled BOOLEAN DEFAULT FALSE NOT NULL,
  custom_wish_warnings INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Wells table
CREATE TABLE wells (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  context TEXT NOT NULL CHECK (char_length(context) <= 500),
  wish_limit INTEGER NOT NULL CHECK (wish_limit > 0),
  wish_count INTEGER DEFAULT 0 NOT NULL,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  average_rating DECIMAL(3,2),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  closed_at TIMESTAMPTZ,
  notification_email TEXT
);

-- Wishes table
CREATE TABLE wishes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  well_id UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  sender_ip INET,
  sentence_starter TEXT NOT NULL,
  descriptors TEXT[] NOT NULL DEFAULT '{}',
  outcome TEXT NOT NULL,
  emojis TEXT[] NOT NULL DEFAULT '{}',
  custom_text TEXT CHECK (custom_text IS NULL OR char_length(custom_text) <= 150),
  gif_url TEXT,
  rating INTEGER CHECK (rating IS NULL OR (rating >= 0 AND rating <= 5)),
  is_viewed BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  rated_at TIMESTAMPTZ
);

-- Cosmetics table
CREATE TABLE cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('badge', 'avatar_frame', 'well_frame')),
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- User cosmetics junction table
CREATE TABLE user_cosmetics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cosmetic_id UUID NOT NULL REFERENCES cosmetics(id) ON DELETE CASCADE,
  is_equipped BOOLEAN DEFAULT FALSE NOT NULL,
  purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, cosmetic_id)
);

-- Rate limiting table
CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address INET NOT NULL,
  wish_count INTEGER DEFAULT 1 NOT NULL,
  window_start TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_wells_short_code ON wells(short_code);
CREATE INDEX idx_wells_is_active ON wells(is_active);
CREATE INDEX idx_wells_user_id ON wells(user_id);
CREATE INDEX idx_wells_expires_at ON wells(expires_at);
CREATE INDEX idx_wishes_well_id ON wishes(well_id);
CREATE INDEX idx_wishes_sender_id ON wishes(sender_id);
CREATE INDEX idx_wishes_is_viewed ON wishes(is_viewed);
CREATE INDEX idx_profiles_total_points ON profiles(total_points DESC);
CREATE INDEX idx_rate_limits_ip ON rate_limits(ip_address);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT
  id,
  username,
  avatar_url,
  total_points,
  ROW_NUMBER() OVER (ORDER BY total_points DESC) as rank
FROM profiles
WHERE username IS NOT NULL
ORDER BY total_points DESC;

-- Function to increment wish count (SECURITY DEFINER allows anonymous users to update wells)
CREATE OR REPLACE FUNCTION increment_wish_count(p_well_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE wells
  SET wish_count = wish_count + 1
  WHERE id = p_well_id;

  -- Check if well should be closed
  UPDATE wells
  SET is_active = FALSE, closed_at = NOW()
  WHERE id = p_well_id AND wish_count >= wish_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update well average rating
CREATE OR REPLACE FUNCTION update_well_rating(p_well_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE wells
  SET average_rating = (
    SELECT AVG(rating)::DECIMAL(3,2)
    FROM wishes
    WHERE well_id = p_well_id AND rating IS NOT NULL
  )
  WHERE id = p_well_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add points to a user
CREATE OR REPLACE FUNCTION add_points(p_user_id UUID, p_points INTEGER)
RETURNS VOID AS $$
DECLARE
  new_total INTEGER;
BEGIN
  UPDATE profiles
  SET total_points = total_points + p_points,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING total_points INTO new_total;

  -- Check for unlock thresholds
  IF new_total >= 50 THEN
    UPDATE profiles SET gif_enabled = TRUE WHERE id = p_user_id AND gif_enabled = FALSE;
  END IF;

  IF new_total >= 100 THEN
    UPDATE profiles SET custom_wish_enabled = TRUE WHERE id = p_user_id AND custom_wish_enabled = FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to check and close expired wells
CREATE OR REPLACE FUNCTION close_expired_wells()
RETURNS VOID AS $$
BEGIN
  UPDATE wells
  SET is_active = FALSE, closed_at = NOW(), is_public = TRUE
  WHERE is_active = TRUE AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, username, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security Policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE wells ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cosmetics ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Wells policies
CREATE POLICY "Active and public wells are viewable by everyone" ON wells
  FOR SELECT USING (is_active = true OR is_public = true);

CREATE POLICY "Users can create wells" ON wells
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Well owners can update their wells" ON wells
  FOR UPDATE USING (auth.uid() = user_id);

-- Wishes policies
CREATE POLICY "Wishes are viewable by well owner or when public" ON wishes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wells
      WHERE wells.id = wishes.well_id
      AND (wells.user_id = auth.uid() OR wells.is_public = true)
    )
  );

CREATE POLICY "Anyone can create wishes" ON wishes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Well owners can update wish ratings" ON wishes
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM wells
      WHERE wells.id = wishes.well_id
      AND wells.user_id = auth.uid()
    )
  );

-- Cosmetics policies
CREATE POLICY "Cosmetics are viewable by everyone" ON cosmetics
  FOR SELECT USING (true);

-- User cosmetics policies
CREATE POLICY "Users can view their own cosmetics" ON user_cosmetics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can purchase cosmetics" ON user_cosmetics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their cosmetics" ON user_cosmetics
  FOR UPDATE USING (auth.uid() = user_id);

-- Rate limits policies (handled server-side)
CREATE POLICY "Rate limits are managed server-side" ON rate_limits
  FOR ALL USING (true);

-- Insert default cosmetics
INSERT INTO cosmetics (name, type, price_cents, image_url) VALUES
  ('Kindness Champion', 'badge', 299, '/cosmetics/badge-kindness.svg'),
  ('Wish Master', 'badge', 499, '/cosmetics/badge-master.svg'),
  ('Golden Frame', 'avatar_frame', 199, '/cosmetics/frame-gold.svg'),
  ('Rainbow Frame', 'avatar_frame', 299, '/cosmetics/frame-rainbow.svg'),
  ('Starry Well', 'well_frame', 399, '/cosmetics/well-starry.svg'),
  ('Crystal Well', 'well_frame', 499, '/cosmetics/well-crystal.svg');
