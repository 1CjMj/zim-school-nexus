import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  student_number?: string;
  address?: string;
  date_of_birth?: string;
  class_id?: string;
  parent_id?: string;
  avatar_url?: string;
  class_name?: string;
  parent_name?: string;
  created_at: string;
}

export interface CreateStudentData {
  full_name: string;
  email: string;
  phone?: string;
  student_number?: string;
  address?: string;
  date_of_birth?: string;
  class_id?: string;
  parent_id?: string;
  avatar_url?: string;
}

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles!students_id_fkey (
            id,
            full_name,
            email,
            phone,
            avatar_url,
            created_at
          ),
          classes (
            id,
            name
          ),
          parent:profiles!students_parent_id_fkey (
            id,
            full_name
          )
        `);

      if (error) throw error;

      return data?.map(student => ({
        id: student.id,
        full_name: student.profiles?.full_name || '',
        email: student.profiles?.email || '',
        phone: student.profiles?.phone || '',
        avatar_url: student.profiles?.avatar_url || '',
        student_number: student.student_number || '',
        address: student.address || '',
        date_of_birth: student.date_of_birth || '',
        class_id: student.class_id || '',
        parent_id: student.parent_id || '',
        class_name: student.classes?.name || '',
        parent_name: student.parent?.full_name || '',
        created_at: student.profiles?.created_at || '',
      })) as Student[];
    },
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateStudentData) => {
      // Generate a UUID for the new profile
      const profileId = crypto.randomUUID();
      
      // First create the profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          avatar_url: data.avatar_url || null,
          role: 'student',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Then create the student record
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({
          id: profile.id,
          student_number: data.student_number || null,
          address: data.address || null,
          date_of_birth: data.date_of_birth || null,
          class_id: data.class_id || null,
          parent_id: data.parent_id || null,
        })
        .select()
        .single();

      if (studentError) throw studentError;

      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateStudentData> }) => {
      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          avatar_url: data.avatar_url,
        })
        .eq('id', id);

      if (profileError) throw profileError;

      // Update student record
      const { error: studentError } = await supabase
        .from('students')
        .update({
          student_number: data.student_number,
          address: data.address,
          date_of_birth: data.date_of_birth,
          class_id: data.class_id,
          parent_id: data.parent_id,
        })
        .eq('id', id);

      if (studentError) throw studentError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};