-- Add image_url column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'certifications' 
        AND column_name = 'image_url'
    ) THEN
        ALTER TABLE certifications ADD COLUMN image_url text;
    END IF;
END $$;

-- Force PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
