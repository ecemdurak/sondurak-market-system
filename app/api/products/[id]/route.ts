import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const product = await prisma.product.update({
            where: {
                id: Number(id),
            },
            data: {
                title: body.title,
                price: body.price,
                image: body.image || null,
                category: body.category || null,
                barcode: body.barcode || null,
                description: body.description || null,
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Product update error:", error);

        return NextResponse.json(
            { message: "Product could not be updated." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await prisma.product.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({ message: "Product deleted." });
    } catch (error) {
        console.error("Product delete error:", error);

        return NextResponse.json(
            { message: "Product could not be deleted." },
            { status: 500 }
        );
    }
}