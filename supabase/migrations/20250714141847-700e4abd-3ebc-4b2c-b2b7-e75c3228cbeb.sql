-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('assignments', 'assignments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('submissions', 'submissions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Create storage policies for avatars (public)
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for assignments (teachers only)
CREATE POLICY "Teachers can upload assignment files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'assignments');

CREATE POLICY "Everyone can view assignment files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'assignments');

CREATE POLICY "Teachers can update assignment files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'assignments');

CREATE POLICY "Teachers can delete assignment files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'assignments');

-- Create storage policies for submissions (students and teachers)
CREATE POLICY "Students can upload their own submissions" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own submissions" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Students can update their own submissions" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'submissions' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for documents (general access)
CREATE POLICY "Users can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Users can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Users can update documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents');

CREATE POLICY "Users can delete documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents');