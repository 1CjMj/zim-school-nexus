
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, MoreVertical } from 'lucide-react';
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

const Students = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const students = [
    {
      id: '1',
      name: 'Tatenda Moyo',
      email: 'tatenda.moyo@educ8.zw',
      studentNumber: 'STU001',
      class: 'Form 4A',
      grade: '87%',
      attendance: '95%',
      status: 'Active',
      parent: 'Mr. James Moyo'
    },
    {
      id: '2',
      name: 'Chipo Mukamuri',
      email: 'chipo.mukamuri@educ8.zw',
      studentNumber: 'STU002',
      class: 'Form 3B',
      grade: '92%',
      attendance: '98%',
      status: 'Active',
      parent: 'Mrs. Grace Mukamuri'
    },
    {
      id: '3',
      name: 'Takudzwa Sibanda',
      email: 'takudzwa.sibanda@educ8.zw',
      studentNumber: 'STU003',
      class: 'Form 2C',
      grade: '78%',
      attendance: '88%',
      status: 'Active',
      parent: 'Mr. Peter Sibanda'
    },
    {
      id: '4',
      name: 'Tinashe Gumbo',
      email: 'tinashe.gumbo@educ8.zw',
      studentNumber: 'STU004',
      class: 'Form 1A',
      grade: '85%',
      attendance: '92%',
      status: 'Active',
      parent: 'Mrs. Faith Gumbo'
    }
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.class.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground">Manage all students in your school</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1,247</CardTitle>
            <CardDescription>Total Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1,198</CardTitle>
            <CardDescription>Active Students</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">49</CardTitle>
            <CardDescription>New This Term</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">89%</CardTitle>
            <CardDescription>Average Attendance</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Directory</CardTitle>
              <CardDescription>View and manage all students</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search students..."
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
                <TableHead>Student</TableHead>
                <TableHead>Student #</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Average Grade</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Parent/Guardian</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.name}</div>
                        <div className="text-sm text-muted-foreground">{student.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono">{student.studentNumber}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.class}</Badge>
                  </TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>{student.attendance}</TableCell>
                  <TableCell>{student.parent}</TableCell>
                  <TableCell>
                    <Badge variant="default">{student.status}</Badge>
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
                        <DropdownMenuItem>View Grades</DropdownMenuItem>
                        <DropdownMenuItem>Contact Parent</DropdownMenuItem>
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

export default Students;
