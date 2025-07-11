
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle, IndianRupee, CreditCard } from 'lucide-react';
import { getStatusBadge } from './feeUtils';

interface Fee {
  id: string;
  amount: string;
  due_date: string;
  fee_type: string;
  status: string;
  paid_date: string | null;
  students?: {
    name: string;
    room_number: number;
    email: string;
    phone: string;
  };
}

interface FeeTableProps {
  fees: Fee[];
  onMarkAsPaid: (id: string) => void;
}

const FeeTable: React.FC<FeeTableProps> = ({ fees, onMarkAsPaid }) => {
  const getPaymentMethodIcon = (status: string, paidDate: string | null) => {
    if (status === 'paid' && paidDate) {
      return <CreditCard className="h-4 w-4 text-blue-600 mr-1" />;
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <IndianRupee className="mr-2 h-5 w-5" />
          Fee Management & Payment Tracking
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Fee Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.map((fee) => (
              <TableRow key={fee.id}>
                <TableCell className="font-medium">
                  {fee.students?.name || 'Unknown'}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{fee.students?.email || 'No email'}</div>
                    <div className="text-gray-500">{fee.students?.phone || 'No phone'}</div>
                  </div>
                </TableCell>
                <TableCell>{fee.students?.room_number || 'N/A'}</TableCell>
                <TableCell>{fee.fee_type}</TableCell>
                <TableCell className="font-medium">₹{fee.amount}</TableCell>
                <TableCell>{new Date(fee.due_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {getPaymentMethodIcon(fee.status, fee.paid_date)}
                    <span className="text-sm">
                      {fee.paid_date ? new Date(fee.paid_date).toLocaleDateString() : 'Not paid'}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(fee.status)}</TableCell>
                <TableCell>
                  {fee.status !== 'paid' && (
                    <Button
                      size="sm"
                      onClick={() => onMarkAsPaid(fee.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Mark Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {fees.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No fee records found. Student fee payments will appear here automatically.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeeTable;
