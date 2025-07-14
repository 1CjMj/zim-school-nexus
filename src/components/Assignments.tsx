
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, FileText, Users, MoreVertical, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAssignments, useAssignmentStats } from '@/hooks/useAssignments';
import { useAuth } from '@/contexts/AuthContext';

const Assignments = () => {
  const { user } = useAuth();
  const { data: assignments = [], isLoading } = useAssignments();
  const { data: stats } = useAssignmentStats(user?.id);

  const getAssignmentStatus = (assignment: any) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground">Manage assignments and track submissions</p>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-8 bg-muted animate-pulse rounded" />
                <div className="h-4 bg-muted animate-pulse rounded" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'assignment': return <FileText className="h-4 w-4" />;
      case 'test': return <Clock className="h-4 w-4" />;
      case 'essay': return <FileText className="h-4 w-4" />;
      case 'lab-report': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
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
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Manage assignments and track submissions</p>
        </div>
        <Button className="flex items-center gap-2">
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
            <CardTitle className="text-2xl">-</CardTitle>
            <CardDescription>Pending Submissions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">-</CardTitle>
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
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No assignments found.</p>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => {
              const status = getAssignmentStatus(assignment);
              return (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                          {getTypeIcon(assignment.type)}
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Assignment</DropdownMenuItem>
                            <DropdownMenuItem>View Submissions</DropdownMenuItem>
                            <DropdownMenuItem>Grade Submissions</DropdownMenuItem>
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
                          <p className="text-sm text-muted-foreground">0/0</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Attachments</p>
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
      </div>

      <AssignmentForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        assignment={selectedAssignment}
      />
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="active">
          <div className="space-y-4">
            {assignments.filter(a => getAssignmentStatus(a) === 'active').length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No active assignments found.</p>
                </CardContent>
              </Card>
            ) : (
              assignments.filter(a => getAssignmentStatus(a) === 'active').map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No completed assignments found.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <div className="space-y-4">
            {assignments.filter(a => getAssignmentStatus(a) === 'overdue').length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No overdue assignments!</p>
                </CardContent>
              </Card>
            ) : (
              assignments.filter(a => getAssignmentStatus(a) === 'overdue').map((assignment) => (
                <Card key={assignment.id}>
                  <CardHeader>
                    <CardTitle>{assignment.title}</CardTitle>
                    <CardDescription>{assignment.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
