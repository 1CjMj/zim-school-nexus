
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    const firstName = user?.full_name?.split(' ')[0] || 'User';
    return `${greeting}, ${firstName}!`;
  };

  const getDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Enrolled this term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">1,247</div>
                <p className="text-sm text-muted-foreground">+23 from last term</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Teaching Staff</CardTitle>
                <CardDescription>Active teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">87</div>
                <p className="text-sm text-muted-foreground">Across all subjects</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fee Collection</CardTitle>
                <CardDescription>This term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">85%</div>
                <Progress value={85} className="mt-2" />
              </CardContent>
            </Card>
          </div>
        );

      case 'teacher':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>My Classes</CardTitle>
                <CardDescription>Active classes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">5</div>
                <p className="text-sm text-muted-foreground">Form 1A to Form 4C</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Total Students</CardTitle>
                <CardDescription>Under your teaching</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">156</div>
                <p className="text-sm text-muted-foreground">Mathematics & Physics</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Grades</CardTitle>
                <CardDescription>Assignments to grade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">12</div>
                <p className="text-sm text-muted-foreground">Due this week</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'student':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Current Average</CardTitle>
                <CardDescription>Overall performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">87%</div>
                <p className="text-sm text-muted-foreground">Excellent performance!</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>This term</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">95%</div>
                <Progress value={95} className="mt-2" />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Tasks</CardTitle>
                <CardDescription>Assignments due</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">3</div>
                <p className="text-sm text-muted-foreground">Due this week</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'parent':
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Children</CardTitle>
                <CardDescription>Your children at school</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">2</div>
                <p className="text-sm text-muted-foreground">Tatenda & Tinotenda</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Fees</CardTitle>
                <CardDescription>Total amount due</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">$450</div>
                <p className="text-sm text-muted-foreground">Due by month end</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>From teachers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">2</div>
                <p className="text-sm text-muted-foreground">Unread messages</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return <div>Welcome to Educ8!</div>;
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {getWelcomeMessage()}
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your school today.
        </p>
      </div>
      
      {getDashboardContent()}
    </div>
  );
};

export default Dashboard;
