import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, Upload } from 'lucide-react';
import { Assignment } from '@/hooks/useAssignments';
import { useSubmissions } from '@/hooks/useSubmissions';
import { FileDownload } from '@/components/ui/file-download';
import { SubmissionForm } from '@/components/SubmissionForm';
import { useAuth } from '@/contexts/AuthContext';

interface StudentAssignmentViewProps {
  assignments: Assignment[];
}

export const StudentAssignmentView: React.FC<StudentAssignmentViewProps> = ({ assignments }) => {
  const { user } = useAuth();
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false);
  
  const { data: submissions = [] } = useSubmissions();
  
  const getAssignmentStatus = (assignment: Assignment) => {
    const submission = submissions.find(s => s.assignment_id === assignment.id);
    if (submission) {
      return submission.status === 'graded' ? 'graded' : 'submitted';
    }
    
    if (!assignment.due_date) return 'active';
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    
    if (dueDate < now) return 'overdue';
    return 'active';
  };

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find(s => s.assignment_id === assignmentId);
  };

  const handleSubmitAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsSubmissionFormOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'submitted': return 'secondary';
      case 'graded': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-ZW', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{assignments.length}</CardTitle>
            <CardDescription>Total Assignments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-600">
              {assignments.filter(a => getAssignmentStatus(a) === 'active').length}
            </CardTitle>
            <CardDescription>Pending Submissions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">
              {assignments.filter(a => getAssignmentStatus(a) === 'overdue').length}
            </CardTitle>
            <CardDescription>Overdue</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
          const submission = getSubmissionForAssignment(assignment.id);
          
          return (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{assignment.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{assignment.class_name || 'Unknown Class'}</span>
                        <span>•</span>
                        <span>{assignment.teacher_name || 'Unknown Teacher'}</span>
                      </div>
                      <CardDescription>{assignment.description || 'No description provided'}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(status)}>
                      {status}
                    </Badge>
                    {submission?.grade && (
                      <Badge variant="outline">
                        {submission.grade} / {assignment.points || 100}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.due_date ? formatDate(assignment.due_date) : 'No due date'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Points</p>
                      <p className="text-sm text-muted-foreground">{assignment.points || 0} pts</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Assignment File</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignment.file_name && assignment.file_url ? (
                        <FileDownload
                          url={assignment.file_url}
                          fileName={assignment.file_name}
                          className="h-6 text-xs"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant={status === 'submitted' || status === 'graded' ? 'secondary' : 'default'} 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => handleSubmitAssignment(assignment)}
                    >
                      <Upload className="h-3 w-3" />
                      {status === 'submitted' || status === 'graded' ? 'Resubmit' : 'Submit'}
                    </Button>
                  </div>
                </div>
                
                {submission?.feedback && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium">Teacher Feedback:</p>
                    <p className="text-sm text-muted-foreground mt-1">{submission.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {selectedAssignment && (
        <SubmissionForm
          open={isSubmissionFormOpen}
          onOpenChange={setIsSubmissionFormOpen}
          assignment={selectedAssignment}
          existingSubmission={getSubmissionForAssignment(selectedAssignment.id)}
        />
      )}
    </div>
  );
};