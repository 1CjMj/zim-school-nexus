
-- Drop existing policies if they exist before recreating them
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create profiles table that syncs with auth.users (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  email text NOT NULL,
  full_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url text,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert demo users into profiles table (these will be referenced by the demo accounts)
INSERT INTO public.profiles (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@educ8.zw', 'Tendai Mukamuri', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'teacher@educ8.zw', 'Mrs. Chipo Mutendi', 'teacher'),
  ('33333333-3333-3333-3333-333333333333', 'student@educ8.zw', 'Tatenda Moyo', 'student'),
  ('44444444-4444-4444-4444-444444444444', 'parent@educ8.zw', 'Mr. James Moyo', 'parent'),
  ('55555555-5555-5555-5555-555555555555', 'bursar@educ8.zw', 'Mrs. Grace Sibanda', 'admin')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- Create additional tables for demo data

-- Classes table
CREATE TABLE IF NOT EXISTS public.classes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  grade_level text NOT NULL,
  teacher_id uuid REFERENCES public.profiles(id),
  subject text,
  created_at timestamp with time zone DEFAULT now()
);

-- Students table (extends profiles)
CREATE TABLE IF NOT EXISTS public.students (
  id uuid REFERENCES public.profiles(id) PRIMARY KEY,
  class_id uuid REFERENCES public.classes(id),
  student_number text UNIQUE,
  date_of_birth date,
  address text,
  parent_id uuid REFERENCES public.profiles(id)
);

-- Attendance table
CREATE TABLE IF NOT EXISTS public.attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  class_id uuid REFERENCES public.classes(id) NOT NULL,
  date date NOT NULL,
  status text CHECK (status IN ('present', 'absent', 'late', 'excused')) DEFAULT 'present',
  created_at timestamp with time zone DEFAULT now()
);

-- Grades table
CREATE TABLE IF NOT EXISTS public.grades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) NOT NULL,
  assignment_id uuid REFERENCES public.assignments(id),
  class_id uuid REFERENCES public.classes(id) NOT NULL,
  subject text NOT NULL,
  grade numeric(5,2),
  max_grade numeric(5,2) DEFAULT 100,
  date_recorded date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id uuid REFERENCES public.profiles(id) NOT NULL,
  recipient_id uuid REFERENCES public.profiles(id) NOT NULL,
  subject text NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Insert demo data
INSERT INTO public.classes (id, name, grade_level, teacher_id, subject) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Form 4A', 'Form 4', '22222222-2222-2222-2222-222222222222', 'Mathematics'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Form 4B', 'Form 4', '22222222-2222-2222-2222-222222222222', 'Physics'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Form 3A', 'Form 3', '22222222-2222-2222-2222-222222222222', 'Mathematics')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.students (id, class_id, student_number, parent_id) VALUES
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'STU2024001', '44444444-4444-4444-4444-444444444444')
ON CONFLICT (id) DO NOTHING;

-- Sample assignments
INSERT INTO public.assignments (id, title, description, class_id, teacher_id, type, due_date, points) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Algebra Test', 'Test covering chapters 1-3 of algebra', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'test', '2024-12-20', 100),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Physics Lab Report', 'Newton''s Laws experiment report', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'assignment', '2024-12-25', 50)
ON CONFLICT (id) DO NOTHING;

-- Sample grades
INSERT INTO public.grades (student_id, class_id, subject, grade, assignment_id) VALUES
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Mathematics', 87.5, 'dddddddd-dddd-dddd-dddd-dddddddddddd'),
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Physics', 92.0, 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee')
ON CONFLICT (id) DO NOTHING;

-- Sample attendance records
INSERT INTO public.attendance (student_id, class_id, date, status) VALUES
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-12-09', 'present'),
  ('33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '2024-12-08', 'present'),
  ('33333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '2024-12-09', 'late')
ON CONFLICT (id) DO NOTHING;

-- Sample messages
INSERT INTO public.messages (sender_id, recipient_id, subject, content) VALUES
  ('22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'Tatenda''s Progress Update', 'Tatenda is doing excellent work in Mathematics. Keep up the good work!'),
  ('22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'Assignment Reminder', 'Don''t forget your Physics lab report is due next week.')
ON CONFLICT (id) DO NOTHING;
