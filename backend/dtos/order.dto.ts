//Siparişin içindeki ürün satırı
export type CreateOrderItemDto = {
    productId?: number | null;
    productTitle: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
};

//Yeni sipariş oluştururken gelen body.
export type CreateOrderDto = {
    merchantReference: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    totalPrice: number;
    currency?: string;
    paymentStatus?: string;
    paymentLink?: string | null;
    paymentToken?: string | null;
    items: CreateOrderItemDto[];
};

//Siparişin ödeme durumunu güncellerken gelen body.
export type UpdateOrderPaymentDto = {
    paymentStatus?: string;
    paymentLink?: string | null;
    paymentToken?: string | null;
};