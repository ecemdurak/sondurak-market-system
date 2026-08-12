import { NextResponse } from "next/server";
import * as orderService from "@/backend/services/order.service";

export async function getOrdersController() {
    try {
        const orders = await orderService.getOrders();

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders fetch error:", error);

        return NextResponse.json(
            { message: "Orders could not be fetched." },
            { status: 500 }
        );
    }
}

export async function createOrderController(request: Request) {
    try {
        const body = await request.json();
        const order = await orderService.createOrder(body);

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order create error:", error);

        return NextResponse.json(
            { message: "Order could not be created." },
            { status: 500 }
        );
    }
}

export async function getOrderByIdController(id: string) {
    try {
        const order = await orderService.getOrderById(Number(id));

        if (!order) {
            return NextResponse.json(
                { message: "Order not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order fetch error:", error);

        return NextResponse.json(
            { message: "Order could not be fetched." },
            { status: 500 }
        );
    }
}

export async function updateOrderPaymentController(
    request: Request,
    id: string
) {
    try {
        const body = await request.json();

        const order = await orderService.updateOrderPaymentById(Number(id), body);

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order update error:", error);

        return NextResponse.json(
            { message: "Order could not be updated." },
            { status: 500 }
        );
    }
}
