export const MEMBERS = ['Suryansh', 'Suhana', 'Tanusri', 'Subhranil'] as const;

export const PAYMENT_METHODS = [
  'Debit Card', 'Net Banking', 'Google Pay', 'PhonePe', 'Paytm', 'UPI',
] as const;

export const INITIAL_BALANCE = 200000;

export const inr = (n: number) => '₹' + Number(n).toLocaleString('en-IN');