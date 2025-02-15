/*
  # Fix storage policies for certificates

  1. Updates
    - Drop existing policies
    - Create new policies with correct permissions
    - Enable authenticated users to upload and manage their files
    - Allow public read access
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to upload certificate images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to read certificate images" ON storage.objects;

-- Create policy for authenticated users to upload and manage their files
CREATE POLICY "Allow users to manage their certificate images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'certificates')
WITH CHECK (bucket_id = 'certificates');

-- Create policy for public read access
CREATE POLICY "Allow public to read certificate images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');