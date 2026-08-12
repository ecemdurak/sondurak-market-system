import {
    getOrderByIdController,
    updateOrderPaymentController,
} from "@/backend/controllers/order.controller";

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return getOrderByIdController(id);
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    return updateOrderPaymentController(request, id);
}