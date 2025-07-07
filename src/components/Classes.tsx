
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, BookOpen, Calendar, MoreVertical, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useClassManagement, useDeleteClass, type ClassData } from '@/hooks/useClassManagement';
import { ClassForm } from './ClassForm';

const Classes = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const { data: classes, isLoading, error } = useClassManagement();
  const deleteClass = useDeleteClass();

  const handleEdit = (classData: ClassData) => {
    setSelectedClass(classData);
    setIsFormOpen(true);
  };

  const handleDelete = async (classData: ClassData) => {
    if (window.confirm(`Are you sure you want to delete ${classData.name}?`)) {
      await deleteClass.mutateAsync(classData.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedClass(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error loading classes</h3>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  const classes = [
    {
      id: '1',
      name: 'Mathematics Form 4A',
      subject: 'Mathematics',
      teacher: 'Mrs. Chipo Mutendi',
      students: 28,
      schedule: 'Mon, Wed, Fri - 8:00 AM',
      nextClass: 'Tomorrow at 8:00 AM',
      recentActivity: '5 assignments due this week',
      color: 'bg-blue-500'
    },
    {
      id: '2',
      name: 'English Literature Form 4B',
      subject: 'English',
      teacher: 'Mr. Tonderai Chikwanha',
      students: 25,
      schedule: 'Tue, Thu - 10:00 AM',
      nextClass: 'Today at 10:00 AM',
      recentActivity: 'New reading assignment posted',
      color: 'bg-green-500'
    },
    {
      id: '3',
      name: 'Biology Form 3A',
      subject: 'Biology',
      teacher: 'Ms. Rutendo Makoni',
      students: 22,
      schedule: 'Mon, Wed, Fri - 2:00 PM',
      nextClass: 'Wednesday at 2:00 PM',
      recentActivity: 'Lab report submissions due',
      color: 'bg-purple-500'
    },
    {
      id: '4',
      name: 'Physics Form 4C',
      subject: 'Physics',
      teacher: 'Mrs. Chipo Mutendi',
      students: 24,
      schedule: 'Tue, Thu - 11:00 AM',
      nextClass: 'Thursday at 11:00 AM',
      recentActivity: '3 students absent yesterday',
      color: 'bg-orange-500'
    },
    {
      id: '5',
      name: 'History Form 3B',
      subject: 'History',
      teacher: 'Mr. Tonderai Chikwanha',
      students: 26,
      schedule: 'Mon, Wed - 1:00 PM',
      nextClass: 'Monday at 1:00 PM',
      recentActivity: 'Test scheduled for next week',
      color: 'bg-red-500'
    },
    {
      id: '6',
      name: 'Chemistry Form 4A',
      subject: 'Chemistry',
      teacher: 'Ms. Rutendo Makoni',
      students: 20,
      schedule: 'Tue, Fri - 9:00 AM',
      nextClass: 'Friday at 9:00 AM',
      recentActivity: 'Safety quiz completed',
      color: 'bg-teal-500'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Classes</h1>
          <p className="text-muted-foreground">Manage all classes and schedules</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4" />
          Create Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading classes...</span>
          </div>
        ) : classes && classes.length > 0 ? (
          classes.map((classItem) => (
            <Card key={classItem.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {classItem.subject?.charAt(0) || classItem.name.charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      <CardDescription>{classItem.teacher_name || 'No teacher assigned'}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(classItem)}>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Students</DropdownMenuItem>
                      <DropdownMenuItem>Class Settings</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(classItem)}>
                        Delete Class
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{classItem.student_count} students</span>
                  </div>
                  {classItem.subject && <Badge variant="outline">{classItem.subject}</Badge>}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Grade: {classItem.grade_level}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No classes found</h3>
            <p className="text-muted-foreground mb-4">Create your first class to get started</p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </div>
        )}
      </div>

      <ClassForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        classData={selectedClass}
      />
    </div>
  );
};

export default Classes;
