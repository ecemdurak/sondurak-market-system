import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Orders fetch error:", error);

        return NextResponse.json(
            { message: "Orders could not be fetched." },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const order = await prisma.order.create({
            data: {
                merchantReference: body.merchantReference,
                firstName: body.firstName,
                lastName: body.lastName,
                email: body.email,
                phone: body.phone,
                address: body.address,
                city: body.city,
                district: body.district,
                postalCode: body.postalCode,
                totalPrice: body.totalPrice,
                currency: body.currency || "TRY",
                paymentStatus: body.paymentStatus || "pending",
                paymentLink: body.paymentLink || null,
                paymentToken: body.paymentToken || null,

                items: {
                    create: body.items.map((item: any) => ({
                        productId: item.productId || null,
                        productTitle: item.productTitle,
                        unitPrice: item.unitPrice,
                        quantity: item.quantity,
                        totalPrice: item.totalPrice,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Order create error:", error);

        return NextResponse.json(
            { message: "Order could not be created." },
            { status: 500 }
        );
    }
}