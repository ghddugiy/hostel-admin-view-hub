
export interface FormData {
  mobileNumber: string;
  name: string;
  email: string;
  roomNumber: string;
  month: string;
  amount: string;
  feeType: string;
}

export interface PaymentHandlerProps {
  formData: FormData;
  onPaymentStart: () => void;
  onPaymentEnd: () => void;
  onSaveStart: () => void;
  onSaveEnd: () => void;
}
