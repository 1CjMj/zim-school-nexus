import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Assignment {
  id: string;
  title: string;
  description: string | null;
  class_id: string;
  teacher_id: string;
  type: string;
  due_date: string | null;
  points: number | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Joined data
  class_name?: string;
  teacher_name?: string;
  submission_count?: number;
  total_students?: number;
}

export interface AssignmentInput {
  title: string;
  description?: string;
  class_id: string;
  teacher_id: string;
  type: string;
  due_date?: string;
  points?: number;
  file_url?: string;
  file_name?: string;
  file_type?: string;
}

export const useAssignments = (classId?: string, teacherId?: string) => {
  return useQuery({
    queryKey: ['assignments', classId, teacherId],
    queryFn: async () => {
      let query = supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(name),
          profiles!inner(full_name)
        `)
        .order('created_at', { ascending: false });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((assignment: any) => ({
        ...assignment,
        class_name: assignment.classes.name,
        teacher_name: assignment.profiles.full_name
      })) as Assignment[];
    }
  });
};

export const useAssignmentsByClass = (classId: string) => {
  return useQuery({
    queryKey: ['assignments', 'class', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assignments')
        .select(`
          *,
          classes!inner(name),
          profiles!inner(full_name)
        `)
        .eq('class_id', classId)
        .order('due_date', { ascending: true });

      if (error) throw error;

      return data.map((assignment: any) => ({
        ...assignment,
        class_name: assignment.classes.name,
        teacher_name: assignment.profiles.full_name
      })) as Assignment[];
    },
    enabled: !!classId
  });
};

export const useAssignmentStats = (teacherId?: string) => {
  return useQuery({
    queryKey: ['assignments', 'stats', teacherId],
    queryFn: async () => {
      let query = supabase
        .from('assignments')
        .select('*');

      if (teacherId) {
        query = query.eq('teacher_id', teacherId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const now = new Date();
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

      const active = data.filter(assignment => {
        if (!assignment.due_date) return true;
        return new Date(assignment.due_date) > now;
      }).length;

      const dueThisWeek = data.filter(assignment => {
        if (!assignment.due_date) return false;
        const dueDate = new Date(assignment.due_date);
        return dueDate > now && dueDate <= weekFromNow;
      }).length;

      const overdue = data.filter(assignment => {
        if (!assignment.due_date) return false;
        return new Date(assignment.due_date) < now;
      }).length;

      return {
        total: data.length,
        active,
        overdue,
        dueThisWeek,
        completed: data.length - active - overdue
      };
    }
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (assignmentData: AssignmentInput) => {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment created successfully',
        description: 'The assignment has been added.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating assignment',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, assignmentData }: { id: string; assignmentData: Partial<AssignmentInput> }) => {
      const { data, error } = await supabase
        .from('assignments')
        .update(assignmentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment updated successfully',
        description: 'The assignment has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating assignment',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useDeleteAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assignments'] });
      toast({
        title: 'Assignment deleted successfully',
        description: 'The assignment has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting assignment',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};