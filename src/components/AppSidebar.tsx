
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link, useLocation } from 'react-router-dom';

const AppSidebar = () => {
  const { user, logout, isDarkMode, toggleDarkMode } = useAuth();
  const location = useLocation();

  const getMenuItems = () => {
    const baseItems = [
      { title: 'Dashboard', url: '/dashboard', icon: '📊' },
    ];

    switch (user?.role) {
      case 'admin':
        return [
          ...baseItems,
          { title: 'Students', url: '/students', icon: '👥' },
          { title: 'Teachers', url: '/teachers', icon: '👨‍🏫' },
          { title: 'Classes', url: '/classes', icon: '🏫' },
          { title: 'Assignments', url: '/assignments', icon: '📝' },
          { title: 'Grades', url: '/grades', icon: '📊' },
          { title: 'Attendance', url: '/attendance', icon: '✅' },
          { title: 'Messages', url: '/messages', icon: '💬' },
          { title: 'Fees', url: '/fees', icon: '💰' },
          { title: 'Reports', url: '/reports', icon: '📈' },
          { title: 'Settings', url: '/settings', icon: '⚙️' },
        ];
      case 'teacher':
        return [
          ...baseItems,
          { title: 'My Classes', url: '/classes', icon: '🏫' },
          { title: 'Assignments', url: '/assignments', icon: '📝' },
          { title: 'Grades', url: '/grades', icon: '📊' },
          { title: 'Attendance', url: '/attendance', icon: '✅' },
          { title: 'Messages', url: '/messages', icon: '💬' },
        ];
      case 'student':
        return [
          ...baseItems,
          { title: 'My Grades', url: '/grades', icon: '📊' },
          { title: 'Assignments', url: '/assignments', icon: '📝' },
          { title: 'Timetable', url: '/timetable', icon: '📅' },
          { title: 'Messages', url: '/messages', icon: '💬' },
          { title: 'Resources', url: '/resources', icon: '📚' },
        ];
      case 'parent':
        return [
          ...baseItems,
          { title: 'Children', url: '/children', icon: '👨‍👩‍👧‍👦' },
          { title: 'Fees', url: '/fees', icon: '💰' },
          { title: 'Messages', url: '/messages', icon: '💬' },
          { title: 'Grades', url: '/grades', icon: '📊' },
        ];
      default:
        return baseItems;
    }
  };

  if (!user) return null;

  const initials = user.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
            E8
          </div>
          <div>
            <h2 className="font-semibold text-sidebar-foreground">Educ8</h2>
            <p className="text-xs text-sidebar-foreground/60">School Management</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {getMenuItems().map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <Link to={item.url} className="flex items-center space-x-3">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.full_name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user.role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="h-8 w-8 p-0"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              Logout
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
