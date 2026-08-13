import { CreateOrderDto, UpdateOrderPaymentDto } from "../dtos/order.dto";
import * as orderRepository from "../repository/order.repository";

export async function getOrders() {
    return orderRepository.getOrders();
}

function isInvalidId(id: number) {
    return !Number.isInteger(id) || id <= 0;
}

function isBlank(value: string) {
    return typeof value !== "string" || value.trim().length === 0;
}

function isInvalidPositiveNumber(value: number) {
    return typeof value !== "number" || !Number.isFinite(value) || value <= 0;
}

function isInvalidEmail(email: string) {
    return isBlank(email) || !email.includes("@");
}

function isInvalidQuantity(quantity: number) {
    return (
        typeof quantity !== "number" ||
        !Number.isInteger(quantity) ||
        quantity <= 0
    );
}

export async function getOrderById(id: number) {
    if (isInvalidId(id)) {
        throw new Error("Order id must be a positive number.");
    }

    return orderRepository.getOrderById(id);
}

export async function createOrder(data: CreateOrderDto) {
    if (!data) {
        throw new Error("Order data is required.");
    }

    if (isBlank(data.merchantReference)) {
        throw new Error("Merchant reference is required.");
    }

    if (isBlank(data.firstName) || isBlank(data.lastName)) {
        throw new Error("Customer name is required.");
    }

    if (isInvalidEmail(data.email)) {
        throw new Error("Valid customer email is required.");
    }

    if (isBlank(data.phone)) {
        throw new Error("Customer phone is required.");
    }

    if (
        isBlank(data.address) ||
        isBlank(data.city) ||
        isBlank(data.district) ||
        isBlank(data.postalCode)
    ) {
        throw new Error("Customer address information is required.");
    }

    if (isInvalidPositiveNumber(data.totalPrice)) {
        throw new Error("Order total price must be greater than 0.");
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error("Order items are required.");
    }

    for (const item of data.items) {
        if (isBlank(item.productTitle)) {
            throw new Error("Order item product title is required.");
        }

        if (isInvalidPositiveNumber(item.unitPrice)) {
            throw new Error("Order item unit price must be greater than 0.");
        }

        if (isInvalidQuantity(item.quantity)) {
            throw new Error("Order item quantity must be a positive integer.");
        }

        if (isInvalidPositiveNumber(item.totalPrice)) {
            throw new Error("Order item total price must be greater than 0.");
        }
    }

    return orderRepository.createOrder(data);
}

export async function updateOrderPaymentById(
    id: number,
    data: UpdateOrderPaymentDto
) {
    if (isInvalidId(id)) {
        throw new Error("Order id must be a positive number.");
    }

    if (!data) {
        throw new Error("Order payment data is required.");
    }

    const updateData: UpdateOrderPaymentDto = {};

    if (typeof data.paymentStatus !== "undefined") {
        updateData.paymentStatus = data.paymentStatus;
    }

    if (typeof data.paymentLink !== "undefined") {
        updateData.paymentLink = data.paymentLink;
    }

    if (typeof data.paymentToken !== "undefined") {
        updateData.paymentToken = data.paymentToken;
    }

    if (Object.keys(updateData).length === 0) {
        throw new Error("At least one payment field is required.");
    }

    return orderRepository.updateOrderPaymentById(id, updateData);
}

