import { NextResponse } from "next/server";
import { isValidAdminRequest } from "@/lib/adminAuth";
import {
    createOrderController,
    getOrdersController,
} from "@/backend/controllers/order.controller";

export async function GET(request: Request) {
    if (!isValidAdminRequest(request)) {
        return NextResponse.json(
            { message: "Unauthorized." },
            { status: 401 }
        );
    }

    return getOrdersController();
}

export async function POST(request: Request) {
    return createOrderController(request);
}