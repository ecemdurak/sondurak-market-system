import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

type CheckoutCartItem = {
    id?: number | string;
    title: string;
    price: number | string;
    quantity?: number;
};

type CheckoutSummaryProps = {
    cart: CheckoutCartItem[];
    totalPrice: number;
    isLoading: boolean;
    message: string;
    onCreatePayment: () => void;
};

export function CheckoutSummary({
    cart,
    totalPrice,
    isLoading,
    message,
    onCreatePayment,
}: CheckoutSummaryProps) {
    const t = useTranslations("checkout");

    return (
        <section className="checkout-summary">
            <h2>
                <Icon icon="solar:bill-list-bold" width={22} height={22} />
                {t("orderSummary")}
            </h2>

            {cart.length === 0 ? (
                <p>{t("emptyCart")}</p>
            ) : (
                cart.map((item, index) => (
                    <div className="checkout-item" key={`${item.id}-${index}`}>
                        <span>
                            {item.title} x{item.quantity || 1}
                        </span>

                        <strong>
                            {(Number(item.price) * (item.quantity || 1)).toFixed(2)} TL
                        </strong>
                    </div>
                ))
            )}

            <h3>{t("total")}: {totalPrice.toFixed(2)} TL</h3>

            <button
                type="button"
                onClick={onCreatePayment}
                disabled={isLoading || cart.length === 0}
            >
                <Icon icon="solar:card-bold" width={20} height={20} />
                {isLoading ? t("preparingPayment") : t("startPayment")}
            </button>

            {message && <p className="payment-error">{message}</p>}
        </section>
    );
}
