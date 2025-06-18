
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Users, BookOpen, Calendar, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Classes = () => {
  const [selectedView, setSelectedView] = useState('grid');

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
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Class
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">24</CardTitle>
            <CardDescription>Active Classes</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">587</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">12</CardTitle>
            <CardDescription>Subjects Offered</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">94%</CardTitle>
            <CardDescription>Average Attendance</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg ${classItem.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {classItem.subject.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{classItem.name}</CardTitle>
                    <CardDescription>{classItem.teacher}</CardDescription>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Class</DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>View Students</DropdownMenuItem>
                    <DropdownMenuItem>Class Settings</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{classItem.students} students</span>
                </div>
                <Badge variant="outline">{classItem.subject}</Badge>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{classItem.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Next: {classItem.nextClass}</span>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">{classItem.recentActivity}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex -space-x-1">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar key={i} className="h-6 w-6 border-2 border-background">
                      <AvatarFallback className="text-xs">S{i}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">+{classItem.students - 4} more</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Classes;
