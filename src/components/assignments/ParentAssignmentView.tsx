import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, FileText, User, Download, MessageCircle } from 'lucide-react';
import { Assignment } from '@/hooks/useAssignments';

interface ParentAssignmentViewProps {
  assignments: Assignment[];
}

export const ParentAssignmentView: React.FC<ParentAssignmentViewProps> = ({ assignments }) => {
  const getAssignmentStatus = (assignment: Assignment) => {
    if (!assignment.due_date) return 'active';
    const dueDate = new Date(assignment.due_date);
    const now = new Date();
    
    if (dueDate < now) return 'overdue';
    return 'active';
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
      <div>
        <h2 className="text-2xl font-bold text-foreground">Your Child's Assignments</h2>
        <p className="text-muted-foreground">Monitor your child's academic progress and assignments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
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
            <CardDescription>Pending</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">5</CardTitle>
            <CardDescription>Completed</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-blue-600">82%</CardTitle>
            <CardDescription>Average Grade</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment);
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
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
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
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Submission Status</p>
                      <p className="text-sm text-muted-foreground">Not Submitted</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Assignment File</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignment.file_name ? (
                        <Button variant="outline" size="sm" className="h-6 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          {assignment.file_name}
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      Contact Teacher
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};