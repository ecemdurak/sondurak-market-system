import { prisma } from "@/lib/prisma";
import { CreateOrderDto, UpdateOrderPaymentDto } from "../dtos/order.dto";

export async function getOrders() {
    return prisma.order.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            items: true,
        },
    });
}

export async function getOrderById(id: number) {
    return prisma.order.findUnique({
        where: {
            id,
        },
        include: {
            items: true,
        },
    });
}

export async function createOrder(data: CreateOrderDto) {
    return prisma.order.create({
        data: {
            merchantReference: data.merchantReference,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            district: data.district,
            postalCode: data.postalCode,
            totalPrice: data.totalPrice,
            currency: data.currency || "TRY",
            paymentStatus: data.paymentStatus || "pending",
            paymentLink: data.paymentLink || null,
            paymentToken: data.paymentToken || null,
            items: {
                create: data.items.map((item) => ({
                    productId: item.productId || null,
                    productTitle: item.productTitle,
                    unitPrice: item.unitPrice,
                    quantity: item.quantity,
                    totalPrice: item.totalPrice,
                })),
            },
        },
        include: {
            items: true,
        },
    });
}

export async function updateOrderPaymentById(
    id: number,
    data: UpdateOrderPaymentDto
) {
    return prisma.order.update({
        where: {
            id,
        },
        data,
    });
}