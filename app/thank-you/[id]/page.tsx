import Link from "next/link";
import { getTranslations } from "next-intl/server";

type OrderItem = {
    id: number;
    productTitle: string;
    unitPrice: string;
    quantity: number;
    totalPrice: string;
};

type Order = {
    id: number;
    merchantReference: string;
    firstName: string;
    lastName: string;
    email: string;
    totalPrice: string;
    currency: string;
    paymentStatus: string;
    items: OrderItem[];
};

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
            <section className="thank-you-card">
                <p className="thank-you-status">{t("orderCreated")}</p>

                <h1>{t("thanks", { name: order.firstName })}</h1>

                <p>{t("description")}</p>

                <div className="thank-you-details">
                    <div>
                        <span>{t("orderNo")}</span>
                        <strong>{order.merchantReference}</strong>
                    </div>

                    <div>
                        <span>{t("paymentStatus")}</span>
                        <strong>{paymentStatus}</strong>
                    </div>

                    <div>
                        <span>{t("email")}</span>
                        <strong>{order.email}</strong>
                    </div>

                    <div>
                        <span>{t("total")}</span>
                        <strong>
                            {Number(order.totalPrice).toFixed(2)} {order.currency}
                        </strong>
                    </div>
                </div>

                <h2>{t("items")}</h2>

                <div className="thank-you-items">
                    {order.items.map((item) => (
                        <div className="thank-you-item" key={item.id}>
                            <div>
                                <strong>{item.productTitle}</strong>
                                <span>
                                    {Number(item.unitPrice).toFixed(2)} {order.currency} x
                                    {item.quantity}
                                </span>
                            </div>

                            <strong>
                                {Number(item.totalPrice).toFixed(2)} {order.currency}
                            </strong>
                        </div>
                    ))}
                </div>

                <div className="thank-you-actions">
                    <Link href="/">{t("continueShopping")}</Link>
                </div>
            </section>
        </main>
    );
}
