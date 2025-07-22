import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Teacher {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  // Remove subjects/classes for now to avoid join issues
  experience?: string;
  qualification?: string;
  status: 'active' | 'on_leave';
  created_at: string;
}

export interface CreateTeacherData {
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  subjects?: string[];
  experience?: string;
  qualification?: string;
  status?: 'active' | 'on_leave';
}

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, avatar_url, created_at, role')
        .eq('role', 'teacher')
        .order('full_name');

      if (error) throw error;

      return data?.map(teacher => ({
        id: teacher.id,
        full_name: teacher.full_name,
        email: teacher.email,
        phone: teacher.phone || '',
        avatar_url: teacher.avatar_url || '',
        experience: '', // This would need to be added to the database schema
        qualification: '', // This would need to be added to the database schema
        status: 'active' as const, // This would need to be added to the database schema
        created_at: teacher.created_at,
      })) as Teacher[];
    },
  });
};

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTeacherData) => {
      const profileId = crypto.randomUUID();
      
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: profileId,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          avatar_url: data.avatar_url || null,
          role: 'teacher',
        })
        .select()
        .single();

      if (profileError) throw profileError;

      return profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "Teacher created successfully",
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

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateTeacherData> }) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          avatar_url: data.avatar_url,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "Teacher updated successfully",
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

export const useDeleteTeacher = () => {
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
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({
        title: "Success",
        description: "Teacher deleted successfully",
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