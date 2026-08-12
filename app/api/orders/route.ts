import {
    createOrderController,
    getOrdersController,
} from "@/backend/controllers/order.controller";

export async function GET() {
    return getOrdersController();
}

export async function POST(request: Request) {
    return createOrderController(request);
}