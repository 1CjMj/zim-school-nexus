import { useAuth } from '@/contexts/AuthContext';

export type UserRole = 'admin' | 'principal' | 'teacher' | 'student' | 'parent';

export const useRoleAccess = () => {
  const { user } = useAuth();

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const isAdmin = (): boolean => {
    return hasAnyRole(['admin', 'principal']);
  };

  const isTeacher = (): boolean => {
    return hasRole('teacher');
  };

  const isStudent = (): boolean => {
    return hasRole('student');
  };

  const isParent = (): boolean => {
    return hasRole('parent');
  };

  const canManageAssignments = (): boolean => {
    return hasAnyRole(['admin', 'principal', 'teacher']);
  };

  const canViewAllAssignments = (): boolean => {
    return hasAnyRole(['admin', 'principal']);
  };

  const canGradeAssignments = (): boolean => {
    return hasAnyRole(['admin', 'principal', 'teacher']);
  };

  const canSubmitAssignments = (): boolean => {
    return hasRole('student');
  };

  const canViewChildAssignments = (): boolean => {
    return hasRole('parent');
  };

  return {
    user,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    canManageAssignments,
    canViewAllAssignments,
    canGradeAssignments,
    canSubmitAssignments,
    canViewChildAssignments,
  };
};