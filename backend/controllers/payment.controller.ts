import { NextResponse } from "next/server";
import * as paymentService from "@/backend/services/payment.service";

export async function createPaymentController(request: Request) {
    try {
        const requestBody = await request.json();

        const paymentResponse = await paymentService.createPayment(requestBody);

        return NextResponse.json(paymentResponse.data, {
            status: paymentResponse.status,
        });
    } catch (error) {
        console.error("SanalPosPRO payment error:", error);

        return NextResponse.json(
            {
                status: "error",
                message: "Unexpected error occurred while creating payment.",
            },
            { status: 500 }
        );
    }
}