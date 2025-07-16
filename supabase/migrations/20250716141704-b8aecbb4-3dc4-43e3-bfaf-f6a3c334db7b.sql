-- Enable RLS on submissions table
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for submissions
CREATE POLICY "Students can create their own submissions" 
ON public.submissions 
FOR INSERT 
WITH CHECK (
  public.get_current_user_role() = 'student' 
  AND student_id = auth.uid()::text
);

CREATE POLICY "Students can view their own submissions" 
ON public.submissions 
FOR SELECT 
USING (
  public.get_current_user_role() = 'student' 
  AND student_id = auth.uid()::text
);

CREATE POLICY "Students can update their own submissions" 
ON public.submissions 
FOR UPDATE 
USING (
  public.get_current_user_role() = 'student' 
  AND student_id = auth.uid()::text
);

CREATE POLICY "Teachers can view all submissions" 
ON public.submissions 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('teacher', 'admin', 'principal')
);

CREATE POLICY "Teachers can update submissions for grading" 
ON public.submissions 
FOR UPDATE 
USING (
  public.get_current_user_role() IN ('teacher', 'admin', 'principal')
);

CREATE POLICY "Admins can manage all submissions" 
ON public.submissions 
FOR ALL 
USING (
  public.get_current_user_role() IN ('admin', 'principal')
);