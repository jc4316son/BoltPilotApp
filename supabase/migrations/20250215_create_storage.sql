-- Create storage bucket for certificates if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files to the certificates bucket
CREATE POLICY "Users can upload certificate images"
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'certificates');

-- Allow public access to read certificate images
CREATE POLICY "Anyone can view certificate images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'certificates');
