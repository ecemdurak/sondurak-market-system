import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

type PaymentModalProps = {
    paymentLink: string;
    onClose: () => void;
};

export function PaymentModal({ paymentLink, onClose }: PaymentModalProps) {
    const t = useTranslations("checkout");

    if (!paymentLink) {
        return null;
    }

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                <div className="payment-modal-header">
                    <h2>
                        <Icon icon="solar:shield-check-bold" width={22} height={22} />
                        {t("securePayment")}
                    </h2>

                    <button type="button" onClick={onClose} aria-label={t("closePayment")}>
                        <Icon icon="solar:close-circle-bold" width={24} height={24} />
                    </button>
                </div>

                <iframe
                    src={paymentLink}
                    title={t("paymentFrameTitle")}
                    className="payment-modal-frame"
                    allow="payment"
                />
            </div>
        </div>
    );
}
