/*
  # Update pilots table RLS policies

  1. Changes
    - Add policy to allow inserting pilot records during signup
    - Update existing policies to be more specific

  2. Security
    - Maintain RLS on pilots table
    - Allow authenticated users to read/update their own data
    - Allow inserting new pilot records during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own pilot profile" ON pilots;
DROP POLICY IF EXISTS "Users can update own pilot profile" ON pilots;

-- Create policy for inserting new pilot records
CREATE POLICY "Allow pilot creation during signup"
ON pilots
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = id
  AND (
    SELECT COUNT(*)
    FROM pilots
    WHERE id = auth.uid()
  ) = 0
);

-- Create policy for reading own pilot profile
CREATE POLICY "Users can read own pilot profile"
ON pilots
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create policy for updating own pilot profile
CREATE POLICY "Users can update own pilot profile"
ON pilots
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);