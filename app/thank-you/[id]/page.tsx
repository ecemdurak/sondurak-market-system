import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ThankYouCard } from "../../components/thank-you/ThankYouCard";
import type { Order } from "../../types/order";

async function getOrder(id: string): Promise<Order | null> {
    const response = await fetch(`http://localhost:3000/api/orders/${id}`, {
        cache: "no-store",
    });

    if (!response.ok) {
        return null;
    }

    return response.json();
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
