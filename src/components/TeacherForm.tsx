import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateTeacher, useUpdateTeacher, type CreateTeacherData, type Teacher } from '@/hooks/useTeachers';

const teacherSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  experience: z.string().optional(),
  qualification: z.string().optional(),
  status: z.enum(['active', 'on_leave']).optional(),
});

interface TeacherFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teacher?: Teacher | null;
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  open,
  onOpenChange,
  teacher,
}) => {
  const createTeacher = useCreateTeacher();
  const updateTeacher = useUpdateTeacher();

  const form = useForm<CreateTeacherData>({
    resolver: zodResolver(teacherSchema),
    defaultValues: {
      full_name: teacher?.full_name || '',
      email: teacher?.email || '',
      phone: teacher?.phone || '',
      experience: teacher?.experience || '',
      qualification: teacher?.qualification || '',
      status: teacher?.status || 'active',
    },
  });

  React.useEffect(() => {
    if (teacher) {
      form.reset({
        full_name: teacher.full_name,
        email: teacher.email,
        phone: teacher.phone || '',
        experience: teacher.experience || '',
        qualification: teacher.qualification || '',
        status: teacher.status || 'active',
      });
    } else {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        experience: '',
        qualification: '',
        status: 'active',
      });
    }
  }, [teacher, form]);

  const onSubmit = async (data: CreateTeacherData) => {
    try {
      if (teacher) {
        await updateTeacher.mutateAsync({ id: teacher.id, data });
      } else {
        await createTeacher.mutateAsync(data);
      }
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // Error handling is done in the mutations
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {teacher ? 'Edit Teacher' : 'Add New Teacher'}
          </DialogTitle>
          <DialogDescription>
            {teacher
              ? 'Update the teacher information below.'
              : 'Fill in the details to create a new teacher.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qualification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qualification</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter qualification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experience</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 5 years" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTeacher.isPending || updateTeacher.isPending}
              >
                {createTeacher.isPending || updateTeacher.isPending
                  ? 'Saving...'
                  : teacher
                  ? 'Update Teacher'
                  : 'Add Teacher'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};