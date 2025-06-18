
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Teachers = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const teachers = [
    {
      id: '1',
      name: 'Mrs. Chipo Mutendi',
      email: 'chipo.mutendi@educ8.zw',
      phone: '+263 77 123 4567',
      subjects: ['Mathematics', 'Physics'],
      classes: ['Form 4A', 'Form 3B', 'Form 2C'],
      experience: '8 years',
      qualification: 'BSc Mathematics',
      status: 'Active'
    },
    {
      id: '2',
      name: 'Mr. Tonderai Chikwanha',
      email: 'tonderai.chikwanha@educ8.zw',
      phone: '+263 77 234 5678',
      subjects: ['English Literature', 'History'],
      classes: ['Form 4B', 'Form 3A'],
      experience: '12 years',
      qualification: 'BA English Literature',
      status: 'Active'
    },
    {
      id: '3',
      name: 'Ms. Rutendo Makoni',
      email: 'rutendo.makoni@educ8.zw',
      phone: '+263 77 345 6789',
      subjects: ['Biology', 'Chemistry'],
      classes: ['Form 4C', 'Form 3C'],
      experience: '5 years',
      qualification: 'BSc Biology',
      status: 'Active'
    },
    {
      id: '4',
      name: 'Mr. Trust Mpofu',
      email: 'trust.mpofu@educ8.zw',
      phone: '+263 77 456 7890',
      subjects: ['Geography', 'Agriculture'],
      classes: ['Form 2A', 'Form 1B'],
      experience: '15 years',
      qualification: 'BSc Geography',
      status: 'On Leave'
    }
  ];

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teacher.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    teacher.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground">Manage teaching staff and assignments</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">87</CardTitle>
            <CardDescription>Total Teachers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">82</CardTitle>
            <CardDescription>Active Teachers</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">5</CardTitle>
            <CardDescription>On Leave</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">18:1</CardTitle>
            <CardDescription>Student-Teacher Ratio</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Teaching Staff</CardTitle>
              <CardDescription>View and manage all teachers</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search teachers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Teacher</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Classes</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{teacher.name}</div>
                        <div className="text-sm text-muted-foreground">{teacher.qualification}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.slice(0, 2).map((cls) => (
                        <Badge key={cls} variant="outline" className="text-xs">
                          {cls}
                        </Badge>
                      ))}
                      {teacher.classes.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{teacher.classes.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{teacher.experience}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={teacher.status === 'Active' ? 'default' : 'secondary'}>
                      {teacher.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Classes</DropdownMenuItem>
                        <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Teachers;
