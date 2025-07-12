import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Grade {
  id: string;
  student_id: string;
  assignment_id?: string;
  class_id: string;
  grade: number;
  max_grade: number;
  date_recorded: string;
  created_at: string;
  subject: string;
  // Joined data
  student_name?: string;
  student_number?: string;
  class_name?: string;
  assignment_title?: string;
}

export interface GradeInput {
  student_id: string;
  assignment_id?: string;
  class_id: string;
  grade: number;
  max_grade: number;
  date_recorded?: string;
  subject: string;
}

export const useGrades = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          ),
          classes!inner(name),
          assignments(title)
        `)
        .order('date_recorded', { ascending: false });

      if (error) throw error;

      return data.map((grade: any) => ({
        ...grade,
        student_name: grade.students.profiles.full_name,
        student_number: grade.students.student_number,
        class_name: grade.classes.name,
        assignment_title: grade.assignments?.title
      })) as Grade[];
    }
  });
};

export const useGradesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: ['grades', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          classes!inner(name),
          assignments(title)
        `)
        .eq('student_id', studentId)
        .order('date_recorded', { ascending: false });

      if (error) throw error;
      return data as Grade[];
    },
    enabled: !!studentId
  });
};

export const useGradesByClass = (classId: string) => {
  return useQuery({
    queryKey: ['grades', 'class', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select(`
          *,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          ),
          assignments(title)
        `)
        .eq('class_id', classId)
        .order('date_recorded', { ascending: false });

      if (error) throw error;

      return data.map((grade: any) => ({
        ...grade,
        student_name: grade.students.profiles.full_name,
        student_number: grade.students.student_number,
        assignment_title: grade.assignments?.title
      })) as Grade[];
    },
    enabled: !!classId
  });
};

export const useCreateGrade = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (gradeData: GradeInput) => {
      const { data, error } = await supabase
        .from('grades')
        .insert([gradeData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast({
        title: 'Grade added successfully',
        description: 'The grade has been recorded.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error adding grade',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateGrade = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, gradeData }: { id: string; gradeData: Partial<GradeInput> }) => {
      const { data, error } = await supabase
        .from('grades')
        .update(gradeData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast({
        title: 'Grade updated successfully',
        description: 'The grade has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating grade',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useDeleteGrade = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('grades')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['grades'] });
      toast({
        title: 'Grade deleted successfully',
        description: 'The grade has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting grade',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};