
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
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

const Grades = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const gradeData = [
    {
      id: '1',
      studentName: 'Tatenda Moyo',
      studentNumber: 'STU001',
      class: 'Form 4A',
      mathematics: { grade: 85, trend: 'up' },
      english: { grade: 78, trend: 'stable' },
      physics: { grade: 92, trend: 'up' },
      biology: { grade: 88, trend: 'down' },
      average: 85.8,
      rank: 3
    },
    {
      id: '2',
      studentName: 'Chipo Mukamuri',
      studentNumber: 'STU002',
      class: 'Form 3B',
      mathematics: { grade: 92, trend: 'up' },
      english: { grade: 89, trend: 'up' },
      physics: { grade: 87, trend: 'stable' },
      biology: { grade: 94, trend: 'up' },
      average: 90.5,
      rank: 1
    },
    {
      id: '3',
      studentName: 'Takudzwa Sibanda',
      studentNumber: 'STU003',
      class: 'Form 2C',
      mathematics: { grade: 76, trend: 'down' },
      english: { grade: 82, trend: 'up' },
      physics: { grade: 74, trend: 'down' },
      biology: { grade: 79, trend: 'stable' },
      average: 77.8,
      rank: 8
    }
  ];

  const subjectAverages = [
    { subject: 'Mathematics', average: 84.2, students: 156, improvement: '+2.3%' },
    { subject: 'English Literature', average: 81.7, students: 142, improvement: '+1.8%' },
    { subject: 'Physics', average: 83.9, students: 134, improvement: '+3.1%' },
    { subject: 'Biology', average: 87.3, students: 148, improvement: '+0.9%' },
    { subject: 'Chemistry', average: 79.8, students: 128, improvement: '-1.2%' },
    { subject: 'History', average: 86.1, students: 167, improvement: '+2.7%' }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-green-600';
    if (grade >= 80) return 'text-blue-600';
    if (grade >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Grades</h1>
          <p className="text-muted-foreground">Track student performance and progress</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Grades
          </Button>
          <Button className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">84.7%</CardTitle>
            <CardDescription>School Average</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span>+2.1% from last term</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">1,247</CardTitle>
            <CardDescription>Students Graded</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">92%</CardTitle>
            <CardDescription>Pass Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">156</CardTitle>
            <CardDescription>Honor Roll Students</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList>
          <TabsTrigger value="students">Student Grades</TabsTrigger>
          <TabsTrigger value="subjects">Subject Analysis</TabsTrigger>
          <TabsTrigger value="reports">Grade Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Student Gradebook</CardTitle>
                  <CardDescription>View and manage individual student grades</CardDescription>
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Mathematics</TableHead>
                    <TableHead>English</TableHead>
                    <TableHead>Physics</TableHead>
                    <TableHead>Biology</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Rank</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gradeData.map((student) => (
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
                            <div className="text-sm text-muted-foreground">{student.class}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getGradeColor(student.mathematics.grade)}`}>
                            {student.mathematics.grade}%
                          </span>
                          {getTrendIcon(student.mathematics.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getGradeColor(student.english.grade)}`}>
                            {student.english.grade}%
                          </span>
                          {getTrendIcon(student.english.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getGradeColor(student.physics.grade)}`}>
                            {student.physics.grade}%
                          </span>
                          {getTrendIcon(student.physics.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${getGradeColor(student.biology.grade)}`}>
                            {student.biology.grade}%
                          </span>
                          {getTrendIcon(student.biology.trend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold text-lg ${getGradeColor(student.average)}`}>
                          {student.average}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">#{student.rank}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Grades</DropdownMenuItem>
                            <DropdownMenuItem>Send Report</DropdownMenuItem>
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
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjectAverages.map((subject) => (
              <Card key={subject.subject}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{subject.subject}</CardTitle>
                  <CardDescription>{subject.students} students enrolled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{subject.average}%</span>
                    <Badge variant={subject.improvement.startsWith('+') ? 'default' : 'destructive'}>
                      {subject.improvement}
                    </Badge>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Class Average</span>
                    <span>{subject.students} students</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grade Reports</CardTitle>
              <CardDescription>Generate and download comprehensive grade reports</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <span className="font-medium">Term Report Cards</span>
                  <span className="text-sm text-muted-foreground">Individual student reports</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <span className="font-medium">Class Summary</span>
                  <span className="text-sm text-muted-foreground">Class performance overview</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <span className="font-medium">Subject Analysis</span>
                  <span className="text-sm text-muted-foreground">Subject-wise performance</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <span className="font-medium">Parent Reports</span>
                  <span className="text-sm text-muted-foreground">Reports for parents</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Grades;
