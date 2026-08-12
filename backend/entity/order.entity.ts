import { OrderItemEntity } from "./order-item.entity";

export type OrderEntity = {
    id: number;
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
    currency: string;
    paymentStatus: string;
    paymentLink: string | null;
    paymentToken: string | null;
    createdAt: Date;
    updatedAt: Date;
    items: OrderItemEntity[];
};