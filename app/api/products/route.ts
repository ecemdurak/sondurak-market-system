import {
    createProductController,
    getProductsController, //ürün getirir
} from "@/backend/controllers/product.controller";
import { NextResponse } from "next/server";
import { isValidAdminRequest } from "@/lib/adminAuth";

//ürünleri getirmesi için conntrollera yönlendiriyo
export async function GET() {
    return getProductsController();
}

export async function POST(request: Request) {
    if (!isValidAdminRequest(request)) {
        return NextResponse.json(
            { message: "Unauthorized." },
            { status: 401 }
        );
    }

    return createProductController(request);
}