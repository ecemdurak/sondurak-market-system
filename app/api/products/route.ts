import {
    createProductController,
    getProductsController,
} from "@/backend/controllers/product.controller";

export async function GET() {
    return getProductsController();
}

export async function POST(request: Request) {
    return createProductController(request);
}