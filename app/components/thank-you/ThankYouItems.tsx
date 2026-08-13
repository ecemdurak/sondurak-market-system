import type { OrderItem } from "../../types/order";

type ThankYouItemsProps = {
    items: OrderItem[];
    currency: string;
    title: string;
};

export function ThankYouItems({
    items,
    currency,
    title,
}: ThankYouItemsProps) {
    return (
        <>
            <h2>{title}</h2>

            <div className="thank-you-items">
                {items.map((item) => (
                    <div className="thank-you-item" key={item.id}>
                        <div>
                            <strong>{item.productTitle}</strong>
                            <span>
                                {Number(item.unitPrice).toFixed(2)} {currency} x
                                {item.quantity}
                            </span>
                        </div>

                        <strong>
                            {Number(item.totalPrice).toFixed(2)} {currency}
                        </strong>
                    </div>
                ))}
            </div>
        </>
    );
}