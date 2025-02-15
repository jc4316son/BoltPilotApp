/*
  # Create certificates storage bucket

  1. Storage
    - Create a new bucket called "certificates" for storing certificate images
    - Set bucket to public for reading images
  
  2. Security
    - Enable RLS policies for the bucket
    - Allow authenticated users to upload files
    - Allow public access for reading files
*/

-- Create the certificates bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true);

-- Create policy to allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload certificate images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'certificates'
  AND auth.role() = 'authenticated'
);

-- Create policy to allow public access to read certificate images
CREATE POLICY "Allow public access to read certificate images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'certificates');