import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Class {
  id: string;
  name: string;
  subject?: string;
  grade_level: string;
  teacher_id?: string;
  teacher_name?: string;
  created_at: string;
}

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:profiles!classes_teacher_id_fkey (
            id,
            full_name
          )
        `)
        .order('name');

      if (error) throw error;

      return data?.map(cls => ({
        id: cls.id,
        name: cls.name,
        subject: cls.subject || '',
        grade_level: cls.grade_level,
        teacher_id: cls.teacher_id || '',
        teacher_name: cls.teacher?.full_name || '',
        created_at: cls.created_at || '',
      })) as Class[];
    },
  });
};