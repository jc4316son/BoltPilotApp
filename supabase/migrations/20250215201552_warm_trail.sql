/*
  # Fix storage policies for certificates

  1. Changes
    - Drop all existing certificate storage policies
    - Create simplified policies with proper owner tracking
    - Add explicit owner assignment on upload
*/

-- Drop all existing certificate-related policies
DROP POLICY IF EXISTS "Allow users to manage their certificate images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public access to read certificate images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can manage certificate images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view certificate images" ON storage.objects;

-- Create new simplified policies
CREATE POLICY "certificates_insert_policy"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates'
  AND owner = auth.uid()
);

CREATE POLICY "certificates_select_policy"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');

CREATE POLICY "certificates_update_policy"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'certificates'
  AND owner = auth.uid()
);

CREATE POLICY "certificates_delete_policy"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'certificates'
  AND owner = auth.uid()
);