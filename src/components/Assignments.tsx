
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

const Assignments = () => {
  const assignments = [
    {
      id: '1',
      title: 'Quadratic Equations Problem Set',
      subject: 'Mathematics',
      class: 'Form 4A',
      teacher: 'Mrs. Chipo Mutendi',
      dueDate: '2024-01-15',
      totalPoints: 50,
      submittedCount: 18,
      totalStudents: 28,
      status: 'active',
      type: 'assignment',
      description: 'Complete problems 1-20 from Chapter 8. Show all working steps.',
      attachments: ['quadratic_problems.pdf']
    },
    {
      id: '2',
      title: 'Shakespearean Sonnet Analysis',
      subject: 'English Literature',
      class: 'Form 4B',
      teacher: 'Mr. Tonderai Chikwanha',
      dueDate: '2024-01-18',
      totalPoints: 75,
      submittedCount: 22,
      totalStudents: 25,
      status: 'active',
      type: 'essay',
      description: 'Analyze the themes and literary devices in Sonnet 18.',
      attachments: ['sonnet_guidelines.pdf']
    },
    {
      id: '3',
      title: 'Photosynthesis Lab Report',
      subject: 'Biology',
      class: 'Form 3A',
      teacher: 'Ms. Rutendo Makoni',
      dueDate: '2024-01-20',
      totalPoints: 100,
      submittedCount: 15,
      totalStudents: 22,
      status: 'active',
      type: 'lab-report',
      description: 'Submit your lab report based on the photosynthesis experiment.',
      attachments: ['lab_template.docx', 'data_sheet.xlsx']
    },
    {
      id: '4',
      title: 'Physics Test - Chapter 5',
      subject: 'Physics',
      class: 'Form 4C',
      teacher: 'Mrs. Chipo Mutendi',
      dueDate: '2024-01-10',
      totalPoints: 80,
      submittedCount: 24,
      totalStudents: 24,
      status: 'completed',
      type: 'test',
      description: 'Test covering motion, forces, and energy concepts.',
      attachments: []
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

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
            <CardTitle className="text-2xl">47</CardTitle>
            <CardDescription>Active Assignments</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">156</CardTitle>
            <CardDescription>Pending Submissions</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">89%</CardTitle>
            <CardDescription>Submission Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
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
          {assignments.map((assignment) => (
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
                        <span>{assignment.subject}</span>
                        <span>•</span>
                        <span>{assignment.class}</span>
                        <span>•</span>
                        <span>{assignment.teacher}</span>
                      </div>
                      <CardDescription>{assignment.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getStatusColor(assignment.status)}>
                      {assignment.status}
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
                      <p className="text-sm text-muted-foreground">{formatDate(assignment.dueDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Points</p>
                      <p className="text-sm text-muted-foreground">{assignment.totalPoints} pts</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Submissions</p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.submittedCount}/{assignment.totalStudents}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Attachments</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {assignment.attachments.map((attachment, index) => (
                        <Button key={index} variant="outline" size="sm" className="h-6 text-xs">
                          <Download className="h-3 w-3 mr-1" />
                          {attachment}
                        </Button>
                      ))}
                      {assignment.attachments.length === 0 && (
                        <span className="text-sm text-muted-foreground">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="active">
          {/* Filter active assignments */}
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'active').map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          {/* Filter completed assignments */}
          <div className="space-y-4">
            {assignments.filter(a => a.status === 'completed').map((assignment) => (
              <Card key={assignment.id}>
                <CardHeader>
                  <CardTitle>{assignment.title}</CardTitle>
                  <CardDescription>{assignment.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overdue">
          <Card>
            <CardHeader>
              <CardTitle>No Overdue Assignments</CardTitle>
              <CardDescription>All assignments are on track!</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assignments;
