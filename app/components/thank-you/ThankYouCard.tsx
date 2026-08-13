import type { Order } from "../../types/order";
import { ThankYouActions } from "./ThankYouActions";
import { ThankYouDetails } from "./ThankYouDetails";
import { ThankYouItems } from "./ThankYouItems";

type ThankYouCardProps = {
    order: Order;
    paymentStatus: string;
    t: (key: string, values?: Record<string, string>) => string;
};

export function ThankYouCard({
    order,
    paymentStatus,
    t,
}: ThankYouCardProps) {
    return (
        <section className="thank-you-card">
            <p className="thank-you-status">{t("orderCreated")}</p>

            <h1>{t("thanks", { name: order.firstName })}</h1>

            <p>{t("description")}</p>

            <ThankYouDetails
                merchantReference={order.merchantReference || String(order.id)}
                paymentStatus={paymentStatus}
                email={order.email}
                totalPrice={order.totalPrice}
                currency={order.currency}
                t={t}
            />

            <ThankYouItems
                items={order.items || []}
                currency={order.currency}
                title={t("items")}
            />

            <ThankYouActions continueShoppingText={t("continueShopping")} />
        </section>
    );
}