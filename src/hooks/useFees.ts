import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Fee {
  id: string;
  student_id: string;
  student_name: string;
  parent_id?: string;
  parent_name?: string;
  fee_type: string;
  amount_due: number;
  amount_paid: number;
  outstanding_amount: number;
  due_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FeeInput {
  student_id: string;
  student_name: string;
  parent_id?: string;
  parent_name?: string;
  fee_type: string;
  amount_due: number;
  amount_paid?: number;
  due_date?: string;
  status?: string;
}

export const useFees = () => {
  return useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Fee[];
    }
  });
};

export const useFeesByStudent = (studentId: string) => {
  return useQuery({
    queryKey: ['fees', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Fee[];
    },
    enabled: !!studentId
  });
};

export const useCreateFee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (feeData: FeeInput) => {
      const { amount_due, amount_paid = 0 } = feeData;
      const outstanding_amount = amount_due - amount_paid;

      const { data, error } = await supabase
        .from('fees')
        .insert([{
          ...feeData,
          amount_paid,
          outstanding_amount,
          status: feeData.status || 'pending'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({
        title: 'Fee record created successfully',
        description: 'The fee has been added to the system.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating fee record',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateFee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, feeData }: { id: string; feeData: Partial<FeeInput> }) => {
      // Calculate outstanding amount if payment amounts are being updated
      let updateData: any = { ...feeData };
      if (feeData.amount_due !== undefined || feeData.amount_paid !== undefined) {
        const currentFee = await supabase
          .from('fees')
          .select('amount_due, amount_paid')
          .eq('id', id)
          .single();
        
        if (currentFee.data) {
          const amount_due = feeData.amount_due ?? currentFee.data.amount_due;
          const amount_paid = feeData.amount_paid ?? currentFee.data.amount_paid;
          updateData.outstanding_amount = amount_due - amount_paid;
        }
      }

      const { data, error } = await supabase
        .from('fees')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({
        title: 'Fee updated successfully',
        description: 'The fee record has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating fee',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useDeleteFee = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('fees')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({
        title: 'Fee deleted successfully',
        description: 'The fee record has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting fee',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};