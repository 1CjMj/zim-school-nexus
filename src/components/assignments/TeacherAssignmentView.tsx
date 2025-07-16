import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, FileText, Users, MoreVertical, Edit, Eye } from 'lucide-react';
import { FileDownload } from '@/components/ui/file-download';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AssignmentForm } from '../AssignmentForm';
import { Assignment } from '@/hooks/useAssignments';

interface TeacherAssignmentViewProps {
  assignments: Assignment[];
  stats: any;
}

export const TeacherAssignmentView: React.FC<TeacherAssignmentViewProps> = ({ assignments, stats }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedAssignment(null);
  };

  const handleCreateAssignment = () => {
    setSelectedAssignment(null);
    setIsFormOpen(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsFormOpen(true);
  };

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
      case 'completed': return 'secondary';
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Assignments</h2>
          <p className="text-muted-foreground">Create and manage your class assignments</p>
        </div>
        <Button className="flex items-center gap-2" onClick={handleCreateAssignment}>
          <Plus className="h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats?.active || 0}</CardTitle>
            <CardDescription>Active Assignments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-orange-600">12</CardTitle>
            <CardDescription>Pending Reviews</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-green-600">85%</CardTitle>
            <CardDescription>Submission Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats?.dueThisWeek || 0}</CardTitle>
            <CardDescription>Due This Week</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Assignments</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="grading">Need Grading</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
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
                        </div>
                        <CardDescription>{assignment.description || 'No description provided'}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={getStatusColor(status)}>
                        {status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditAssignment(assignment)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Assignment
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Users className="h-4 w-4 mr-2" />
                            View Submissions
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Grade Submissions
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Points</p>
                        <p className="text-sm text-muted-foreground">{assignment.points || 0} pts</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Submissions</p>
                        <p className="text-sm text-muted-foreground">8/25</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Attachments</p>
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
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {assignments.filter(a => getAssignmentStatus(a) === 'active').map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grading">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No assignments need grading at the moment.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No completed assignments found.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AssignmentForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        assignment={selectedAssignment}
      />
    </div>
  );
};