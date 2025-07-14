import React, { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { useCreateAssignment, useUpdateAssignment, type Assignment, type AssignmentInput } from '@/hooks/useAssignments';
import { useClasses } from '@/hooks/useClasses';
import { useTeachers } from '@/hooks/useTeachers';

const assignmentSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  class_id: z.string().min(1, 'Please select a class'),
  teacher_id: z.string().min(1, 'Please select a teacher'),
  type: z.string().min(1, 'Please select assignment type'),
  due_date: z.string().optional(),
  points: z.number().min(0, 'Points must be positive').optional(),
});

interface AssignmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment?: Assignment | null;
}

export const AssignmentForm: React.FC<AssignmentFormProps> = ({
  open,
  onOpenChange,
  assignment,
}) => {
  const { data: classes } = useClasses();
  const { data: teachers } = useTeachers();
  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  
  const [assignmentFile, setAssignmentFile] = useState<{
    url: string;
    name: string;
  } | null>(
    assignment?.file_url ? {
      url: assignment.file_url,
      name: assignment.file_name || 'Assignment File'
    } : null
  );

  const form = useForm<AssignmentInput>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: assignment?.title || '',
      description: assignment?.description || '',
      class_id: assignment?.class_id || '',
      teacher_id: assignment?.teacher_id || '',
      type: assignment?.type || '',
      due_date: assignment?.due_date || '',
      points: assignment?.points || 0,
    },
  });

  React.useEffect(() => {
    if (assignment) {
      form.reset({
        title: assignment.title,
        description: assignment.description || '',
        class_id: assignment.class_id,
        teacher_id: assignment.teacher_id,
        type: assignment.type,
        due_date: assignment.due_date || '',
        points: assignment.points || 0,
      });
      setAssignmentFile(
        assignment.file_url ? {
          url: assignment.file_url,
          name: assignment.file_name || 'Assignment File'
        } : null
      );
    } else {
      form.reset({
        title: '',
        description: '',
        class_id: '',
        teacher_id: '',
        type: '',
        due_date: '',
        points: 0,
      });
      setAssignmentFile(null);
    }
  }, [assignment, form]);

  const onSubmit = async (data: AssignmentInput) => {
    try {
      const formData: AssignmentInput = {
        ...data,
        file_url: assignmentFile?.url || undefined,
        file_name: assignmentFile?.name || undefined,
        file_type: assignmentFile?.name ? assignmentFile.name.split('.').pop() : undefined,
      };

      if (assignment) {
        await updateAssignment.mutateAsync({ id: assignment.id, assignmentData: formData });
      } else {
        await createAssignment.mutateAsync(formData);
      }
      onOpenChange(false);
      form.reset();
      setAssignmentFile(null);
    } catch (error) {
      // Error handling is done in the mutations
    }
  };

  const handleFileUpload = (url: string, fileName: string) => {
    setAssignmentFile({ url, name: fileName });
  };

  const handleFileRemove = () => {
    setAssignmentFile(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </DialogTitle>
          <DialogDescription>
            {assignment
              ? 'Update the assignment details below.'
              : 'Fill in the details to create a new assignment.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assignment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter assignment description"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="class_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Class</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
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
                name="teacher_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select teacher" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="homework">Homework</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="essay">Essay</SelectItem>
                        <SelectItem value="presentation">Presentation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="points"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Points</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Assignment File (Optional)</FormLabel>
              <FileUpload
                onUpload={handleFileUpload}
                onRemove={handleFileRemove}
                currentFile={assignmentFile}
                uploadOptions={{
                  bucket: 'assignments',
                  folder: 'assignment-files',
                  maxSizeInMB: 10,
                  allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/*'],
                }}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createAssignment.isPending || updateAssignment.isPending}
              >
                {createAssignment.isPending || updateAssignment.isPending
                  ? 'Saving...'
                  : assignment
                  ? 'Update Assignment'
                  : 'Create Assignment'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};