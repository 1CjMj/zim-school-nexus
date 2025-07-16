import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Submission {
  id: string;
  assignment_id: string;
  student_id: string;
  content: string | null;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  status: string;
  feedback: string | null;
  grade: number | null;
  submitted_at: string | null;
  graded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface SubmissionInput {
  assignment_id: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_type?: string;
  status?: string;
}

export const useSubmissions = (assignmentId?: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['submissions', assignmentId, user?.id],
    queryFn: async () => {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (assignmentId) {
        query = query.eq('assignment_id', assignmentId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Submission[];
    },
    enabled: !!user
  });
};

export const useSubmissionByAssignment = (assignmentId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['submission', assignmentId, user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .eq('student_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      return data as Submission | null;
    },
    enabled: !!user && !!assignmentId
  });
};

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (submissionData: SubmissionInput) => {
      const { data, error } = await supabase
        .from('submissions')
        .insert([{
          ...submissionData,
          student_id: user?.id,
          submitted_at: new Date().toISOString(),
          status: 'submitted'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
      toast({
        title: 'Submission created successfully',
        description: 'Your assignment has been submitted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating submission',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, submissionData }: { id: string; submissionData: Partial<SubmissionInput> }) => {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          ...submissionData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission'] });
      toast({
        title: 'Submission updated successfully',
        description: 'Your submission has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating submission',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useGradeSubmission = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, grade, feedback }: { id: string; grade: number; feedback?: string }) => {
      const { data, error } = await supabase
        .from('submissions')
        .update({
          grade,
          feedback,
          graded_at: new Date().toISOString(),
          status: 'graded'
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      toast({
        title: 'Submission graded successfully',
        description: 'Grade has been assigned.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error grading submission',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};