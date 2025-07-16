-- Enable Row Level Security on grades table
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user's role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create security definer function to check if user is parent of student
CREATE OR REPLACE FUNCTION public.is_parent_of_student(student_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.students 
    WHERE id = student_uuid AND parent_id = auth.uid()
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Grades policies
CREATE POLICY "Students can view their own grades" 
ON public.grades 
FOR SELECT 
USING (
  public.get_current_user_role() = 'student' 
  AND student_id = auth.uid()
);

CREATE POLICY "Parents can view their children's grades" 
ON public.grades 
FOR SELECT 
USING (
  public.get_current_user_role() = 'parent' 
  AND public.is_parent_of_student(student_id)
);

CREATE POLICY "Teachers and admins can view all grades" 
ON public.grades 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('teacher', 'admin', 'principal')
);

CREATE POLICY "Teachers and admins can manage grades" 
ON public.grades 
FOR ALL 
USING (
  public.get_current_user_role() IN ('teacher', 'admin', 'principal')
);

-- Enable Row Level Security on fees table
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Fees policies
CREATE POLICY "Parents can view their children's fees" 
ON public.fees 
FOR SELECT 
USING (
  public.get_current_user_role() = 'parent' 
  AND parent_id = auth.uid()::text
);

CREATE POLICY "Students can view their own fees" 
ON public.fees 
FOR SELECT 
USING (
  public.get_current_user_role() = 'student' 
  AND student_id = auth.uid()::text
);

CREATE POLICY "Admins can manage all fees" 
ON public.fees 
FOR ALL 
USING (
  public.get_current_user_role() IN ('admin', 'principal')
);

-- Enable Row Level Security on students table
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Students can view their own profile" 
ON public.students 
FOR SELECT 
USING (
  public.get_current_user_role() = 'student' 
  AND id = auth.uid()
);

CREATE POLICY "Parents can view their children's profiles" 
ON public.students 
FOR SELECT 
USING (
  public.get_current_user_role() = 'parent' 
  AND parent_id = auth.uid()
);

CREATE POLICY "Teachers and admins can view all students" 
ON public.students 
FOR SELECT 
USING (
  public.get_current_user_role() IN ('teacher', 'admin', 'principal')
);

CREATE POLICY "Admins can manage students" 
ON public.students 
FOR ALL 
USING (
  public.get_current_user_role() IN ('admin', 'principal')
);