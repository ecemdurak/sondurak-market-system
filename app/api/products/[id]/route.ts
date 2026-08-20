import { NextResponse } from "next/server";
import { isValidAdminRequest } from "@/lib/adminAuth";
import {
    deleteProductController,
    updateProductController,
} from "@/backend/controllers/product.controller";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isValidAdminRequest(request)) {
        return NextResponse.json(
            { message: "Unauthorized." },
            { status: 401 }
        );
    }

    const { id } = await params;

    return updateProductController(request, id);
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isValidAdminRequest(request)) {
        return NextResponse.json(
            { message: "Unauthorized." },
            { status: 401 }
        );
    }

    const { id } = await params;

    return deleteProductController(id);
}