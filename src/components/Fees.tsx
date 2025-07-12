
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Filter, Download, CreditCard, AlertCircle, CheckCircle, Plus, Loader2, MoreVertical } from 'lucide-react';
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
import { Progress } from '@/components/ui/progress';
import { useFees, useDeleteFee, type Fee } from '@/hooks/useFees';
import { FeeForm } from './FeeForm';

const Fees = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);

  const { data: fees, isLoading, error } = useFees();
  const deleteFee = useDeleteFee();

  const filteredFees = useMemo(() => {
    if (!fees) return [];
    
    return fees.filter(fee =>
      fee.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.fee_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [fees, searchQuery]);

  const stats = useMemo(() => {
    if (!fees) return {
      totalCollected: 0,
      totalOutstanding: 0,
      totalExpected: 0,
      collectionRate: 0,
      fullyPaidCount: 0
    };

    const totalCollected = fees.reduce((sum, fee) => sum + fee.amount_paid, 0);
    const totalOutstanding = fees.reduce((sum, fee) => sum + fee.outstanding_amount, 0);
    const totalExpected = fees.reduce((sum, fee) => sum + fee.amount_due, 0);
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
    const fullyPaidCount = fees.filter(f => f.status === 'paid').length;

    return {
      totalCollected,
      totalOutstanding,
      totalExpected,
      collectionRate,
      fullyPaidCount
    };
  }, [fees]);

  const handleEdit = (fee: Fee) => {
    setSelectedFee(fee);
    setIsFormOpen(true);
  };

  const handleDelete = async (fee: Fee) => {
    if (window.confirm(`Are you sure you want to delete the fee record for ${fee.student_name}?`)) {
      await deleteFee.mutateAsync(fee.id);
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedFee(null);
  };

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

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-destructive">Error loading fees</h3>
          <p className="text-muted-foreground mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

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
          <Button className="flex items-center gap-2" onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Fee Record
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${stats.totalCollected.toFixed(2)}</CardTitle>
            <CardDescription>Total Collected</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress value={stats.collectionRate} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{stats.collectionRate}% collection rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-red-600">${stats.totalOutstanding.toFixed(2)}</CardTitle>
            <CardDescription>Outstanding Amount</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">${stats.totalExpected.toFixed(2)}</CardTitle>
            <CardDescription>Total Expected</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{stats.fullyPaidCount}</CardTitle>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading fees...</span>
            </div>
          ) : filteredFees.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Fee Type</TableHead>
                  <TableHead>Total Fees</TableHead>
                  <TableHead>Paid Amount</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Parent/Guardian</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {fee.student_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{fee.student_name}</div>
                          <div className="text-sm text-muted-foreground">{fee.student_id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{fee.fee_type}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">${fee.amount_due.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-green-600 font-medium">${fee.amount_paid.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${fee.outstanding_amount > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ${fee.outstanding_amount.toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {fee.due_date ? new Date(fee.due_date).toLocaleDateString() : '-'}
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
                      <span className="text-sm">{fee.parent_name || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(fee)}>
                            Edit Fee
                          </DropdownMenuItem>
                          <DropdownMenuItem>Record Payment</DropdownMenuItem>
                          <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(fee)}
                          >
                            Delete Fee
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No fee records found</h3>
              <p className="text-muted-foreground mb-4">Add fee records to get started</p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fee Record
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <FeeForm
        open={isFormOpen}
        onOpenChange={handleFormClose}
        feeData={selectedFee}
      />
    </div>
  );
};

export default Fees;
