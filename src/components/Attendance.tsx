
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
import { useAttendance, useAttendanceStats, useUpdateAttendance } from '@/hooks/useAttendance';
import { useAuth } from '@/contexts/AuthContext';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  // Fetch attendance data for the selected date
  const { data: attendanceData = [], isLoading } = useAttendance(undefined, selectedDate);
  const { data: stats } = useAttendanceStats();
  const updateAttendance = useUpdateAttendance();

  const handleStatusUpdate = async (attendanceId: string, newStatus: string) => {
    try {
      await updateAttendance.mutateAsync({
        id: attendanceId,
        attendanceData: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update attendance:', error);
    }
  };

  // Filter attendance data based on search query
  const filteredAttendance = attendanceData.filter(record => 
    record.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.student_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.class_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const presentCount = filteredAttendance.filter(s => s.status === 'present').length;
  const lateCount = filteredAttendance.filter(s => s.status === 'late').length;
  const absentCount = filteredAttendance.filter(s => s.status === 'absent').length;
  const attendanceRate = filteredAttendance.length > 0 
    ? Math.round((presentCount + lateCount) / filteredAttendance.length * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Attendance</h1>
            <p className="text-muted-foreground">Track and manage student attendance</p>
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
              {filteredAttendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <p className="text-muted-foreground">
                      {attendanceData.length === 0 
                        ? 'No attendance records found for this date.' 
                        : 'No students match your search criteria.'}
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAttendance.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {record.student_name?.split(' ').map(n => n[0]).join('') || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{record.student_name || 'Unknown Student'}</div>
                          <div className="text-sm text-muted-foreground">{record.student_number || '-'}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{record.class_name || 'Unknown Class'}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(record.status || 'present')}
                        <Badge variant={getStatusColor(record.status || 'present')}>
                          {record.status || 'present'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(record.created_at || '').toLocaleTimeString() || '-'}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">-</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleStatusUpdate(record.id, 'present')}
                          disabled={updateAttendance.isPending}
                        >
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleStatusUpdate(record.id, 'late')}
                          disabled={updateAttendance.isPending}
                        >
                          <Clock className="h-4 w-4 text-yellow-500" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                          onClick={() => handleStatusUpdate(record.id, 'absent')}
                          disabled={updateAttendance.isPending}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
