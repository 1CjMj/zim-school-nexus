
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
import { AssignmentForm } from './AssignmentForm';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { RoleGuard } from './RoleGuard';
import { StudentAssignmentView } from './assignments/StudentAssignmentView';
import { TeacherAssignmentView } from './assignments/TeacherAssignmentView';
import { ParentAssignmentView } from './assignments/ParentAssignmentView';
import { AdminAssignmentView } from './assignments/AdminAssignmentView';

const Assignments = () => {
  const { user } = useAuth();
  const { data: assignments = [], isLoading } = useAssignments();
  const { data: stats } = useAssignmentStats(user?.id);
  const { isAdmin, isTeacher, isStudent, isParent } = useRoleAccess();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
            <p className="text-muted-foreground">Loading assignments...</p>
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
          <h1 className="text-3xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">
            {isAdmin() && "Manage all assignments across the institution"}
            {isTeacher() && "Create and manage your class assignments"}
            {isStudent() && "View and submit your assignments"}
            {isParent() && "Monitor your child's assignments and progress"}
          </p>
        </div>
      </div>

      {/* Role-based assignment views */}
      <RoleGuard allowedRoles={['admin', 'principal']}>
        <AdminAssignmentView assignments={assignments} stats={stats} />
      </RoleGuard>

      <RoleGuard allowedRoles={['teacher']}>
        <TeacherAssignmentView assignments={assignments} stats={stats} />
      </RoleGuard>

      <RoleGuard allowedRoles={['student']}>
        <StudentAssignmentView assignments={assignments} />
      </RoleGuard>

      <RoleGuard allowedRoles={['parent']}>
        <ParentAssignmentView assignments={assignments} />
      </RoleGuard>
    </div>
  );
};

export default Assignments;
