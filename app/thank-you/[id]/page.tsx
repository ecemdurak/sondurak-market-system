import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getOrderById } from "@/backend/services/order.service";
import { ThankYouCard } from "../../components/thank-you/ThankYouCard";
import type { Order } from "../../types/order";

async function getOrder(id: string): Promise<Order | null> {
    const orderId = Number(id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
        return null;
    }

    const order = await getOrderById(orderId);

    if (!order) {
        return null;
    }

    return {
        ...order,
        totalPrice: order.totalPrice.toString(),
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
            ...item,
            unitPrice: item.unitPrice.toString(),
            totalPrice: item.totalPrice.toString(),
        })),
    };
}

export default async function ThankYouPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const t = await getTranslations("thankYou");
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
        return (
            <main className="thank-you-page">
                <section className="thank-you-card">
                    <h1>{t("notFoundTitle")}</h1>
                    <p>{t("notFoundDescription")}</p>
                    <Link href="/">{t("backToHome")}</Link>
                </section>
            </main>
        );
    }

    const paymentStatus =
        order.paymentStatus === "paid"
            ? t("paymentPaid")
            : order.paymentStatus === "active"
                ? t("paymentPending")
                : order.paymentStatus;

    return (
        <main className="thank-you-page">
            <ThankYouCard
                order={order}
                paymentStatus={paymentStatus}
                t={t}
            />
        </main>
    );
}
