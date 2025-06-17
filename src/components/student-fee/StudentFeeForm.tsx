
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormData } from './types';

interface StudentFeeFormProps {
  formData: FormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StudentFeeForm: React.FC<StudentFeeFormProps> = ({ formData, onInputChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <Input
          id="mobileNumber"
          name="mobileNumber"
          type="tel"
          value={formData.mobileNumber}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="roomNumber">Room Number</Label>
        <Input
          id="roomNumber"
          name="roomNumber"
          type="number"
          value={formData.roomNumber}
          onChange={onInputChange}
        />
      </div>

      <div>
        <Label htmlFor="month">Month *</Label>
        <Input
          id="month"
          name="month"
          type="month"
          value={formData.month}
          onChange={onInputChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="amount">Amount to Pay *</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={onInputChange}
          placeholder="Enter amount in INR"
          required
        />
      </div>
    </div>
  );
};

export default StudentFeeForm;
