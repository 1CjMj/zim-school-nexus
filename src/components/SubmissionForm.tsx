import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/ui/file-upload';
import { useCreateSubmission, useUpdateSubmission, type Submission } from '@/hooks/useSubmissions';
import { Assignment } from '@/hooks/useAssignments';

interface SubmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: Assignment;
  existingSubmission?: Submission | null;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({
  open,
  onOpenChange,
  assignment,
  existingSubmission
}) => {
  const [content, setContent] = useState(existingSubmission?.content || '');
  const [submissionFile, setSubmissionFile] = useState<{ url: string; name: string } | null>(
    existingSubmission?.file_url && existingSubmission?.file_name
      ? { url: existingSubmission.file_url, name: existingSubmission.file_name }
      : null
  );

  const createSubmission = useCreateSubmission();
  const updateSubmission = useUpdateSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submissionData = {
      assignment_id: assignment.id,
      content: content.trim() || null,
      file_url: submissionFile?.url || null,
      file_name: submissionFile?.name || null,
      file_type: submissionFile?.name?.split('.').pop() || null,
    };

    try {
      if (existingSubmission) {
        await updateSubmission.mutateAsync({
          id: existingSubmission.id,
          submissionData
        });
      } else {
        await createSubmission.mutateAsync(submissionData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting assignment:', error);
    }
  };

  const handleFileUpload = (url: string, fileName: string) => {
    setSubmissionFile({ url, name: fileName });
  };

  const handleFileRemove = () => {
    setSubmissionFile(null);
  };

  const isLoading = createSubmission.isPending || updateSubmission.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {existingSubmission ? 'Update Submission' : 'Submit Assignment'}
          </DialogTitle>
          <DialogDescription>
            Submit your work for: {assignment.title}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="content">Written Response (Optional)</Label>
            <Textarea
              id="content"
              placeholder="Enter your written response here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="space-y-2">
            <Label>File Submission</Label>
            <FileUpload
              onUpload={handleFileUpload}
              onRemove={handleFileRemove}
              uploadOptions={{
                bucket: 'submissions',
                folder: `${assignment.id}`,
                maxSizeInMB: 10,
                allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'image/*']
              }}
              currentFile={submissionFile}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || (!content.trim() && !submissionFile)}>
              {isLoading ? 'Submitting...' : existingSubmission ? 'Update Submission' : 'Submit Assignment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};