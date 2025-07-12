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
import { useCreateFee, useUpdateFee, type Fee, type FeeInput } from '@/hooks/useFees';
import { useStudents } from '@/hooks/useStudents';

const feeFormSchema = z.object({
  student_id: z.string().min(1, 'Student is required'),
  student_name: z.string().min(1, 'Student name is required'),
  parent_name: z.string().optional(),
  fee_type: z.string().min(1, 'Fee type is required'),
  amount_due: z.number().min(0, 'Amount due must be at least 0'),
  amount_paid: z.number().min(0, 'Amount paid must be at least 0').optional(),
  due_date: z.date().optional(),
  status: z.enum(['pending', 'partial', 'paid', 'overdue']).optional(),
});

type FeeFormValues = z.infer<typeof feeFormSchema>;

interface FeeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeData?: Fee | null;
}

export const FeeForm: React.FC<FeeFormProps> = ({
  open,
  onOpenChange,
  feeData,
}) => {
  const { data: students } = useStudents();
  const createFee = useCreateFee();
  const updateFee = useUpdateFee();

  const isEditing = !!feeData;

  const form = useForm<FeeFormValues>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: {
      student_id: feeData?.student_id || '',
      student_name: feeData?.student_name || '',
      parent_name: feeData?.parent_name || '',
      fee_type: feeData?.fee_type || 'tuition',
      amount_due: feeData?.amount_due || 0,
      amount_paid: feeData?.amount_paid || 0,
      due_date: feeData?.due_date ? new Date(feeData.due_date) : undefined,
      status: feeData?.status as any || 'pending',
    },
  });

  const selectedStudent = form.watch('student_id');

  React.useEffect(() => {
    if (selectedStudent && students) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        form.setValue('student_name', student.full_name);
      }
    }
  }, [selectedStudent, students, form]);

  const onSubmit = async (values: FeeFormValues) => {
    try {
      const feeInput: FeeInput = {
        student_id: values.student_id,
        student_name: values.student_name,
        parent_name: values.parent_name,
        fee_type: values.fee_type,
        amount_due: values.amount_due,
        amount_paid: values.amount_paid || 0,
        due_date: values.due_date ? format(values.due_date, 'yyyy-MM-dd') : undefined,
        status: values.status || 'pending',
      };

      if (isEditing && feeData) {
        await updateFee.mutateAsync({
          id: feeData.id,
          feeData: feeInput,
        });
      } else {
        await createFee.mutateAsync(feeInput);
      }

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving fee:', error);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Fee Record' : 'Add New Fee Record'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the fee information below.'
              : 'Enter the fee details below.'}
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
              name="parent_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent/Guardian Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter parent/guardian name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fee_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fee Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fee type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tuition">Tuition</SelectItem>
                      <SelectItem value="lab">Lab Fees</SelectItem>
                      <SelectItem value="sports">Sports Fees</SelectItem>
                      <SelectItem value="library">Library Fees</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="examination">Examination</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount_due"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Due ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
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
                name="amount_paid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Paid ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
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
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                disabled={createFee.isPending || updateFee.isPending}
              >
                {(createFee.isPending || updateFee.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditing ? 'Update Fee' : 'Add Fee'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};