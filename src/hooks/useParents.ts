import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Parent {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
}

export const useParents = () => {
  return useQuery({
    queryKey: ['parents'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone')
        .eq('role', 'parent')
        .order('full_name');

      if (error) throw error;

      return data as Parent[];
    },
  });
};