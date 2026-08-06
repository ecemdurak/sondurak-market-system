import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const order = await prisma.order.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                items: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { message: "Order not found." },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order fetch error:", error);

        return NextResponse.json(
            { message: "Order could not be fetched." },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const updateData: {
            paymentStatus?: string;
            paymentLink?: string | null;
            paymentToken?: string | null;
        } = {};

        if (typeof body.paymentStatus !== "undefined") {
            updateData.paymentStatus = body.paymentStatus;
        }

        if (typeof body.paymentLink !== "undefined") {
            updateData.paymentLink = body.paymentLink;
        }

        if (typeof body.paymentToken !== "undefined") {
            updateData.paymentToken = body.paymentToken;
        }

        const order = await prisma.order.update({
            where: {
                id: Number(id),
            },
            data: updateData,
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error("Order update error:", error);

        return NextResponse.json(
            { message: "Order could not be updated." },
            { status: 500 }
        );
    }
}
