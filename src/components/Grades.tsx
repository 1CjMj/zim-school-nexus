
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Download, TrendingUp, TrendingDown, MoreVertical, Plus, Loader2 } from 'lucide-react';
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
import { useGrades, useDeleteGrade, type Grade } from '@/hooks/useGrades';
import { GradeForm } from './GradeForm';

const Grades = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);

  const { data: grades, isLoading, error } = useGrades();
  const deleteGrade = useDeleteGrade();

  // Group grades by student and calculate statistics
  const studentGrades = useMemo(() => {
    if (!grades) return [];

    const groupedGrades = grades.reduce((acc, grade) => {
      const key = grade.student_id;
      if (!acc[key]) {
        acc[key] = {
          student_id: grade.student_id,
          student_name: grade.student_name || 'Unknown Student',
          student_number: grade.student_number || '',
          class_name: grade.class_name || '',
          subjects: {},
          total_grades: 0,
          total_score: 0
        };
      }

      acc[key].subjects[grade.subject] = {
        grade: grade.grade,
        max_grade: grade.max_grade,
        percentage: Math.round((grade.grade / grade.max_grade) * 100)
      };
      
      acc[key].total_grades += 1;
      acc[key].total_score += (grade.grade / grade.max_grade) * 100;

      return acc;
    }, {} as any);

    return Object.values(groupedGrades).map((student: any) => ({
      ...student,
      average: student.total_grades > 0 ? Math.round(student.total_score / student.total_grades) : 0
    }));
  }, [grades]);

  // Calculate subject averages
  const subjectStats = useMemo(() => {
    if (!grades) return [];

    const subjectGrades = grades.reduce((acc, grade) => {
      const subject = grade.subject;
      if (!acc[subject]) {
        acc[subject] = {
          subject,
          grades: [],
          students: new Set()
        };
      }
      
      const percentage = (grade.grade / grade.max_grade) * 100;
      acc[subject].grades.push(percentage);
      acc[subject].students.add(grade.student_id);
      
      return acc;
    }, {} as any);

    return Object.values(subjectGrades).map((subject: any) => ({
      subject: subject.subject,
      average: subject.grades.length > 0 
        ? subject.grades.reduce((sum: number, grade: number) => sum + grade, 0) / subject.grades.length 
        : 0,
      students: subject.students.size,
      improvement: '+0.0%' // TODO: Calculate actual improvement from previous term
    }));
  }, [grades]);

  const filteredStudents = studentGrades.filter(student =>
    student.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (grade: Grade) => {
    setSelectedGrade(grade);
    setIsFormOpen(true);
  };

  const handleDelete = async (grade: Grade) => {
    if (window.confirm(`Are you sure you want to delete this grade for ${grade.student_name}?`)) {
      await deleteGrade.mutateAsync(grade.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedGrade(null);
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error loading grades</h3>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

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
          <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Grade
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {subjectStats.length > 0 
                ? Math.round(subjectStats.reduce((sum, subject) => sum + subject.average, 0) / subjectStats.length) + '%'
                : '0%'
              }
            </CardTitle>
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
            <CardTitle className="text-2xl">{studentGrades.length}</CardTitle>
            <CardDescription>Students Graded</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {studentGrades.length > 0 
                ? Math.round((studentGrades.filter(s => s.average >= 50).length / studentGrades.length) * 100) + '%'
                : '0%'
              }
            </CardTitle>
            <CardDescription>Pass Rate</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {studentGrades.filter(s => s.average >= 85).length}
            </CardTitle>
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
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading grades...</span>
                </div>
              ) : filteredStudents.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Subjects</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.student_id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {student.student_name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{student.student_name}</div>
                              <div className="text-sm text-muted-foreground">
                                {student.student_number} • {student.class_name}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(student.subjects).map(([subject, data]: [string, any]) => (
                              <Badge key={subject} variant="outline" className="text-xs">
                                {subject}: {data.percentage}%
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`font-bold text-lg ${getGradeColor(student.average)}`}>
                            {student.average}%
                          </span>
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
                              <DropdownMenuItem>Send Report</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold mb-2">No grades found</h3>
                  <p className="text-muted-foreground mb-4">Add grades to get started</p>
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Grade
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {subjectStats.map((subject) => (
              <Card key={subject.subject}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{subject.subject}</CardTitle>
                  <CardDescription>{subject.students} students enrolled</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{Math.round(subject.average)}%</span>
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

      <GradeForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        gradeData={selectedGrade}
      />
    </div>
  );
};

export default Grades;
