/*
  # Initial Schema Setup for PilotHub

  1. New Tables
    - `pilots`
      - `id` (uuid, primary key) - matches auth.users id
      - `name` (text)
      - `email` (text)
      - `total_hours` (numeric)
      - `reliability` (numeric)
      - `created_at` (timestamp)

    - `flights`
      - `id` (uuid, primary key)
      - `pilot_id` (uuid, foreign key)
      - `date` (date)
      - `aircraft_type` (text)
      - `departure_airport` (text)
      - `arrival_airport` (text)
      - `total_time` (numeric)
      - `night_time` (numeric)
      - `instrument_time` (numeric)
      - `is_ifr` (boolean)
      - `remarks` (text)
      - `created_at` (timestamp)

    - `certifications`
      - `id` (uuid, primary key)
      - `pilot_id` (uuid, foreign key)
      - `type` (text)
      - `number` (text)
      - `issue_date` (date)
      - `expiry_date` (date)
      - `created_at` (timestamp)

    - `availability`
      - `id` (uuid, primary key)
      - `pilot_id` (uuid, foreign key)
      - `start_date` (date)
      - `end_date` (date)
      - `is_available` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create their own records
      - Update their own records
*/

-- Create pilots table
CREATE TABLE IF NOT EXISTS pilots (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  total_hours numeric DEFAULT 0,
  reliability numeric DEFAULT 100,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own pilot profile"
  ON pilots FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own pilot profile"
  ON pilots FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id uuid REFERENCES pilots(id) NOT NULL,
  date date NOT NULL,
  aircraft_type text NOT NULL,
  departure_airport text NOT NULL,
  arrival_airport text NOT NULL,
  total_time numeric NOT NULL,
  night_time numeric NOT NULL DEFAULT 0,
  instrument_time numeric NOT NULL DEFAULT 0,
  is_ifr boolean NOT NULL DEFAULT false,
  remarks text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE flights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flights"
  ON flights FOR SELECT
  TO authenticated
  USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own flights"
  ON flights FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pilot_id);

-- Create certifications table
CREATE TABLE IF NOT EXISTS certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id uuid REFERENCES pilots(id) NOT NULL,
  type text NOT NULL,
  number text NOT NULL,
  issue_date date NOT NULL,
  expiry_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own certifications"
  ON certifications FOR SELECT
  TO authenticated
  USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own certifications"
  ON certifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pilot_id);

-- Create availability table
CREATE TABLE IF NOT EXISTS availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id uuid REFERENCES pilots(id) NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own availability"
  ON availability FOR SELECT
  TO authenticated
  USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own availability"
  ON availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = pilot_id);