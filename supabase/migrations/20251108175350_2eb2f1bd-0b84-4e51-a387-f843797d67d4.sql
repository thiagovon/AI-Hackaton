-- Create storage bucket for question images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'question-images',
  'question-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
);

-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload question images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'question-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own images
CREATE POLICY "Users can view their own question images"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'question-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to all question images (for displaying questions)
CREATE POLICY "Anyone can view question images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'question-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own question images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'question-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own question images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'question-images' AND
  auth.uid()::text = (storage.foldername(name))[1]
);