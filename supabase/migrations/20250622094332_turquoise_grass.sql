/*
  # Productivity Game App Database Schema

  1. New Tables
    - `users_profile`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `energy` (integer, default 100)
      - `candy_points` (integer, default 0)
      - `current_streak` (integer, default 0)
      - `longest_streak` (integer, default 0)
      - `last_activity_date` (date)
      - `created_at` (timestamp)

    - `tasks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `description` (text, optional)
      - `category` (text)
      - `energy_reward` (integer)
      - `candy_reward` (integer)
      - `completed` (boolean, default false)
      - `completed_at` (timestamp, optional)
      - `created_at` (timestamp)

    - `custom_actions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `energy_change` (integer)
      - `candy_change` (integer)
      - `duration_minutes` (integer, optional)
      - `created_at` (timestamp)

    - `daily_stats`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `date` (date)
      - `tasks_completed` (integer, default 0)
      - `energy_earned` (integer, default 0)
      - `candy_earned` (integer, default 0)
      - `streak_maintained` (boolean, default false)
      - `mood_rating` (integer, optional)

    - `rewards`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `description` (text, optional)
      - `candy_cost` (integer)
      - `redeemed` (boolean, default false)
      - `redeemed_at` (timestamp, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Users Profile Table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  energy integer DEFAULT 100,
  candy_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_activity_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON users_profile
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  category text DEFAULT 'Personal',
  energy_reward integer DEFAULT 5,
  candy_reward integer DEFAULT 2,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Custom Actions Table
CREATE TABLE IF NOT EXISTS custom_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  energy_change integer DEFAULT 0,
  candy_change integer DEFAULT 0,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE custom_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own custom actions"
  ON custom_actions
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Daily Stats Table
CREATE TABLE IF NOT EXISTS daily_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  date date DEFAULT CURRENT_DATE,
  tasks_completed integer DEFAULT 0,
  energy_earned integer DEFAULT 0,
  candy_earned integer DEFAULT 0,
  streak_maintained boolean DEFAULT false,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5),
  UNIQUE(user_id, date)
);

ALTER TABLE daily_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own daily stats"
  ON daily_stats
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Rewards Table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text DEFAULT '',
  candy_cost integer NOT NULL,
  redeemed boolean DEFAULT false,
  redeemed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own rewards"
  ON rewards
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users_profile (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE OR REPLACE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_user_profile();