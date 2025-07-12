import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useCreateGrade, useUpdateGrade, type Grade, type GradeInput } from '@/hooks/useGrades';
import { useStudents } from '@/hooks/useStudents';
import { useClassManagement } from '@/hooks/useClassManagement';

const gradeFormSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  class_id: z.string().min(1, 'Class is required'),
  subject: z.string().min(1, 'Subject is required'),
  grade: z.number().min(0, 'Grade must be at least 0').max(100, 'Grade cannot exceed 100'),
  max_grade: z.number().min(1, 'Maximum grade must be at least 1'),
  date_recorded: z.date({
    required_error: 'Date is required',
  }),
});

type GradeFormValues = z.infer<typeof gradeFormSchema>;

interface GradeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gradeData?: Grade | null;
}

export const GradeForm: React.FC<GradeFormProps> = ({
  open,
  onOpenChange,
  gradeData,
}) => {
  const { data: students } = useStudents();
  const { data: classes } = useClassManagement();
  const createGrade = useCreateGrade();
  const updateGrade = useUpdateGrade();

  const isEditing = !!gradeData;

  const form = useForm<GradeFormValues>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      student_id: gradeData?.student_id || '',
      class_id: gradeData?.class_id || '',
      subject: gradeData?.subject || '',
      grade: gradeData?.grade || 0,
      max_grade: gradeData?.max_grade || 100,
      date_recorded: gradeData?.date_recorded ? new Date(gradeData.date_recorded) : new Date(),
    },
  });

  const onSubmit = async (values: GradeFormValues) => {
    try {
      const gradeInput: GradeInput = {
        student_id: values.student_id,
        class_id: values.class_id,
        subject: values.subject,
        grade: values.grade,
        max_grade: values.max_grade,
        date_recorded: format(values.date_recorded, 'yyyy-MM-dd'),
      };

      if (isEditing && gradeData) {
        await updateGrade.mutateAsync({
          id: gradeData.id,
          gradeData: gradeInput,
        });
      } else {
        await createGrade.mutateAsync(gradeInput);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Grade' : 'Add New Grade'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the grade information below.'
              : 'Enter the grade details below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="student_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.full_name} ({student.student_number})
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
              name="class_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {classes?.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name}
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
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter subject" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Grade"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Grade</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Max grade"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="date_recorded"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date Recorded</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createGrade.isPending || updateGrade.isPending}
              >
                {(createGrade.isPending || updateGrade.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Update Grade' : 'Add Grade'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};