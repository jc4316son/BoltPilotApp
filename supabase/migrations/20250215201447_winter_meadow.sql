/*
  # Fix storage policies for certificates

  1. Changes
    - Ensure storage.objects has RLS enabled
    - Create certificates bucket if not exists
    - Set up proper policies for authenticated users
*/

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create the certificates bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to ensure clean slate
DROP POLICY IF EXISTS "Allow users to manage their certificate images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to read certificate images" ON storage.objects;

-- Create policy for authenticated users to manage their files
CREATE POLICY "Authenticated users can manage certificate images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- Create policy for public read access
CREATE POLICY "Public can view certificate images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');