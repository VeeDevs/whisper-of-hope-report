CREATE TABLE notifications (
  id UUID DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_rewards (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  points INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_check_in TIMESTAMPTZ,
  achievements JSONB DEFAULT '[]'::jsonb
);

-- Enable Row Level Security
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own rewards"
  ON user_rewards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own rewards"
  ON user_rewards FOR UPDATE
  USING (auth.uid() = user_id);

-- Create functions for points and achievements
CREATE OR REPLACE FUNCTION award_points(
  user_id UUID,
  points_to_award INTEGER
) RETURNS void AS $$
BEGIN
  INSERT INTO user_rewards (user_id, points)
  VALUES (user_id, points_to_award)
  ON CONFLICT (user_id)
  DO UPDATE SET points = user_rewards.points + points_to_award;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_user_level() RETURNS trigger AS $$
BEGIN
  -- Update level based on points
  IF NEW.points >= 2500 THEN
    NEW.current_level := 5;
  ELSIF NEW.points >= 1000 THEN
    NEW.current_level := 4;
  ELSIF NEW.points >= 500 THEN
    NEW.current_level := 3;
  ELSIF NEW.points >= 100 THEN
    NEW.current_level := 2;
  ELSE
    NEW.current_level := 1;
  END IF;
  
  -- If level changed, create notification
  IF NEW.current_level > OLD.current_level THEN
    INSERT INTO notifications (user_id, type, title, description)
    VALUES (
      NEW.user_id,
      'level_up',
      'Level Up!',
      'Congratulations! You''ve reached level ' || NEW.current_level
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_level_trigger
  BEFORE UPDATE ON user_rewards
  FOR EACH ROW
  WHEN (NEW.points IS DISTINCT FROM OLD.points)
  EXECUTE FUNCTION update_user_level();

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_user_rewards_points ON user_rewards(points);