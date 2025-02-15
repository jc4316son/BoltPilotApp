-- Drop existing policies if they exist
DO $$ 
BEGIN
    -- Pilots policies
    DROP POLICY IF EXISTS "Users can read own pilot profile" ON pilots;
    DROP POLICY IF EXISTS "Users can update own pilot profile" ON pilots;
    
    -- Flights policies
    DROP POLICY IF EXISTS "Users can read own flights" ON flights;
    DROP POLICY IF EXISTS "Users can create own flights" ON flights;
    DROP POLICY IF EXISTS "Users can update own flights" ON flights;
    DROP POLICY IF EXISTS "Users can delete own flights" ON flights;
    
    -- Certifications policies
    DROP POLICY IF EXISTS "Users can read own certifications" ON certifications;
    DROP POLICY IF EXISTS "Users can create own certifications" ON certifications;
    DROP POLICY IF EXISTS "Users can delete own certifications" ON certifications;
    
    -- Availability policies
    DROP POLICY IF EXISTS "Users can read own availability" ON availability;
    DROP POLICY IF EXISTS "Users can create own availability" ON availability;
    DROP POLICY IF EXISTS "Users can update own availability" ON availability;
    DROP POLICY IF EXISTS "Users can delete own availability" ON availability;
EXCEPTION
    WHEN undefined_table THEN 
        NULL;
    WHEN undefined_object THEN 
        NULL;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS pilots (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    total_hours numeric DEFAULT 0,
    reliability numeric DEFAULT 100,
    created_at timestamptz DEFAULT now()
);

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

CREATE TABLE IF NOT EXISTS certifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pilot_id uuid REFERENCES pilots(id) NOT NULL,
    type text NOT NULL,
    number text NOT NULL,
    issue_date date NOT NULL,
    expiry_date date NOT NULL,
    image_url text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS availability (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    pilot_id uuid REFERENCES pilots(id) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_available boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own pilot profile"
    ON pilots FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own pilot profile"
    ON pilots FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can read own flights"
    ON flights FOR SELECT
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own flights"
    ON flights FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = pilot_id);

CREATE POLICY "Users can update own flights"
    ON flights FOR UPDATE
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can delete own flights"
    ON flights FOR DELETE
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can read own certifications"
    ON certifications FOR SELECT
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own certifications"
    ON certifications FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = pilot_id);

CREATE POLICY "Users can delete own certifications"
    ON certifications FOR DELETE
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can read own availability"
    ON availability FOR SELECT
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can create own availability"
    ON availability FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = pilot_id);

CREATE POLICY "Users can update own availability"
    ON availability FOR UPDATE
    TO authenticated
    USING (auth.uid() = pilot_id);

CREATE POLICY "Users can delete own availability"
    ON availability FOR DELETE
    TO authenticated
    USING (auth.uid() = pilot_id);
