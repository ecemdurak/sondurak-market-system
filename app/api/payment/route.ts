import { createPaymentController } from "@/backend/controllers/payment.controller";

export const runtime = "nodejs";

export async function POST(request: Request) {
    return createPaymentController(request);
}