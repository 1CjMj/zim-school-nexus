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
import { useCreateClass, useUpdateClass, type CreateClassData, type ClassData } from '@/hooks/useClassManagement';
import { useTeachers } from '@/hooks/useTeachers';

const classSchema = z.object({
  name: z.string().min(2, 'Class name must be at least 2 characters'),
  subject: z.string().optional(),
  grade_level: z.string().min(1, 'Grade level is required'),
  teacher_id: z.string().optional(),
});

interface ClassFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  classData?: ClassData | null;
}

export const ClassForm: React.FC<ClassFormProps> = ({
  open,
  onOpenChange,
  classData,
}) => {
  const { data: teachers } = useTeachers();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();

  const form = useForm<CreateClassData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: classData?.name || '',
      subject: classData?.subject || '',
      grade_level: classData?.grade_level || '',
      teacher_id: classData?.teacher_id || '',
    },
  });

  React.useEffect(() => {
    if (classData) {
      form.reset({
        name: classData.name,
        subject: classData.subject || '',
        grade_level: classData.grade_level,
        teacher_id: classData.teacher_id || '',
      });
    } else {
      form.reset({
        name: '',
        subject: '',
        grade_level: '',
        teacher_id: '',
      });
    }
  }, [classData, form]);

  const onSubmit = async (data: CreateClassData) => {
    try {
      if (classData) {
        await updateClass.mutateAsync({ id: classData.id, data });
      } else {
        await createClass.mutateAsync(data);
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
            {classData ? 'Edit Class' : 'Create New Class'}
          </DialogTitle>
          <DialogDescription>
            {classData
              ? 'Update the class information below.'
              : 'Fill in the details to create a new class.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Form 4A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="grade_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Form 1">Form 1</SelectItem>
                      <SelectItem value="Form 2">Form 2</SelectItem>
                      <SelectItem value="Form 3">Form 3</SelectItem>
                      <SelectItem value="Form 4">Form 4</SelectItem>
                      <SelectItem value="Form 5">Form 5</SelectItem>
                      <SelectItem value="Form 6">Form 6</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="teacher_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {teachers?.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id}>
                          {teacher.full_name}
                        </SelectItem>
                      ))}
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
                disabled={createClass.isPending || updateClass.isPending}
              >
                {createClass.isPending || updateClass.isPending
                  ? 'Saving...'
                  : classData
                  ? 'Update Class'
                  : 'Create Class'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};