
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  const variants = {
    paid: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    overdue: 'bg-red-100 text-red-800'
  };
  
  return React.createElement(Badge, {
    className: variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'
  }, status);
};

export const calculatePaymentStats = (fees: any[]) => {
  const totalAmount = fees.reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
  const totalPaid = fees
    .filter(fee => fee.status === 'paid')
    .reduce((sum, fee) => sum + parseFloat(fee.amount), 0);
  const totalPending = totalAmount - totalPaid;
  
  return {
    totalPaid,
    totalPending,
    totalAmount
  };
};
