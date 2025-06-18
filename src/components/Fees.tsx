
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

const Fees = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const feeData = [
    {
      id: '1',
      studentName: 'Tatenda Moyo',
      studentNumber: 'STU001',
      class: 'Form 4A',
      totalFees: 450,
      paidAmount: 300,
      outstandingAmount: 150,
      dueDate: '2024-02-15',
      status: 'partial',
      parent: 'Mr. James Moyo',
      lastPayment: '2024-01-10'
    },
    {
      id: '2',
      studentName: 'Chipo Mukamuri',
      studentNumber: 'STU002',
      class: 'Form 3B',
      totalFees: 420,
      paidAmount: 420,
      outstandingAmount: 0,
      dueDate: '2024-02-15',
      status: 'paid',
      parent: 'Mrs. Grace Mukamuri',
      lastPayment: '2024-01-05'
    },
    {
      id: '3',
      studentName: 'Takudzwa Sibanda',
      studentNumber: 'STU003',
      class: 'Form 2C',
      totalFees: 380,
      paidAmount: 0,
      outstandingAmount: 380,
      dueDate: '2024-02-15',
      status: 'outstanding',
      parent: 'Mr. Peter Sibanda',
      lastPayment: null
    },
    {
      id: '4',
      studentName: 'Tinashe Gumbo',
      studentNumber: 'STU004',
      class: 'Form 1A',
      totalFees: 350,
      paidAmount: 175,
      outstandingAmount: 175,
      dueDate: '2024-02-15',
      status: 'partial',
      parent: 'Mrs. Faith Gumbo',
      lastPayment: '2024-01-08'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'partial': return 'secondary';
      case 'outstanding': return 'destructive';
      case 'overdue': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'outstanding':
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const totalCollected = feeData.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const totalOutstanding = feeData.reduce((sum, fee) => sum + fee.outstandingAmount, 0);
  const totalExpected = feeData.reduce((sum, fee) => sum + fee.totalFees, 0);
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fees Management</h1>
          <p className="text-muted-foreground">Track school fees and payments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${totalCollected}</CardTitle>
            <CardDescription>Total Collected</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress value={collectionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{collectionRate}% collection rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">${totalOutstanding}</CardTitle>
            <CardDescription>Outstanding Amount</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${totalExpected}</CardTitle>
            <CardDescription>Total Expected</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {feeData.filter(f => f.status === 'paid').length}
            </CardTitle>
            <CardDescription>Fully Paid Students</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Student Fee Status</CardTitle>
              <CardDescription>Overview of all student fee payments</CardDescription>
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
                <TableHead>Total Fees</TableHead>
                <TableHead>Paid Amount</TableHead>
                <TableHead>Outstanding</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Parent/Guardian</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {feeData.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {fee.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{fee.studentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {fee.studentNumber} • {fee.class}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">${fee.totalFees}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 font-medium">${fee.paidAmount}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${fee.outstandingAmount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${fee.outstandingAmount}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(fee.status)}
                      <Badge variant={getStatusColor(fee.status)}>
                        {fee.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{fee.parent}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="outline" size="sm">
                        Record Payment
                      </Button>
                      <Button variant="ghost" size="sm">
                        Send Reminder
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>Recent fee payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {feeData.filter(f => f.lastPayment).map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {payment.studentName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{payment.studentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.lastPayment).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">+${payment.paidAmount}</p>
                  <p className="text-xs text-muted-foreground">Payment</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fee Categories</CardTitle>
            <CardDescription>Breakdown by fee type</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Tuition Fees</span>
                <span className="font-medium">$1,200</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Lab Fees</span>
                <span className="font-medium">$150</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Sports Fees</span>
                <span className="font-medium">$75</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Library Fees</span>
                <span className="font-medium">$25</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="font-medium">Total</span>
                <span className="font-bold">$1,450</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Fees;
