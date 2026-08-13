export type OrderItem = {
  id: number;
  productTitle: string;
  quantity: number;
  unitPrice: number | string;
  totalPrice: number | string;
};

export type Order = {
  id: number;
  merchantReference?: string;
  firstName: string;
  lastName: string;
  email: string;
  totalPrice: number | string;
  currency: string;
  paymentStatus: string;
  createdAt?: string;
  items?: OrderItem[];
};