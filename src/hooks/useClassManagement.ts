import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ClassData {
  id: string;
  name: string;
  subject?: string;
  grade_level: string;
  teacher_id?: string;
  teacher_name?: string;
  student_count: number;
  created_at: string;
}

export interface CreateClassData {
  name: string;
  subject?: string;
  grade_level: string;
  teacher_id?: string;
}

export const useClassManagement = (teacherId?: string) => {
  return useQuery({
    queryKey: ['class-management', teacherId],
    queryFn: async () => {
      let query = supabase
        .from('classes')
        .select(`
          *,
          teacher:profiles!classes_teacher_id_fkey (
            id,
            full_name
          ),
          students (
            id
          )
        `)
        .order('name');
      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        subject: cls.subject || '',
        grade_level: cls.grade_level,
        teacher_id: cls.teacher_id || '',
        teacher_name: cls.teacher?.full_name || '',
        student_count: cls.students?.length || 0,
        created_at: cls.created_at || '',
      })) as ClassData[];
    },
  });
};

export const useCreateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateClassData) => {
      const { data: newClass, error } = await supabase
        .from('classes')
        .insert({
          name: data.name,
          subject: data.subject || null,
          grade_level: data.grade_level,
          teacher_id: data.teacher_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      return newClass;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-management'] });
      toast({
        title: "Success",
        description: "Class created successfully",
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

export const useUpdateClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateClassData> }) => {
      const { error } = await supabase
        .from('classes')
        .update({
          name: data.name,
          subject: data.subject || null,
          grade_level: data.grade_level,
          teacher_id: data.teacher_id || null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-management'] });
      toast({
        title: "Success",
        description: "Class updated successfully",
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

export const useDeleteClass = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-management'] });
      toast({
        title: "Success",
        description: "Class deleted successfully",
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