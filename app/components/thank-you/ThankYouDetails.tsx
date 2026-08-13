type ThankYouDetailsProps = {
    merchantReference: string;
    paymentStatus: string;
    email: string;
    totalPrice: number | string;
    currency: string;
    t: (key: string) => string;
};

export function ThankYouDetails({
    merchantReference,
    paymentStatus,
    email,
    totalPrice,
    currency,
    t,
}: ThankYouDetailsProps) {
    return (
        <div className="thank-you-details">
            <div>
                <span>{t("orderNo")}</span>
                <strong>{merchantReference}</strong>
            </div>

            <div>
                <span>{t("paymentStatus")}</span>
                <strong>{paymentStatus}</strong>
            </div>

            <div>
                <span>{t("email")}</span>
                <strong>{email}</strong>
            </div>

            <div>
                <span>{t("total")}</span>
                <strong>
                    {Number(totalPrice).toFixed(2)} {currency}
                </strong>
            </div>
        </div>
    );
}