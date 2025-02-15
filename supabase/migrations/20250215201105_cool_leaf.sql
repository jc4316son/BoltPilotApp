/*
  # Update storage policies for certificates

  1. Changes
    - Enable RLS on storage.objects
    - Create certificates bucket if not exists
    - Update policies with owner checks
*/

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create the certificates bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('certificates', 'certificates', true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Drop and recreate the management policy with owner checks
DROP POLICY IF EXISTS "Allow users to manage their certificate images" ON storage.objects;
CREATE POLICY "Allow users to manage their certificate images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'certificates' AND (auth.uid() = owner OR owner IS NULL))
WITH CHECK (bucket_id = 'certificates' AND (auth.uid() = owner OR owner IS NULL));

-- Update the existing read policy instead of creating a new one
DROP POLICY IF EXISTS "Allow public access to read certificate images" ON storage.objects;
CREATE POLICY "Allow public access to read certificate images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');