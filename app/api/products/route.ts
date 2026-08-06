import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

    return NextResponse.json(products);
}
export async function POST(request: Request) {
    try {
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                title: body.title,
                price: body.price,
                image: body.image || null,
                category: body.category || null,
                barcode: body.barcode || null,
                description: body.description || null,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Product create error:", error);

        return NextResponse.json(
            { message: "Product could not be created." },
            { status: 500 }
        );
    }
}