-- Add type column to resumes table to distinguish between uploaded and created resumes
ALTER TABLE public.resumes 
ADD COLUMN type text NOT NULL DEFAULT 'created' 
CHECK (type IN ('uploaded', 'created'));

-- Optionally, update existing resumes to 'created' type (run this if needed after migration)
-- UPDATE public.resumes SET type = 'created' WHERE type IS NULL;
