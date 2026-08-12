export type OrderItemEntity = {
    id: number;
    orderId: number;
    productId: number | null;
    productTitle: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    createdAt: Date;
};