
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Search, Filter, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [searchQuery, setSearchQuery] = useState('');

  const attendanceData = [
    {
      id: '1',
      studentName: 'Tatenda Moyo',
      studentNumber: 'STU001',
      class: 'Form 4A',
      status: 'present',
      timeIn: '7:45 AM',
      notes: ''
    },
    {
      id: '2',
      studentName: 'Chipo Mukamuri',
      studentNumber: 'STU002',
      class: 'Form 3B',
      status: 'present',
      timeIn: '7:50 AM',
      notes: ''
    },
    {
      id: '3',
      studentName: 'Takudzwa Sibanda',
      studentNumber: 'STU003',
      class: 'Form 2C',
      status: 'late',
      timeIn: '8:15 AM',
      notes: 'Transport delay'
    },
    {
      id: '4',
      studentName: 'Tinashe Gumbo',
      studentNumber: 'STU004',
      class: 'Form 1A',
      status: 'absent',
      timeIn: '',
      notes: 'Sick leave'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'late':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'default';
      case 'late': return 'secondary';
      case 'absent': return 'destructive';
      default: return 'default';
    }
  };

  const presentCount = attendanceData.filter(s => s.status === 'present').length;
  const lateCount = attendanceData.filter(s => s.status === 'late').length;
  const absentCount = attendanceData.filter(s => s.status === 'absent').length;
  const attendanceRate = Math.round((presentCount + lateCount) / attendanceData.length * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
          <p className="text-muted-foreground">Track and manage student attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <Button variant="outline">Take Attendance</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              {presentCount}
            </CardTitle>
            <CardDescription>Present Today</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Clock className="h-6 w-6 text-yellow-500" />
              {lateCount}
            </CardTitle>
            <CardDescription>Late Arrivals</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-500" />
              {absentCount}
            </CardTitle>
            <CardDescription>Absent Today</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{attendanceRate}%</CardTitle>
            <CardDescription>Attendance Rate</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Daily Attendance - {new Date(selectedDate).toLocaleDateString()}</CardTitle>
              <CardDescription>Mark and review student attendance</CardDescription>
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
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {student.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{student.studentName}</div>
                        <div className="text-sm text-muted-foreground">{student.studentNumber}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{student.class}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(student.status)}
                      <Badge variant={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {student.timeIn || '-'}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {student.notes || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Clock className="h-4 w-4 text-yellow-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
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

export default Attendance;
