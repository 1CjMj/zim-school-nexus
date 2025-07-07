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
import { useCreateStudent, useUpdateStudent, type CreateStudentData, type Student } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { useParents } from '@/hooks/useParents';

const studentSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  student_number: z.string().optional(),
  address: z.string().optional(),
  date_of_birth: z.string().optional(),
  class_id: z.string().optional(),
  parent_id: z.string().optional(),
});

interface StudentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student?: Student | null;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  open,
  onOpenChange,
  student,
}) => {
  const { data: classes } = useClasses();
  const { data: parents } = useParents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const form = useForm<CreateStudentData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      full_name: student?.full_name || '',
      email: student?.email || '',
      phone: student?.phone || '',
      student_number: student?.student_number || '',
      address: student?.address || '',
      date_of_birth: student?.date_of_birth || '',
      class_id: student?.class_id || '',
      parent_id: student?.parent_id || '',
    },
  });

  React.useEffect(() => {
    if (student) {
      form.reset({
        full_name: student.full_name,
        email: student.email,
        phone: student.phone || '',
        student_number: student.student_number || '',
        address: student.address || '',
        date_of_birth: student.date_of_birth || '',
        class_id: student.class_id || '',
        parent_id: student.parent_id || '',
      });
    } else {
      form.reset({
        full_name: '',
        email: '',
        phone: '',
        student_number: '',
        address: '',
        date_of_birth: '',
        class_id: '',
        parent_id: '',
      });
    }
  }, [student, form]);

  const onSubmit = async (data: CreateStudentData) => {
    try {
      if (student) {
        await updateStudent.mutateAsync({ id: student.id, data });
      } else {
        await createStudent.mutateAsync(data);
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
            {student ? 'Edit Student' : 'Add New Student'}
          </DialogTitle>
          <DialogDescription>
            {student
              ? 'Update the student information below.'
              : 'Fill in the details to create a new student.'}
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
              name="student_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parent_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {parents?.map((parent) => (
                        <SelectItem key={parent.id} value={parent.id}>
                          {parent.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
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
                disabled={createStudent.isPending || updateStudent.isPending}
              >
                {createStudent.isPending || updateStudent.isPending
                  ? 'Saving...'
                  : student
                  ? 'Update Student'
                  : 'Add Student'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};