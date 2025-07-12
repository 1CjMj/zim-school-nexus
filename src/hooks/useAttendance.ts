import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  class_id: string;
  date: string;
  status: string;
  created_at: string;
  // Joined data
  student_name?: string;
  student_number?: string;
  class_name?: string;
}

export interface AttendanceInput {
  student_id: string;
  class_id: string;
  date: string;
  status: string;
}

export const useAttendance = (classId?: string, date?: string) => {
  return useQuery({
    queryKey: ['attendance', classId, date],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          students!inner(
            id,
            student_number,
            profiles!inner(full_name)
          ),
          classes!inner(name)
        `)
        .order('date', { ascending: false });

      if (classId) {
        query = query.eq('class_id', classId);
      }

      if (date) {
        query = query.eq('date', date);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map((record: any) => ({
        ...record,
        student_name: record.students.profiles.full_name,
        student_number: record.students.student_number,
        class_name: record.classes.name
      })) as AttendanceRecord[];
    }
  });
};

export const useAttendanceByStudent = (studentId: string) => {
  return useQuery({
    queryKey: ['attendance', 'student', studentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          classes!inner(name)
        `)
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (error) throw error;

      return data.map((record: any) => ({
        ...record,
        class_name: record.classes.name
      })) as AttendanceRecord[];
    },
    enabled: !!studentId
  });
};

export const useAttendanceStats = (classId?: string) => {
  return useQuery({
    queryKey: ['attendance', 'stats', classId],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select('status');

      if (classId) {
        query = query.eq('class_id', classId);
      }

      const { data, error } = await query;

      if (error) throw error;

      const total = data.length;
      const present = data.filter(record => record.status === 'present').length;
      const absent = data.filter(record => record.status === 'absent').length;
      const late = data.filter(record => record.status === 'late').length;

      return {
        total,
        present,
        absent,
        late,
        presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
        absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
        latePercentage: total > 0 ? Math.round((late / total) * 100) : 0
      };
    }
  });
};

export const useCreateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendanceData: AttendanceInput) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert([attendanceData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Attendance recorded successfully',
        description: 'The attendance has been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error recording attendance',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, attendanceData }: { id: string; attendanceData: Partial<AttendanceInput> }) => {
      const { data, error } = await supabase
        .from('attendance')
        .update(attendanceData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Attendance updated successfully',
        description: 'The attendance record has been updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating attendance',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useBulkCreateAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (attendanceRecords: AttendanceInput[]) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert(attendanceRecords)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Attendance recorded successfully',
        description: 'All attendance records have been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error recording attendance',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useDeleteAttendance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({
        title: 'Attendance deleted successfully',
        description: 'The attendance record has been removed.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting attendance',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};